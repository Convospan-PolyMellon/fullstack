// Mock settings service for now
// In production, this would store settings in a User or Settings table

class SettingsService {
    private settings = {
        hunterApiKey: process.env.HUNTER_API_KEY || "",
        openaiApiKey: process.env.OPENAI_API_KEY || "",
        sendpulseId: process.env.SENDPULSE_ID || "",
        sendpulseSecret: process.env.SENDPULSE_SECRET || "",
        notifications: {
            email: true,
            slack: false,
        },
    };

    async getSettings() {
        return this.settings;
    }

    async updateSettings(newSettings: any) {
        this.settings = { ...this.settings, ...newSettings };
        // In a real app, you'd save this to DB
        return this.settings;
    }
}

export const settingsService = new SettingsService();
