"use server";

import mysql from "mysql2/promise";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "dbuas",
  });
  return connection;
}

export async function createProduk(formData: FormData) {
  const connection = await getConnection();
  try {
    const category_id = Number(formData.get("category_id"));
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const description = formData.get("description") as string;
    const short_desc = formData.get("short_desc") as string;
    const price = Number(formData.get("price"));
    const discount_price = formData.get("discount_price") ? Number(formData.get("discount_price")) : null;
    const sku = formData.get("sku") as string || null;
    const stock = Number(formData.get("stock")) || 0;
    const weight_gram = Number(formData.get("weight_gram")) || null;
    const is_featured = formData.get("is_featured") === "on" ? 1 : 0;
    const is_active = formData.get("is_active") === "on" ? 1 : 0;
    const image_url = formData.get("image_url") as string;

    const [result] = await connection.execute(
      `INSERT INTO products (category_id, name, slug, description, short_desc, price, discount_price, sku, stock, weight_gram, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, slug, description, short_desc, price, discount_price, sku, stock, weight_gram, is_featured, is_active]
    );

    const insertId = (result as any).insertId;

    if (image_url) {
      await connection.execute(
        "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)",
        [insertId, image_url]
      );
    }

    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    redirect("/admin/produk");
  } finally {
    await connection.end();
  }
}

export async function updateProduk(id: number, formData: FormData) {
  const connection = await getConnection();
  try {
    const category_id = Number(formData.get("category_id"));
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const description = formData.get("description") as string;
    const short_desc = formData.get("short_desc") as string;
    const price = Number(formData.get("price"));
    const discount_price = formData.get("discount_price") ? Number(formData.get("discount_price")) : null;
    const sku = formData.get("sku") as string || null;
    const stock = Number(formData.get("stock")) || 0;
    const weight_gram = Number(formData.get("weight_gram")) || null;
    const is_featured = formData.get("is_featured") === "on" ? 1 : 0;
    const is_active = formData.get("is_active") === "on" ? 1 : 0;

    await connection.execute(
      `UPDATE products SET category_id = ?, name = ?, slug = ?, description = ?, short_desc = ?, price = ?, discount_price = ?, sku = ?, stock = ?, weight_gram = ?, is_featured = ?, is_active = ? WHERE id = ?`,
      [category_id, name, slug, description, short_desc, price, discount_price, sku, stock, weight_gram, is_featured, is_active, id]
    );

    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath(`/produk/${slug}`);
    redirect("/admin/produk");
  } finally {
    await connection.end();
  }
}

export async function deleteProduk(id: number) {
  const connection = await getConnection();
  try {
    await connection.execute("DELETE FROM products WHERE id = ?", [id]);
    revalidatePath("/admin/produk");
    revalidatePath("/produk");
  } finally {
    await connection.end();
  }
}

export async function toggleActiveProduk(id: number, currentStatus: number) {
  const connection = await getConnection();
  try {
    await connection.execute("UPDATE products SET is_active = ? WHERE id = ?", [currentStatus === 1 ? 0 : 1, id]);
    revalidatePath("/admin/produk");
    revalidatePath("/produk");
  } finally {
    await connection.end();
  }
}
