import InterviewChat from '@/components/InterviewChat';
import { getInterviewSession } from '@/lib/data'; // however you're fetching
import { InterviewSettings } from '@/lib/types';

export default async function InterviewSessionPage({ params }: { params: { sessionId: string } }) {
  const session = await getInterviewSession(params.sessionId);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Interview Session</h1>
      <InterviewChat sessionId={params.sessionId} settings={session.settings as InterviewSettings} />
    </div>
  );
}
