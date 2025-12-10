import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const { id: userId } = session.user as any;

    try {
        let prefs = await prisma.notificationSettings.findUnique({
            where: { userId }
        });

        if (!prefs) {
            // Create default
            // We need a settingsId. First find User's settings
            const userSettings = await prisma.settings.findUnique({ where: { userId } });
            if (!userSettings) return new NextResponse("User settings not found", { status: 404 });

            prefs = await prisma.notificationSettings.create({
                data: {
                    userId,
                    settingsId: userSettings.id
                }
            });
        }

        return NextResponse.json(prefs);
    } catch (error) {
        console.error("Get Notification Settings Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });
    const { id: userId } = session.user as any;

    try {
        const body = await req.json();
        const { emailGlobal, emailCampaign, emailLeads, inAppGlobal } = body;

        const updated = await prisma.notificationSettings.upsert({
            where: { userId },
            update: {
                emailGlobal, emailCampaign, emailLeads, inAppGlobal
            },
            create: {
                userId,
                settingsId: (await prisma.settings.findUnique({ where: { userId } }))!.id,
                emailGlobal, emailCampaign, emailLeads, inAppGlobal
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Update Notification Settings Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
