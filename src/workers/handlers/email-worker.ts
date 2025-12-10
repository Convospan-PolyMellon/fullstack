import { prisma } from "@/lib/db";
import { emailService } from "@/modules/email-campaigner";

/**
 * Email sending worker
 * Sends personalized email to a lead
 */
export async function handleEmailSend(payload: {
    leadId: string;
    campaignId: string;
    enrichmentData?: any;
}) {
    const { leadId, campaignId, enrichmentData } = payload;

    // Fetch lead and campaign
    const [lead, campaign] = await Promise.all([
        prisma.lead.findUnique({ where: { id: leadId } }),
        prisma.campaign.findUnique({ where: { id: campaignId } }),
    ]);

    if (!lead) {
        throw new Error(`Lead ${leadId} not found`);
    }

    if (!campaign) {
        throw new Error(`Campaign ${campaignId} not found`);
    }

    if (!lead.email) {
        throw new Error(`Lead ${leadId} has no email address`);
    }

    console.log(`📧 Sending email to: ${lead.email}`);

    // Generate personalized email content
    const emailContent = generateEmailContent(lead, campaign, enrichmentData);

    // Send email via Email Service
    try {
        const result = await emailService.sendEmail(
            lead.email,
            emailContent.subject,
            emailContent.body,
            { leadId, campaignId }
        );

        // Update lead status
        await prisma.lead.update({
            where: { id: leadId },
            data: { status: "contacted" },
        });

        // Update campaign completed count
        await prisma.campaign.update({
            where: { id: campaignId },
            data: { completedCount: { increment: 1 } },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: "email_sent",
                meta: {
                    leadId,
                    campaignId,
                    email: lead.email,
                    subject: emailContent.subject,
                    providerId: result.providerId,
                },
            },
        });

        return {
            leadId,
            email: lead.email,
            sent: true,
            result,
        };
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
}

/**
 * Generate personalized email content
 */
function generateEmailContent(
    lead: any,
    campaign: any,
    enrichmentData?: any
) {
    const name = lead.fullName || "there";
    const companyName =
        enrichmentData?.companyInsights?.name || "your company";

    return {
        subject: `${campaign.name} - Opportunity for ${companyName}`,
        body: `
Hi ${name},

I hope this email finds you well. I'm reaching out regarding ${campaign.name}.

${campaign.description || "We have an exciting opportunity to discuss."}

Based on my research about ${companyName}, I believe there's a strong alignment with what we offer.

Would you be open to a brief conversation to explore this further?

Best regards,
ConvoSpan Team

---
This email was sent as part of the "${campaign.name}" campaign.
    `.trim(),
    };
}
