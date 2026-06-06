import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await query(
      "SELECT id, name, slug, description, image_url FROM categories WHERE is_active = 1 ORDER BY sort_order ASC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("API /categories error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
