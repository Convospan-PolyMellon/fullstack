import Papa from "papaparse";
import { prisma } from "@/lib/db";

export interface CSVRow {
    email: string;
    fullName?: string;
    company?: string;
    jobTitle?: string;
    linkedIn?: string;
    location?: string;
}

class CSVIngestionService {
    async processCSV(csvContent: string, teamId: string | null) {
        if (!csvContent) throw new Error("No CSV content received");

        const parsed = Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim().toLowerCase().replace(/[\s_]+/g, '') // Normalize headers
        });

        if (parsed.errors.length) {
            throw new Error(`CSV Parsing Error: ${parsed.errors[0].message}`);
        }

        const rows = parsed.data as any[];
        const validLeads: any[] = [];
        const errors: string[] = [];

        // Normalize and Validate
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            // Map common column names
            const email = row.email || row.contactemail || row.mail;
            const fullName = row.fullname || row.name || row.contactname || `${row.firstname || ''} ${row.lastname || ''}`.trim();
            const company = row.company || row.companyname || row.organization;
            const jobTitle = row.jobtitle || row.title || row.position;
            const linkedIn = row.linkedin || row.linkedinurl || row.profile;
            const location = row.location || row.city || row.country;

            if (!email || !email.includes('@')) {
                errors.push(`Row ${i + 1}: Invalid or missing email`);
                continue;
            }

            validLeads.push({
                email: email.toLowerCase(),
                fullName: fullName || null,
                company: company || null,
                jobTitle: jobTitle || null,
                linkedIn: linkedIn || null,
                location: location || null,
                teamId: teamId, // Associate with team if provided
                status: "NEW",
                createdAt: new Date(),
                updatedAt: new Date() // Required for createMany if not default? (Prisma handles default usually)
            });
        }

        if (validLeads.length === 0) {
            return { success: false, message: "No valid leads found", errors };
        }

        // Batch Insert (skipDuplicates is supported in createMany)
        const result = await prisma.lead.createMany({
            data: validLeads,
            skipDuplicates: true
        });

        return {
            success: true,
            totalParsed: rows.length,
            inserted: result.count,
            skipped: validLeads.length - result.count,
            errors
        };
    }
}

export const csvIngestionService = new CSVIngestionService();
