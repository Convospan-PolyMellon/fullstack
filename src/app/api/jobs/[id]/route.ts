import { NextRequest, NextResponse } from "next/server";
import { getJob, cancelJob } from "@/workers/job-queue";

// GET /api/jobs/[id] - Get job status
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const job = await getJob(params.id);

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json(
            { error: "Failed to fetch job" },
            { status: 500 }
        );
    }
}

// DELETE /api/jobs/[id] - Cancel job
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const job = await cancelJob(params.id);
        return NextResponse.json(job);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to cancel job";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
