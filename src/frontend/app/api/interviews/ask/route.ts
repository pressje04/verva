// app/api/interview/ask/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCompanyProfile } from '@/lib/companyProfiles';
import { getRoleBlueprint } from '@/lib/roleBlueprints';
import { templates } from '@/lib/questionTemplates';

// Minimal topic list (extend as needed)
const DEFAULT_TOPICS = [
  'Intro',
  'Teamwork',
  'Conflict',
  'Ownership',
  'Communication',
  'Time Management',
  'Learning from Failure',
  'DSA',
  'System Design',
  'Concurrency',
  'APIs & Integration',
  'Testing & Debugging',
];

// --- NEW: tiny helpers to detect near-duplicates ---------------------------
function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
function jaccardSimilarity(a: string, b: string) {
  const A = new Set(normalize(a).split(' ').filter(Boolean));
  const B = new Set(normalize(b).split(' ').filter(Boolean));
  const inter = [...A].filter(x => B.has(x)).length;
  const union = new Set([...A, ...B]).size || 1;
  return inter / union;
}
function isTooSimilar(a: string, b: string, threshold = 0.80) {
  return jaccardSimilarity(a, b) >= threshold;
}
// your bubbles are "brief_feedback\n\nquestion" — grab the question part
function extractQuestionFromBubble(content: string) {
  const parts = content.split('\n\n');
  return parts[parts.length - 1].trim();
}

// For topic selection plans - Randomized but not entirely random
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleDeterministic<T>(arr: T[], seedStr: string) {
  const seed = seedStr.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rand = mulberry32(seed || 1);
  const a = [...arr];
  // Fisher–Yates using seeded rand
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


// --- (no other changes above here) -----------------------------------------

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, userTurn, settings } = body as {
      sessionId: string;
      userTurn?: string | null; // null or undefined when initiating
      settings?: {
        persona?: string;
        difficulty?: string;
        language?: string;
        jobRole?: string;
        company?: string;
        interviewKind?: string;
      };
    };

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!interviewSession || interviewSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 403 });
    }

    // --- Topic tracking state (persisted in InterviewSession.settings.meta.coveredTopics)
    const persistedSettings = (interviewSession.settings ?? {}) as any;
    const coveredTopics: string[] = Array.isArray(persistedSettings?.meta?.coveredTopics)
      ? [...persistedSettings.meta.coveredTopics]
      : [];
    const remainingTopics = DEFAULT_TOPICS.filter(t => !coveredTopics.includes(t));

    // 1) Load history (more context -> better dedup)
    const history = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
      take: 50, // bumped from 30
    });

    // --- NEW: recent assistant questions to avoid repeating -----------------
    const recentAssistantQs = history
      .filter(m => m.role === 'ai')
      .slice(-6)
      .map(m => extractQuestionFromBubble(m.content));
    const avoidList = recentAssistantQs.length
      ? recentAssistantQs.map(q => `- ${q}`).join('\n')
      : '(none)';

      const profile = getCompanyProfile(settings?.company ?? interviewSession.company);
      const blueprint = getRoleBlueprint(settings?.jobRole ?? interviewSession.jobRole);

      function pick<T>(arr: T[] | undefined, fallback: string): string {
        if (!arr || !arr.length) return fallback;
        return String(arr[Math.floor(Math.random() * arr.length)]);
      }

      const roleName = (settings?.jobRole ?? interviewSession.jobRole ?? '').toLowerCase();
      const rolePeer = roleName.includes('backend') ? 'product manager' : 'frontend engineer';

      const verb = pick(blueprint.scenarioVerbs, 'deliver');
      const product = pick(profile?.products, 'a core product');
      const principle = pick(profile?.principles, 'a key company value');

     //const currentTopic = remainingTopics[0] ?? 'Wrap-up'
     const meta = { ...(persistedSettings?.meta ?? {}) };

    // Build the plan once (deterministic by sessionId)
      if (!Array.isArray(meta.topicPlan) || !Number.isInteger(meta.topicCursor)) {
        meta.topicPlan = shuffleDeterministic(DEFAULT_TOPICS, sessionId);
        meta.topicCursor = 0;

        await prisma.interviewSession.update({
          where: { id: sessionId },
          data: {
            settings: {
              ...persistedSettings,
              meta: { ...meta, coveredTopics },
            },
          },
        });
      }

      // Filter out already covered from the plan (in case of back/refresh)
      const plannedRemaining = (meta.topicPlan as string[]).filter(
        (t: string) => !coveredTopics.includes(t)
      );
      

      // Pick the next topic from the shuffled plan
      const currentTopic = plannedRemaining[0] ?? 'Wrap-up';


      // choose a template for the topic and fill slots
      const topicKey = currentTopic as keyof typeof templates;
      const base = pick(templates[topicKey], `Ask about ${currentTopic} in context of ${product}.`);
      const seed = base
        .replace('{verb}', verb)
        .replace('{product}', product)
        .replace('{rolePeer}', rolePeer);

    // 2) Build messages with a real system prompt (now includes AVOID list)
    const sys = {
      role: 'system',
      content: `
    You are a strict, turn-based ${settings?.persona ?? 'behavioral'} interviewer.
    Rules:
    - Ask EXACTLY one question per turn.
    - Never invent or simulate the candidate's answer.
    - After a user answer, give at most 1–2 concise sentences of feedback, then ask the next question.
    - Keep outputs short and human (no bullet lists).
    - Aim for 4–6 questions total.
    - Do NOT ask if the candidate is ready; the interview has already started.
    - Do not ask the same or very similar question.
    
    TOPICS:
    - All: ${DEFAULT_TOPICS.join(', ')}
    - Covered: ${coveredTopics.length ? coveredTopics.join(', ') : '(none)'}
    - Remaining: ${remainingTopics.length ? remainingTopics.join(', ') : '(none)'}
    
    CURRENT TOPIC (you must stick to this): ${currentTopic}
    
    SEED (must inform your question): "${seed}"
    Incorporate one relevant company principle such as "${principle}".
    
    AVOID REPEATING any of the recent questions:
    ${avoidList}
    
    Output JSON ONLY with this schema (no code fences, no extra keys):
    {"topic":"${currentTopic}","question": string, "brief_feedback": string}
    "brief_feedback" may be empty on the first turn.
    `.trim(),
    } as const;

    const prior = history.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    }));

    const messages = [sys, ...prior];

    // If this call carries a new user turn, append it; otherwise, we’re initiating
    if (userTurn && userTurn.trim()) {
      messages.push({ role: 'user', content: userTurn });
    } else if (prior.length === 0) {
      // Seed the opener if there is no history yet
      messages.push({
        role: 'user',
        content: 'Please start the interview with a short greeting and the first question.',
      });
    }

    // 3) Call Ollama (non-stream, JSON format, constrained length)
    const ollamaRes = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',               // e.g., "mistral" or "mistral:instruct"
        messages,
        stream: false,                  // easier parsing for MVP
        format: 'json',                 // ask for strict JSON
        options: {
          num_predict: 220,             // keep it short
          temperature: 0.3,
          stop: ['\n\nCandidate:', '\n\nUser:'], // belt-and-suspenders
        },
      }),
    });

    if (!ollamaRes.ok) {
      const errorText = await ollamaRes.text();
      console.error('Ollama error:', errorText);
      return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }

    type Payload = { topic?: string; question: string; brief_feedback?: string };

    let payload: Payload;
    try {
      const json = await ollamaRes.json();     // non-stream returns one object
      const raw = json?.message?.content ?? '';
      payload = JSON.parse(raw) as Payload;
    } catch (e) {
      const txt = await ollamaRes.text().catch(() => '');
      const match = txt.match(/\{[\s\S]*\}/);
      payload = match ? JSON.parse(match[0]) : { topic: remainingTopics[0] ?? 'Wrap-up', question: 'Let’s begin. Are you ready?', brief_feedback: '' };
    }

    // --- NEW: minimal server-side guardrail: ensure topic advances & dedup --
    const chosenTopic = currentTopic;
    // Check similarity vs. recent assistant questions; if too similar, retry once
    const looksDuplicate = recentAssistantQs.some(q => isTooSimilar(q, payload.question));
    if (looksDuplicate) {
      // Retry with a stronger "avoid" instruction
      const sysRetry = {
        role: 'system',
        content: `
You asked something too similar earlier. Ask a DIFFERENT question about the topic "${chosenTopic}".
AVOID these questions exactly and anything semantically close:
${avoidList}

Output JSON ONLY: {"topic":"${chosenTopic}","question":"<new question>","brief_feedback":""}
`.trim(),
      };
      const retryRes = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          messages: [sysRetry, ...prior, ...(userTurn ? [{ role: 'user', content: userTurn }] : [])],
          stream: false,
          format: 'json',
          options: { num_predict: 200, temperature: 0.3, stop: ['\n\nCandidate:', '\n\nUser:'] },
        }),
      });
      if (retryRes.ok) {
        try {
          const j = await retryRes.json();
          const rraw = j?.message?.content ?? '';
          const rp = JSON.parse(rraw) as Payload;
          if (rp?.question && !recentAssistantQs.some(q => isTooSimilar(q, rp.question))) {
            payload = { ...rp, topic: chosenTopic };
          }
        } catch { /* ignore and keep original payload */ }
      }
    }

    // Mark topic as covered + advance cursor + persist meta
    const plan: string[] = Array.isArray(meta.topicPlan)
    ? meta.topicPlan
    : shuffleDeterministic(DEFAULT_TOPICS, sessionId); // safety fallback

    if (chosenTopic !== 'Wrap-up' && !coveredTopics.includes(chosenTopic)) {
    coveredTopics.push(chosenTopic);
    }

    // Advance cursor to the item *after* the chosen topic (idempotent)
    const idxInPlan = plan.indexOf(chosenTopic);
    const nextCursor =
    idxInPlan >= 0
      ? idxInPlan + 1
      : Math.max( (meta.topicCursor ?? 0) + 1, 0 ); // fallback if topic not in plan

    await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      settings: {
        ...persistedSettings,
        meta: {
          ...meta,
          topicPlan: plan,
          topicCursor: nextCursor,
          coveredTopics,
        },
      },
    },
  });


    const finalAssistantText =
      (payload.brief_feedback ? `${payload.brief_feedback}\n\n` : '') + payload.question;

    // 4) Persist turns if a user turn came in (so history stays consistent)
    if (userTurn && userTurn.trim()) {
      await prisma.message.create({
        data: { sessionId, role: 'user', content: userTurn },
      });
    }
    await prisma.message.create({
      data: { sessionId, role: 'ai', content: finalAssistantText },
    });

    return NextResponse.json({
      topic: chosenTopic,
      question: payload.question,
      brief_feedback: payload.brief_feedback ?? '',
      response: finalAssistantText,
    });
  } catch (err) {
    console.error('Interview AI error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
