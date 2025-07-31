import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/interview-sessions
export async function GET(req: NextRequest) {
    //const session = await getServerSession(authOptions);
    //if (!session || !session.user?.id) {
      //return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //}
  
    const sessions = await prisma.interviewSession.findMany({
      //where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  
    return NextResponse.json(sessions);
  }
  