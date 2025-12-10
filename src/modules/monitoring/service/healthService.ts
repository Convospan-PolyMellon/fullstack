import { prisma } from "@/lib/db";

class HealthService {
    async getHealth() {
        const checks = {
            database: { status: "unknown", latency: 0 },
            system: { status: "ok", uptime: process.uptime() },
            timestamp: new Date().toISOString()
        };

        // Check Database
        const start = Date.now();
        try {
            await prisma.$queryRaw`SELECT 1`;
            checks.database.status = "healthy";
            checks.database.latency = Date.now() - start;
        } catch (e) {
            console.error("Health Check DB Error:", e);
            checks.database.status = "unhealthy";
        }

        return checks;
    }
}

export const healthService = new HealthService();
