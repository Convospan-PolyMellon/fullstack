import { CampaignService } from "@/lib/campaignService";
import { getCurrentContext } from "@/lib/auth";
import { handleAPIError, successResponse, APIError } from "@/lib/apiResponse";
import { CampaignSchema } from "@/lib/schemas";

export async function GET() {
    try {
        const { teamId } = await getCurrentContext();
        if (!teamId) {
            throw new APIError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const campaigns = await CampaignService.listCampaigns(teamId);
        return successResponse(campaigns);
    } catch (error: any) {
        return handleAPIError(error);
    }
}

export async function POST(req: Request) {
    try {
        const { teamId } = await getCurrentContext();
        if (!teamId) {
            throw new APIError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await req.json();

        // Validate input
        const validation = CampaignSchema.safeParse(body);
        if (!validation.success) {
            throw new APIError("Invalid input", 400, "VALIDATION_ERROR");
        }

        const campaign = await CampaignService.createCampaign({ ...validation.data, teamId });
        return successResponse(campaign);
    } catch (error: any) {
        return handleAPIError(error);
    }
}
