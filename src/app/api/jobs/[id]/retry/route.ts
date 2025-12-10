import { NextRequest, NextResponse } from "next/server";
import { retryJob } from "@/workers/job-queue";

// POST /api/jobs/[id]/retry - Retry failed job
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const job = await retryJob(params.id);
        return NextResponse.json(job);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to retry job";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
