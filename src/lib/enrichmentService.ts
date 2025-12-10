import { prisma } from "@/lib/db";

export class EnrichmentService {
    static async enrichLead(leadId: string) {
        // In a real app, this would call Clearbit, Apollo, or Proxycurl
        // For MVP, we simulate enrichment with mock data

        const mockData = {
            twitter: "@mock_handle",
            linkedin_followers: Math.floor(Math.random() * 5000) + 500,
            company_size: "50-200",
            industry: "Technology",
            revenue: "$5M - $10M",
            last_funding: "Series A",
            technologies: ["Next.js", "React", "Node.js", "AWS"]
        };

        await prisma.lead.update({
            where: { id: leadId },
            data: {
                isEnriched: true,
                enrichedData: mockData
            }
        });

        return mockData;
    }
}
