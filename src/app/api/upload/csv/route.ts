import { NextRequest, NextResponse } from "next/server";
import { processCSVImport, FieldMapping } from "@/lib/csv-processor";

// POST /api/upload/csv - Upload and process CSV file
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");

    let csvText: string;
    let fieldMapping: FieldMapping | undefined;
    let campaignId: string | undefined;

    if (contentType?.includes("application/json")) {
      // JSON payload with CSV text and mapping
      const body = await req.json();
      csvText = body.csv || body.csvText;
      fieldMapping = body.fieldMapping;
      campaignId = body.campaignId;
    } else {
      // Plain text CSV
      csvText = await req.text();
    }

    if (!csvText || csvText.trim() === "") {
      return NextResponse.json(
        { error: "CSV content is required" },
        { status: 400 }
      );
    }

    // Process CSV import
    const result = await processCSVImport(csvText, fieldMapping, campaignId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to import CSV",
      },
      { status: 500 }
    );
  }
}
