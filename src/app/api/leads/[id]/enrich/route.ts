import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentContext } from "@/lib/auth";
import { handleAPIError, successResponse, APIError } from "@/lib/apiResponse";
import { EnrichmentService } from "@/lib/enrichmentService";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { teamId } = await getCurrentContext();
        if (!teamId) {
            throw new APIError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const { id } = params;

        const lead = await prisma.lead.findUnique({
            where: { id, teamId }
        });

        if (!lead) {
            throw new APIError("Lead not found", 404, "NOT_FOUND");
        }

        const enrichedData = await EnrichmentService.enrichLead(id);

        return successResponse({ success: true, data: enrichedData });
    } catch (error) {
        return handleAPIError(error);
    }
}
