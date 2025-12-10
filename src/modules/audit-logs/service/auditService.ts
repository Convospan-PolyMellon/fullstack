import { prisma } from "@/lib/db";

export enum AuditAction {
    USER_LOGIN = "USER_LOGIN",
    CAMPAIGN_CREATED = "CAMPAIGN_CREATED",
    MEMBER_INVITED = "MEMBER_INVITED",
    LEAD_SYNCED = "LEAD_SYNCED",
    USER_CREATED = "USER_CREATED",
    PROFILE_UPDATED = "PROFILE_UPDATED"
}

class AuditService {
    async logAction(userId: string, action: string, resource: string, details?: any) {
        console.log(`[Audit] User ${userId} performed ${action} on ${resource}`, details);

        try {
            await prisma.activityLog.create({
                data: {
                    action: `AUDIT: ${action}`,
                    meta: {
                        userId,
                        resource,
                        details,
                        timestamp: new Date().toISOString()
                    }
                }
            });
        } catch (e) {
            console.error("Failed to persist audit log", e);
        }
    }

    async getLogs(limit = 100, offset = 0) {
        return await prisma.activityLog.findMany({
            where: {
                action: {
                    startsWith: "AUDIT:"
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: limit,
            skip: offset
        });
    }
}

export const auditService = new AuditService();
