// lib/data.ts
import { prisma } from '@/lib/prisma';

export async function getInterviewSession(sessionId: string) {
  try {
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Interview session not found');
    }

    return session;
  } catch (error) {
    console.error('Error fetching interview session:', error);
    throw error;
  }
}
