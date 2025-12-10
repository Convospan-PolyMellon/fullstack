import { prisma } from "@/lib/db";

export type JobType =
    | "campaign_execution"
    | "lead_enrichment"
    | "email_send"
    | "linkedin_scrape"
    | "csv_import"
    | "LINKEDIN_LIKE"
    | "LINKEDIN_COMMENT"
    | "LINKEDIN_SCRAPE"
    | "SMART_COMMENT"
    | "SMART_CONNECT"
    | "SEQUENCE_ACTION";

export type JobStatus = "pending" | "running" | "completed" | "failed";

export interface JobPayload {
    [key: string]: any;
}

/**
 * Enqueue a new job
 */
export async function enqueueJob(
    type: JobType,
    payload: JobPayload,
    priority: number = 0,
    delaySeconds: number = 0
) {
    const processAt = new Date();
    processAt.setSeconds(processAt.getSeconds() + delaySeconds);

    const job = await prisma.job.create({
        data: {
            type,
            payload,
            priority,
            processAt
        },
    });
    return job;
}

/**
 * Get next pending job (highest priority first, then oldest)
 */
export async function dequeueJob() {
    const job = await prisma.job.findFirst({
        where: {
            status: "pending",
            processAt: {
                lte: new Date()
            }
        },
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    });

    if (job) {
        // Mark as running
        await prisma.job.update({
            where: { id: job.id },
            data: {
                status: "running",
                startedAt: new Date(),
                attempts: { increment: 1 },
            },
        });
    }

    return job;
}

/**
 * Update job status
 */
export async function updateJobStatus(
    id: string,
    status: JobStatus,
    result?: any,
    error?: string
) {
    const updateData: any = {
        status,
    };

    if (result !== undefined) {
        updateData.result = result;
    }

    if (error !== undefined) {
        updateData.error = error;
    }

    if (status === "completed" || status === "failed") {
        updateData.completedAt = new Date();
    }

    return await prisma.job.update({
        where: { id },
        data: updateData,
    });
}

/**
 * Retry a failed job
 */
export async function retryJob(id: string) {
    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.attempts >= job.maxAttempts) {
        throw new Error("Job has exceeded max retry attempts");
    }

    return await prisma.job.update({
        where: { id },
        data: {
            status: "pending",
            error: null,
            startedAt: null,
            completedAt: null,
        },
    });
}

/**
 * Get job by ID
 */
export async function getJob(id: string) {
    return await prisma.job.findUnique({ where: { id } });
}

/**
 * Get jobs with filters
 */
export async function getJobs(filters?: {
    type?: JobType;
    status?: JobStatus;
    limit?: number;
    offset?: number;
}) {
    const where: any = {};

    if (filters?.type) {
        where.type = filters.type;
    }

    if (filters?.status) {
        where.status = filters.status;
    }

    const [jobs, total] = await Promise.all([
        prisma.job.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: filters?.limit || 50,
            skip: filters?.offset || 0,
        }),
        prisma.job.count({ where }),
    ]);

    return { jobs, total };
}

/**
 * Cancel a pending job
 */
export async function cancelJob(id: string) {
    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status !== "pending") {
        throw new Error("Can only cancel pending jobs");
    }

    return await prisma.job.update({
        where: { id },
        data: {
            status: "failed",
            error: "Cancelled by user",
            completedAt: new Date(),
        },
    });
}

/**
 * Get job queue status counts
 */
export async function getJobQueueStatus() {
    const [pending, running, completed, failed] = await Promise.all([
        prisma.job.count({ where: { status: "pending" } }),
        prisma.job.count({ where: { status: "running" } }),
        prisma.job.count({ where: { status: "completed" } }),
        prisma.job.count({ where: { status: "failed" } }),
    ]);

    return {
        pending,
        running,
        completed,
        failed,
        total: pending + running + completed + failed,
    };
}
