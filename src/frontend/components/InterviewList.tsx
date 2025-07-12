'use client';
import { useFetchInterviews } from "@/frontend/hooks/useFetchInterviews"
import InterviewCard from "./InterviewCard";

export default function InterviewList() {
    const {interviews} = useFetchInterviews();

    console.log(interviews);

    return (
        <div className="flex flex-col mt-16">
        {interviews.map((interview: any) => (
            <InterviewCard key={interview.id} interview_id={interview.id}/>
        ))}
        </div>
    )
}