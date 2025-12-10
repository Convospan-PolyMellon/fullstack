import { NextRequest, NextResponse } from "next/server";
import { getJobs, enqueueJob, JobType } from "@/workers/job-queue";

// GET /api/jobs - List all jobs
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") as JobType | undefined;
        const status = searchParams.get("status") as any;
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        const result = await getJobs({ type, status, limit, offset });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json(
            { error: "Failed to fetch jobs" },
            { status: 500 }
        );
    }
}

// POST /api/jobs - Create new job
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, payload, priority } = body;

        if (!type || !payload) {
            return NextResponse.json(
                { error: "type and payload are required" },
                { status: 400 }
            );
        }

        const job = await enqueueJob(type, payload, priority);

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json(
            { error: "Failed to create job" },
            { status: 500 }
        );
    }
}
