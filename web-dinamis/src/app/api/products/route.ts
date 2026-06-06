import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const category_id = searchParams.get("category_id");
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
    
    let sql = `
      SELECT p.*, c.name as category_name, 
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params: any[] = [];

    if (featured === "1") {
      sql += " AND p.is_featured = 1";
    }
    
    if (category_id) {
      sql += " AND p.category_id = ?";
      params.push(category_id);
    }

    sql += " ORDER BY p.created_at DESC LIMIT ?";
    params.push(limit);

    const rows = await query(sql, params);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("API /products error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
