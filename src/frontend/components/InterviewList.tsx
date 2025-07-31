'use client';
import { useFetchInterviews } from "@/hooks/useFetchInterviews"
import InterviewCard from "./InterviewCard";

export default function InterviewList() {
    const {interviews} = useFetchInterviews();

    console.log(interviews?.length ?? 0);

    return (
        <div className="flex flex-col mt-16">
        <p className="text-black">{interviews?.length ?? 0}</p>
        {interviews.map((interview: any) => (
            <InterviewCard key={interview.id} interview_id={interview.id}/>
        ))}
        </div>
    )
}