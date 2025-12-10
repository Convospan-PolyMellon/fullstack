import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { teamId } = session.user as any;

    try {
        // Fetch leads that have messages or are in 'replied'/'contacted' status
        // and belong to the user's team's campaigns
        const leads = await prisma.lead.findMany({
            where: {
                campaign: {
                    teamId: teamId
                },
                OR: [
                    { status: "replied" },
                    { status: "contacted" },
                    { messages: { some: {} } }
                ]
            },
            include: {
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                },
                campaign: {
                    select: { name: true }
                }
            },
            orderBy: {
                updatedAt: "desc"
            },
            take: 50
        });

        // Format for UI
        const conversations = leads.map(lead => ({
            id: lead.id,
            name: lead.fullName || "Unknown Lead",
            entity: lead.company,
            platform: lead.linkedIn ? "LinkedIn" : "Email",
            lastMessage: lead.messages[0]?.content || "No messages yet",
            lastMessageDate: lead.messages[0]?.createdAt || lead.updatedAt,
            isRead: lead.messages[0]?.isRead ?? true,
            status: lead.status,
            campaignName: lead.campaign?.name
        }));

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("Inbox Fetch Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
