import { prisma } from "@/lib/db";
import { JobQueue } from "@/lib/queue";

/**
 * Campaign execution worker
 * Orchestrates the entire campaign workflow for all leads
 */
export async function executeCampaign(campaignId: string) {
    // Fetch campaign with leads
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { leadList: true },
    });

    if (!campaign) {
        throw new Error(`Campaign ${campaignId} not found`);
    }

    console.log(
        `🎯 Executing campaign: ${campaign.name} with ${campaign.leadList.length} leads`
    );

    // Enqueue enrichment jobs for each lead
    const enrichmentJobs = [];
    for (const lead of campaign.leadList) {
        const job = await JobQueue.enqueue(
            "lead_enrichment",
            {
                leadId: lead.id,
                campaignId: campaign.id,
            },
            { priority: 1 } // Higher priority for campaign leads
        );
        enrichmentJobs.push(job.id);
    }

    // Update campaign status to active
    await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: "active" },
    });

    return {
        campaignId,
        leadsProcessed: campaign.leadList.length,
        enrichmentJobsCreated: enrichmentJobs.length,
        jobIds: enrichmentJobs,
    };
}
