class WebhookService {
    private webhooks: { id: string; url: string; events: string[] }[] = [];

    async triggerWebhook(event: string, payload: any) {
        // Find webhooks subscribed to this event
        const targets = this.webhooks.filter(w => w.events.includes(event));

        if (targets.length === 0) return;

        console.log(`[Webhooks] Triggering ${event} for ${targets.length} targets`);

        // Fire and forget requests
        targets.forEach(async (webhook) => {
            try {
                await fetch(webhook.url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ event, payload, timestamp: new Date().toISOString() }),
                });
            } catch (e) {
                console.error(`[Webhooks] Failed to send to ${webhook.url}`, e);
            }
        });
    }

    addWebhook(url: string, events: string[]) {
        const webhook = { id: Math.random().toString(36).substr(2, 9), url, events };
        this.webhooks.push(webhook);
        return webhook;
    }

    getWebhooks() {
        return this.webhooks;
    }

    removeWebhook(id: string) {
        this.webhooks = this.webhooks.filter(w => w.id !== id);
    }
}

export const webhookService = new WebhookService();
