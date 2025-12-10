import { prisma as db } from "@/lib/db";

class OnboardingService {
    async getProgress(userId: string) {
        // 1. Check if user has a team (or is part of one)
        // Note: In this simple version, we check if they are a member of any team.
        // If userId is "user_123" (mock), we might need to handle it gracefully or assume it's a real ID in production.

        let hasTeam = false;
        let teamId: string | null = null;

        if (userId) {
            const teamMember = await db.teamMember.findFirst({
                where: { userId: userId },
                select: { teamId: true }
            });
            if (teamMember) {
                hasTeam = true;
                teamId = teamMember.teamId;
            }
        }

        // 2. Check for leads
        const leadsCount = teamId ? await db.lead.count({ where: { teamId } }) : 0;
        const hasLeads = leadsCount > 0;

        // 3. Check for campaigns
        const campaignsCount = teamId ? await db.campaign.count({ where: { teamId } }) : 0;
        const hasCampaign = campaignsCount > 0;

        const steps = [
            { id: "create_account", label: "Create Account", completed: true }, // Always true if logged in
            { id: "create_team", label: "Create Workspace", completed: hasTeam },
            { id: "add_leads", label: "Add Leads", completed: hasLeads },
            { id: "create_campaign", label: "Launch Campaign", completed: hasCampaign },
        ];

        const completedSteps = steps.filter(s => s.completed).length;
        const percentComplete = Math.round((completedSteps / steps.length) * 100);

        return {
            steps,
            percentComplete
        };
    }
}

export const onboardingService = new OnboardingService();
