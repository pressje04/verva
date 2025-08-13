'use client';

import { useEffect, useRef, useState } from 'react';
import type { InterviewSettings } from '@/lib/types';

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

type Props = {
  sessionId: string;
  settings: InterviewSettings;
};

export default function InterviewChat({ sessionId, settings }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const hasInitiated = useRef(false);

  // Load existing messages once
  useEffect(() => {
    let cancelled = false;
    async function fetchMessages() {
      if (!sessionId) return;
      const res = await fetch(`/api/interviews/${sessionId}/message/messages`);
      const data: Message[] = await res.json();
      if (!cancelled) setMessages(data);
    }
    fetchMessages();
    return () => { cancelled = true; };
  }, [sessionId]);

  // Initiate interview (first question) exactly once per session
  useEffect(() => {
    if (!sessionId || hasInitiated.current) return;
    hasInitiated.current = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/interviews/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // userTurn: null signals "start interview"
          body: JSON.stringify({ sessionId, userTurn: null, settings }),
        });
        const data: { response: string; question?: string; brief_feedback?: string; error?: string } = await res.json();
        if (data?.error) throw new Error(data.error);

        const newAIMessage: Message = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: data.response, // server already formats brief_feedback + question
        };
        setMessages((prev) => [...prev, newAIMessage]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId, settings]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/interviews/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userTurn: userMsg.content }),
      });

      const data: { response: string; question?: string; brief_feedback?: string; error?: string } = await res.json();
      if (data?.error) throw new Error(data.error);

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: data.response, // brief_feedback (if any) + question
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error('ask error', e);
      // Optional: surface a toast
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-4">
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 max-h-[500px] overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl ${
              msg.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-800 text-white self-start'
            } w-fit max-w-[80%]`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-400">Thinking...</p>}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          placeholder="Type your answer…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
