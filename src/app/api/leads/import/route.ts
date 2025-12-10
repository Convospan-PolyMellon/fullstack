import { NextResponse } from "next/server";
import { csvIngestionService } from "@/modules/csv-ingestion/service/csvIngestionService";
import { getCurrentContext } from "@/lib/auth";
import { APIError, handleAPIError } from "@/lib/apiResponse";

export async function POST(req: Request) {
    try {
        const { userId, teamId } = await getCurrentContext();
        if (!userId) throw new APIError("Unauthorized", 401, "UNAUTHORIZED");

        // We expect raw text body for simplicity, or FormData
        // Let's support raw text for now as it's easier with fetch(body: file.text())
        const csvContent = await req.text();

        if (!csvContent) throw new APIError("Empty file content", 400, "BAD_REQUEST");

        const result = await csvIngestionService.processCSV(csvContent, teamId);

        return NextResponse.json(result);
    } catch (error: any) {
        return handleAPIError(error);
    }
}
