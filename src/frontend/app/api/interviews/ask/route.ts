// app/api/interview/ask/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    // 1) Load history
    const history = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
      take: 30,
    });

    // 2) Build messages with a real system prompt
    const sys = {
      role: 'system',
      content: `
You are a strict, turn-based ${settings?.persona ?? 'behavioral'} interviewer.
Rules:
- Ask EXACTLY one question per turn.
- Never invent or simulate the candidate's answer.
- After a user answer, give at most 1–2 concise sentences of feedback, then ask the next question.
- Keep outputs short.
- Don't be robotic. Be human and conversational. Maybe start with a greeting like how are you doing before actually starting the interview for authentic experience.
- You should ask around 4-6 questions, aiming for 5 unless you would like to expand upon something said by the candidate that was unclear
- Ask the user to confirm if they are ready to begin their ${settings?.interviewKind ?? 'behavioral'} interview with ${settings?.company || 'Capital One'} for the first question and await for them to say yes. Then begin asking the interview questions.
- Do not ask the same or very similar question more than once.
- Keep track of topics already discussed and move to a new topic each turn.
- If a topic has been covered in detail, transition to a different skill area or behavioral theme.
- Stay in ${settings?.language ?? 'English'} and target a ${settings?.difficulty ?? 'medium'} level.
${settings?.jobRole ? `- The role is ${settings.jobRole}.` : ''}
Output JSON ONLY with this schema:
{"question": string, "brief_feedback": string} 
"brief_feedback" may be an empty string for the very first turn.
`,
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

    type Payload = { question: string; brief_feedback?: string };

    let payload: Payload;
    try {
      const json = await ollamaRes.json();     // non-stream returns one object
      // For /api/chat non-stream, content is at json.message.content
      // but with format:"json" many models return JSON directly as the content
      const raw = json?.message?.content ?? '';
      payload = JSON.parse(raw) as Payload;
    } catch (e) {
      // Fallback: if the model ignored format, try to salvage with a tiny regex
      const txt = await ollamaRes.text().catch(() => '');
      const match = txt.match(/\{[\s\S]*\}/);
      payload = match ? JSON.parse(match[0]) : { question: 'Let’s begin. Are you ready?', brief_feedback: '' };
    }

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
      question: payload.question,
      brief_feedback: payload.brief_feedback ?? '',
      response: finalAssistantText, // for your existing UI
    });
  } catch (err) {
    console.error('Interview AI error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
