import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_USER_ID = "user-1"; // Mock user ID

export async function GET() {
    try {
        let settings = await prisma.settings.findUnique({
            where: { userId: DEFAULT_USER_ID }
        });

        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    userId: DEFAULT_USER_ID,
                    name: "Demo User",
                    email: "demo@example.com",
                    theme: "dark"
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const settings = await prisma.settings.upsert({
            where: { userId: DEFAULT_USER_ID },
            update: body,
            create: {
                userId: DEFAULT_USER_ID,
                ...body
            }
        });
        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
