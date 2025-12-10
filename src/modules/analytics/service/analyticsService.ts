import { prisma } from "@/lib/db";

class AnalyticsService {
    async getStats() {
        const [
            totalLeads,
            totalCampaigns,
            totalEmails,
            emailsSent,
            emailsOpened,
            emailsClicked,
        ] = await Promise.all([
            prisma.lead.count(),
            prisma.campaign.count(),
            prisma.email.count(),
            prisma.email.count({ where: { status: "sent" } }),
            prisma.email.count({ where: { status: "opened" } }),
            prisma.email.count({ where: { status: "clicked" } }),
        ]);

        const campaignPerformance = await prisma.campaign.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                targetCount: true,
                completedCount: true,
                status: true,
            },
        });

        return {
            overview: {
                totalLeads,
                totalCampaigns,
                emailStats: {
                    total: totalEmails,
                    sent: emailsSent,
                    opened: emailsOpened,
                    clicked: emailsClicked,
                    openRate: totalEmails > 0 ? (emailsOpened / totalEmails) * 100 : 0,
                    clickRate: totalEmails > 0 ? (emailsClicked / totalEmails) * 100 : 0,
                },
            },
            campaignPerformance,
        };
    }
}

export const analyticsService = new AnalyticsService();
