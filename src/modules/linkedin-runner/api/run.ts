import { NextResponse } from "next/server";
import { enqueueJob } from "@/workers/job-queue";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { profileUrl, action, leadId } = body;

        if (!profileUrl || !action) {
            return NextResponse.json(
                { ok: false, error: "profileUrl and action are required" },
                { status: 400 }
            );
        }

        const job = await enqueueJob("linkedin_scrape", {
            profileUrl,
            action,
            leadId,
        });

        return NextResponse.json({
            ok: true,
            message: "LinkedIn action queued",
            jobId: job.id
        });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err.message },
            { status: 500 }
        );
    }
}
