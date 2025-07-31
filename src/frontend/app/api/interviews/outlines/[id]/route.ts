import {prisma} from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: {id: string}}
) {
    try {
        const {id} = params;

        const interview = await prisma.interview.findUnique({
            where: {id}
        })

        if (!interview) {
            return NextResponse.json({error: "Interview not found"}, {status: 404});
        }

        return NextResponse.json(interview);
    } catch (err) {
        console.error("Failed to load interview by Id: ", err);
        return NextResponse.json(
            {error: "Internal server error: find interview by Id"},
            {status: 500}
        )
    }
}