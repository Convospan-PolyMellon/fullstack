import { NextResponse } from "next/server";
import { CampaignService } from "@/lib/campaignService";
import { prisma } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const stats = await CampaignService.getCampaignStats(params.id);
        const campaign = await prisma.campaign.findUnique({ where: { id: params.id } });
        return NextResponse.json({ ...campaign, stats });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        if (body.action === "start") {
            await CampaignService.startCampaign(params.id);
        } else if (body.action === "pause") {
            await CampaignService.pauseCampaign(params.id);
        } else if (body.leadIds) {
            await CampaignService.addLeadsToCampaign(params.id, body.leadIds);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.campaign.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
