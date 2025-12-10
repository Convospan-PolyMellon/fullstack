import { prisma } from "@/lib/db";

export type EmailSendResult = {
    success: boolean;
    providerId?: string;
    error?: string;
};

class EmailService {
    /**
     * Send an email using the configured provider
     * Currently mocks the sending process
     */
    async sendEmail(
        to: string,
        subject: string,
        body: string,
        metadata?: any
    ): Promise<EmailSendResult> {
        console.log(`📧 Sending email to ${to}`);
        console.log(`Subject: ${subject}`);

        // Simulate provider delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock success
        // In a real implementation, this would call SendPulse, SendGrid, etc.
        const mockProviderId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Log the email record
        await prisma.email.create({
            data: {
                leadId: metadata?.leadId,
                campaignId: metadata?.campaignId,
                subject,
                body,
                status: "sent",
                providerId: mockProviderId,
            }
        });

        return {
            success: true,
            providerId: mockProviderId,
        };
    }
}

export const emailService = new EmailService();
