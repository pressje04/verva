import {NextRequest, NextResponse} from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {username, fullName, email, password, resumeUrl, skills} = body;

        //Field validation
        if (!username || !fullName || !email || !password) {
            return NextResponse.json({error: "Missing required input field"});
        }

        // Check for existing user
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });

        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await prisma.user.create({
            data: {
            username,
            fullName,
            email,
            password: hashedPassword,
            resumeUrl,
            skills: {
                create: skills?.map((skill: any) => ({
                name: skill.name,
                level: skill.level,
                })) || [],
            },
            },
        });
    
        return NextResponse.json({ userId: newUser.id }, { status: 201 });
    } catch (err) {
      console.error("Signup error:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}   
