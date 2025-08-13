import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Toggle for local dev without auth
const REQUIRE_AUTH = true;

// Narrow settings shape we expect from the client
type CreateSessionSettings = {
  persona?: string;
  language?: string; // e.g., "English" or "en"
  company?: string;
  jobRole?: string;
  interviewKind?: "behavioral" | "technical" | "leadership";
  difficulty?: "easy" | "medium" | "hard";
  topics?: string[];
};

// Helpers to normalize kind/difficulty when not explicitly given
function normalizeKind(kind?: string, outlineType?: string): "behavioral" | "technical" | "leadership" {
  const v = (kind ?? outlineType ?? "").toLowerCase();
  if (v.includes("behav")) return "behavioral";
  if (v.includes("lead")) return "leadership";
  // system design / coding / dsa / technical -> technical
  return "technical";
}

function normalizeDifficulty(d?: string, outlineDifficulty?: string): "easy" | "medium" | "hard" {
  const v = (d ?? outlineDifficulty ?? "").toLowerCase();
  if (v.startsWith("e")) return "easy";
  if (v.startsWith("h")) return "hard";
  return "medium";
}

export async function POST(req: NextRequest) {
  try {
    // 1) Auth (or bypass in dev)
    let userId: string | null = null;
    if (REQUIRE_AUTH) {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.id) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
      userId = session.user.id;
    } else {
      userId = "dev-user-123";
    }

    // 2) Parse input
    const body = await req.json();
    const { outlineId, settings } = body as { outlineId?: string; settings?: CreateSessionSettings };

    if (!outlineId || !settings) {
      return NextResponse.json({ error: "Missing outlineId or settings" }, { status: 400 });
    }

    // 3) Fetch outline/template
    const outline = await prisma.interview.findUnique({ where: { id: outlineId } });
    if (!outline) {
      return NextResponse.json({ error: "Interview outline not found" }, { status: 404 });
    }

    // 4) Derive normalized session metadata
    const company       = settings.company ?? null;             // outline.title might contain company, but we don't guess
    const jobRole       = settings.jobRole ?? outline.role ?? null;
    const interviewKind = normalizeKind(settings.interviewKind, outline.type);
    const difficulty    = normalizeDifficulty(settings.difficulty, outline.difficulty);
    const language      = settings.language ?? "English";

    // 5) Create session (dual-write: columns + settings)
    const interSession = await prisma.interviewSession.create({
      data: {
        userId: userId!,
        interviewId: outlineId,           // link session back to template
        title: outline.title,
        description: outline.description,

        // NEW columns (queryable)
        company,
        jobRole,
        interviewKind,                    // stored as string in your current schema
        difficulty,                       // stored as string in your current schema
        language,

        // Keep JSON for long-tail knobs + backward compatibility
        settings: {
          ...settings,
          company,
          jobRole,
          interviewKind,
          difficulty,
          language,
        },
      },
      select: { id: true, company: true, jobRole: true, interviewKind: true, difficulty: true, language: true, title: true },
    });

    return NextResponse.json({ sessionId: interSession.id, session: interSession });
  } catch (error) {
    console.error("Create session error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
