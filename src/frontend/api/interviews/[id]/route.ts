import {NextResponse, NextRequest} from 'next/server';
import {prisma} from '@/frontend/lib/prisma';

export async function GET(
    req: NextRequest,
    {params}: {params: {id: string}} ) 
    {
        try {
            const {id} = params;

            const interview = await prisma.interview.findUnique({
                where: {
                    id
                }
            })

            if (!interview) {
                return NextResponse.json({message: "Interview not found"}, {status: 404});
            }

            return NextResponse.json(interview);
        } catch {
            return NextResponse.json({error: "Something went wrong while finding interview by ID on the server side"}, {status: 500});
        }



}