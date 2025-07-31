import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Set this to false to skip auth temporarily for local dev
const REQUIRE_AUTH = true;

export async function POST(req: NextRequest) {
  try {
    let userId: string | null = null;

    if (REQUIRE_AUTH) {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.id) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
      userId = session.user.id;
    } else {
      // For testing without auth, use a hardcoded user or null
      userId = "dev-user-123";
    }

    const body = await req.json();
    const { outlineId, settings } = body;

    if (!outlineId || !settings) {
      return NextResponse.json(
        { error: "Missing outlineId or settings" },
        { status: 400 }
      );
    }

    const outline = await prisma.interview.findUnique({
      where: { id: outlineId },
    });

    if (!outline) {
      return NextResponse.json(
        { error: "Interview outline not found" },
        { status: 404 }
      );
    }

    const interSession = await prisma.interviewSession.create({
      data: {
        userId: userId!,
        title: outline.title,
        description: outline.description,
        settings,
      },
    });

    return NextResponse.json({ sessionId: interSession.id });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
