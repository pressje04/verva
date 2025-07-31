'use client';

import { useRouter } from "next/navigation";
import { useFetchInterviewById } from "@/hooks/useFetchInterviewById";
import { ArrowRight } from "lucide-react";

export default function InterviewCard({ interview_id }: { interview_id: string }) {
  const router = useRouter()
  const { interview } = useFetchInterviewById(interview_id);

  if (!interview) return <div className="text-center text-white/70">Not found</div>;

  const handleStartClick = () => {
    router.push(`/interviews/config/${interview_id}`)
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full mx-auto mt-6 px-6 py-4 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/30 border border-white/10 backdrop-blur-md shadow-lg hover:shadow-2xl hover:ring-1 hover:ring-blue-400/50 hover:scale-[1.02] transition-all duration-300">
      
      {/* Left Section: Grid layout for even spacing */}
      <div className="grid grid-cols-3 gap-4 w-full md:w-auto text-left items-center">
        <div className="text-xl font-bold text-white truncate">{interview.title}</div>
        <div className="text-sm text-gray-300">{interview.type}</div>
        <div className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-300 capitalize">
          {interview.difficulty}
        </div>
      </div>

      {/* Start Button */}
      <button 
        className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
        onClick={handleStartClick}>
        Start
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
