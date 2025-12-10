class AIService {
    async generateEmailDraft(lead: any, icp: any) {
        // Mock AI generation
        // In production, this would call OpenAI API

        const templates = [
            `Hi ${lead.firstName},\n\nI noticed you're working at ${lead.company}. I think our solution would be a great fit for your team.\n\nBest,\n[Your Name]`,
            `Hello ${lead.firstName},\n\nSaw your profile on LinkedIn. Are you facing challenges with [Industry Pain Point]?\n\nCheers,\n[Your Name]`,
            `Dear ${lead.firstName},\n\nReaching out regarding opportunities at ${lead.company}.\n\nRegards,\n[Your Name]`
        ];

        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            subject: `Question for ${lead.firstName} @ ${lead.company}`,
            body: templates[Math.floor(Math.random() * templates.length)],
        };
    }
}

export const aiService = new AIService();
