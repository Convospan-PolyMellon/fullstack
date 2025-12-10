import { z } from "zod";

export const LeadSchema = z.object({
    fullName: z.string().optional().nullable(),
    email: z.string().email("Invalid email address"),
    linkedIn: z.string().url("Invalid LinkedIn URL").optional().nullable().or(z.literal("")),
    status: z.enum(["NEW", "CONTACTED", "REPLIED", "CONVERTED", "LOST"]).optional().default("NEW"),
    campaignId: z.string().uuid().optional().nullable(),
    company: z.string().optional().nullable(),
    jobTitle: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    embedding: z.array(z.number()).optional(), // Vector embedding
    teamId: z.string().optional()
});

export const CampaignSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    targetCount: z.number().int().nonnegative().optional().default(0),
    teamId: z.string().optional()
});

export const TeamMemberInviteSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["owner", "admin", "member"]).default("member"),
});
