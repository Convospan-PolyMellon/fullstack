import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [
            newLeadsCount,
            qualifiedCount,
            meetingsCount,
            campaigns,
            activities
        ] = await Promise.all([
            prisma.lead.count({ where: { status: "NEW" } }),
            prisma.lead.count({ where: { status: { in: ["QUALIFIED", "INTERESTED"] } } }),
            prisma.meeting.count(),
            prisma.campaign.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    _count: {
                        select: { leadList: true }
                    }
                }
            }),
            prisma.activityLog.findMany({
                take: 10,
                orderBy: { createdAt: "desc" }
            })
        ]);

        const stats = [
            { id: "s1", title: "New Leads", value: newLeadsCount.toString(), change: 0, icon: "🔍" },
            { id: "s2", title: "Qualified", value: qualifiedCount.toString(), change: 0, icon: "✅" },
            { id: "s3", title: "Meetings", value: meetingsCount.toString(), change: 0, icon: "📅" },
        ];

        // Mock revenue for now as it's not in schema
        const revenueSeries = Array.from({ length: 30 }).map((_, i) => ({
            day: `D${i + 1}`,
            value: Math.round(200 + Math.sin(i / 3) * 80 + Math.random() * 50),
        }));

        const mappedCampaigns = campaigns.map((c) => ({
            id: c.id,
            name: c.name,
            audience: "Target Audience", // Placeholder as schema doesn't have audience field directly
            leads: c._count.leadList,
            status: c.status,
        }));

        const mappedActivities = activities.map((a) => ({
            agent: "System", // Schema ActivityLog doesn't link to agent/user directly? `userId` isn't in ActivityLog in schema provided.
            action: a.action,
            time: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

        return NextResponse.json({
            stats,
            revenueSeries,
            campaigns: mappedCampaigns,
            activities: mappedActivities,
            profile: {
                name: session.user.name || "User",
                email: session.user.email || ""
            }
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
