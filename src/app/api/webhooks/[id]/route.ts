import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentContext } from "@/lib/auth";
import { handleAPIError, successResponse, APIError } from "@/lib/apiResponse";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { teamId } = await getCurrentContext();
        if (!teamId) {
            throw new APIError("Unauthorized", 401, "UNAUTHORIZED");
        }

        // Verify ownership
        const existing = await prisma.webhook.findUnique({
            where: { id: params.id, teamId }
        });

        if (!existing) {
            throw new APIError("Webhook not found", 404, "NOT_FOUND");
        }

        await prisma.webhook.delete({
            where: { id: params.id }
        });

        return successResponse({ success: true });
    } catch (error) {
        return handleAPIError(error);
    }
}
