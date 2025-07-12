/*Hook that reuses the fetch interviews component logic

Can use this wherever we need to get a list of interviews that meet 
a specific filter*/
'use client';
import { useEffect, useState } from "react";

export function useFetchInterviews(filters={}) {
    const [interviews, setInterviews] = useState([]);
    //Arr instead of false bc we will have (prob.) more than 1 interview

    useEffect(() => {
        const fetchData = async () => {
            const query = new URLSearchParams(filters).toString();

            const res = await fetch(`/api/interviews/${query}`)
            const data = await res.json();
            setInterviews(data);
        };
        fetchData();
    }, [JSON.stringify(filters)]);

    return {interviews};
}