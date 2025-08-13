// app/api/interview/[sessionId]/messages/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest, 
    context: {params: {sessionId: string} }) {
  try {
    const { sessionId } = context.params;
    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 });
  }
}
