import {useEffect, useState} from 'react';

type Interview = {
    id: string;
    title: string;
    role: string;
    type: string;
    difficulty: string;
    timeEstimate: string;
    description: string;
    tags: string[];
  };

export function useFetchInterviewById(id: string) {
    const [interview, setInterview] = useState<Interview | null>(null);

    useEffect(() => {
        const fetchInterview = async () => {
            const res = await fetch(`/api/interviews/${id}`);
            const data = await res.json();
            setInterview(data);
        }
        fetchInterview();
    }, [id]);

    return {interview}
}