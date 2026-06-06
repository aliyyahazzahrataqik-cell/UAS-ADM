import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const rows = await query<any>(
      `SELECT p.*, c.name as category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.is_active = 1 LIMIT 1`,
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { status: "error", message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const product = rows[0];

    // Fetch images
    const images = await query<any>(
      "SELECT id, image_url, alt_text FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC",
      [product.id]
    );

    return NextResponse.json({
      status: "ok",
      data: {
        ...product,
        images
      }
    });
  } catch (error) {
    console.error("API /products/[slug] error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
