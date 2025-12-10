import Papa from "papaparse";
import { prisma } from "./db";

export interface FieldMapping {
    [csvColumn: string]: string; // Maps CSV column to Lead field
}

export interface LeadData {
    fullName?: string;
    email?: string;
    linkedIn?: string;
    status?: string;
    campaignId?: string;
}

export interface ImportResult {
    created: number;
    skipped: number;
    errors: Array<{ row: number; message: string }>;
    leads: any[];
}

/**
 * Parse CSV text to array of objects
 */
export function parseCSV(csvText: string): Papa.ParseResult<any> {
    return Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
    });
}

/**
 * Auto-detect field mapping based on common column names
 */
export function autoDetectFieldMapping(headers: string[]): FieldMapping {
    const mapping: FieldMapping = {};

    headers.forEach((header) => {
        const lower = header.toLowerCase();

        // Email detection
        if (lower.includes("email") || lower === "e-mail") {
            mapping[header] = "email";
        }
        // Name detection
        else if (
            lower.includes("name") ||
            lower === "full name" ||
            lower === "fullname"
        ) {
            mapping[header] = "fullName";
        }
        // LinkedIn detection
        else if (lower.includes("linkedin") || lower.includes("linked in")) {
            mapping[header] = "linkedIn";
        }
    });

    return mapping;
}

/**
 * Map CSV row to Lead data using field mapping
 */
export function mapFields(row: any, fieldMapping: FieldMapping): LeadData {
    const leadData: LeadData = {};

    Object.entries(fieldMapping).forEach(([csvColumn, leadField]) => {
        const value = row[csvColumn];
        if (value && typeof value === "string") {
            (leadData as any)[leadField] = value.trim();
        }
    });

    return leadData;
}

/**
 * Validate lead data
 */
export function validateLeadRow(
    leadData: LeadData,
    rowIndex: number
): string | null {
    // Email is required
    if (!leadData.email || leadData.email.trim() === "") {
        return `Row ${rowIndex + 1}: Email is required`;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
        return `Row ${rowIndex + 1}: Invalid email format`;
    }

    return null;
}

/**
 * Remove duplicate leads from import batch (by email)
 */
export function deduplicateLeads(leads: LeadData[]): LeadData[] {
    const seen = new Set<string>();
    const unique: LeadData[] = [];

    leads.forEach((lead) => {
        if (lead.email && !seen.has(lead.email.toLowerCase())) {
            seen.add(lead.email.toLowerCase());
            unique.push(lead);
        }
    });

    return unique;
}

/**
 * Bulk create leads in database with deduplication
 */
export async function bulkCreateLeads(
    leads: LeadData[],
    campaignId?: string
): Promise<ImportResult> {
    const result: ImportResult = {
        created: 0,
        skipped: 0,
        errors: [],
        leads: [],
    };

    // Check for existing leads by email
    const emails = leads.map((l) => l.email!).filter(Boolean);
    const existingLeads = await prisma.lead.findMany({
        where: {
            email: {
                in: emails,
            },
        },
        select: {
            email: true,
        },
    });

    const existingEmails = new Set(
        existingLeads.map((l) => l.email?.toLowerCase())
    );

    // Filter out duplicates
    const newLeads = leads.filter((lead) => {
        if (lead.email && existingEmails.has(lead.email.toLowerCase())) {
            result.skipped++;
            return false;
        }
        return true;
    });

    // Create new leads
    if (newLeads.length > 0) {
        const createData = newLeads.map((lead) => ({
            fullName: lead.fullName || null,
            email: lead.email!,
            linkedIn: lead.linkedIn || null,
            status: lead.status || "new",
            campaignId: campaignId || null,
        }));

        try {
            const created = await prisma.lead.createMany({
                data: createData,
                skipDuplicates: true,
            });

            result.created = created.count;

            // Fetch created leads to return
            const createdLeads = await prisma.lead.findMany({
                where: {
                    email: {
                        in: newLeads.map((l) => l.email!),
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: created.count,
            });

            result.leads = createdLeads;
        } catch (error) {
            result.errors.push({
                row: 0,
                message: error instanceof Error ? error.message : "Database error",
            });
        }
    }

    return result;
}

/**
 * Process CSV import end-to-end
 */
export async function processCSVImport(
    csvText: string,
    fieldMapping?: FieldMapping,
    campaignId?: string
): Promise<ImportResult> {
    const result: ImportResult = {
        created: 0,
        skipped: 0,
        errors: [],
        leads: [],
    };

    // Parse CSV
    const parsed = parseCSV(csvText);

    if (parsed.errors.length > 0) {
        result.errors = parsed.errors.map((err, idx) => ({
            row: err.row || idx,
            message: err.message,
        }));
        return result;
    }

    // Auto-detect field mapping if not provided
    const headers = parsed.meta.fields || [];
    const mapping = fieldMapping || autoDetectFieldMapping(headers);

    // Map and validate rows
    const validLeads: LeadData[] = [];

    parsed.data.forEach((row: any, index: number) => {
        const leadData = mapFields(row, mapping);

        // Validate
        const error = validateLeadRow(leadData, index);
        if (error) {
            result.errors.push({ row: index + 1, message: error });
            return;
        }

        validLeads.push(leadData);
    });

    // Deduplicate within batch
    const uniqueLeads = deduplicateLeads(validLeads);
    const batchDuplicates = validLeads.length - uniqueLeads.length;
    result.skipped += batchDuplicates;

    // Bulk create
    if (uniqueLeads.length > 0) {
        const importResult = await bulkCreateLeads(uniqueLeads, campaignId);
        result.created = importResult.created;
        result.skipped += importResult.skipped;
        result.errors.push(...importResult.errors);
        result.leads = importResult.leads;
    }

    return result;
}
