import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { sessionId } = params;
  const { message } = await req.json();

  if (!message || typeof message !== 'string') {
    return new Response('Invalid message', { status: 400 });
  }

  const interviewSession = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
  });

  if (!interviewSession || interviewSession.userId !== session.user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  // Save user message with role = 'user'
  await prisma.message.create({
    data: {
      content: message,
      role: 'user',
      sessionId: sessionId,
    },
  });

  // Fetch streaming response from Ollama
  const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama3',
      messages: [
        { role: 'system', content: 'You are a helpful behavioral interview coach.' },
        { role: 'user', content: message },
      ],
      stream: true,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let fullAIResponse = '';

  const stream = new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder();
      const reader = ollamaResponse.body!.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '').trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const token = parsed.message?.content || '';
              fullAIResponse += token;
              controller.enqueue(new TextEncoder().encode(token));
            } catch (err) {
              console.error('Invalid JSON in Ollama stream:', line);
            }
          }
        }
      }

      controller.close();

      // Save AI response to DB with role = 'ai'
      await prisma.message.create({
        data: {
          content: fullAIResponse,
          role: 'ai',
          sessionId: sessionId,
        },
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
