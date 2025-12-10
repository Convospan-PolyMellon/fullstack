import { prisma } from "@/lib/db";

export class WebhookService {
    static async dispatch(teamId: string, event: string, payload: any) {
        try {
            // Find active webhooks for this team that subscribe to this event
            const webhooks = await prisma.webhook.findMany({
                where: {
                    teamId,
                    isActive: true,
                    events: { has: event }
                }
            });

            if (webhooks.length === 0) return;

            // Prepare payload
            const body = JSON.stringify({
                event,
                timestamp: new Date().toISOString(),
                data: payload
            });

            // Send requests in parallel (fire and forget)
            webhooks.forEach(webhook => {
                fetch(webhook.url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-ConvoSpan-Event": event,
                        // In a real app, we'd add a signature header here using webhook.secret
                    },
                    body
                }).catch(err => {
                    console.error(`Failed to send webhook to ${webhook.url}`, err);
                    // In a real app, we'd log this failure and maybe retry
                });
            });

        } catch (error) {
            console.error("Error dispatching webhooks", error);
        }
    }
}
