import { prisma } from "@/lib/db";
import Papa from "papaparse";

class ExportService {
    async generateCsv(entityType: "leads" | "campaigns", teamId: string) {
        const data = await this.fetchData(entityType, teamId);
        if (data.length === 0) return "";
        return Papa.unparse(data as any);
    }

    async generateJson(entityType: "leads" | "campaigns", teamId: string) {
        const data = await this.fetchData(entityType, teamId);
        return JSON.stringify(data, null, 2);
    }

    private async fetchData(entityType: "leads" | "campaigns", teamId: string) {
        if (entityType === "leads") {
            return await prisma.lead.findMany({
                where: { teamId },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    company: true,
                    jobTitle: true,
                    status: true,
                    createdAt: true,
                },
            });
        } else {
            return await prisma.campaign.findMany({
                where: { teamId },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    status: true,
                    targetCount: true,
                    completedCount: true,
                    createdAt: true,
                },
            });
        }
    }
}

export const exportService = new ExportService();
