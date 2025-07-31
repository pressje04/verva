import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all interview outlines
export async function GET() {
  const interviews = await prisma.interview.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(interviews);
}

// POST new interview outline
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, role, type, difficulty, timeEstimate, description, tags } = body;

  if (!title || !role || !type || !difficulty || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const interview = await prisma.interview.create({
    data: {
      title,
      role,
      type,
      difficulty,
      timeEstimate: timeEstimate || '',
      description,
      tags: tags || [],
    },
  });

  return NextResponse.json(interview, { status: 201 });
}
