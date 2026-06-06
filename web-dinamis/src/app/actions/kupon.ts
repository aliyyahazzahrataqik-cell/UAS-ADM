"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createKupon(formData: FormData) {
  const code = formData.get("code") as string;
  const type = formData.get("type") as string;
  const value = Number(formData.get("value"));
  const min_purchase = Number(formData.get("min_purchase")) || 0;
  const usage_limit = Number(formData.get("usage_limit")) || 1;
  const expired_at = formData.get("expired_at") as string;
  const is_active = formData.get("is_active") === "on" ? 1 : 0;

  await query(
    "INSERT INTO coupons (code, type, value, min_purchase, usage_limit, expired_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [code, type, value, min_purchase, usage_limit, expired_at || null, is_active]
  );

  revalidatePath("/admin/kupon");
  redirect("/admin/kupon");
}

export async function updateKupon(id: number, formData: FormData) {
  const code = formData.get("code") as string;
  const type = formData.get("type") as string;
  const value = Number(formData.get("value"));
  const min_purchase = Number(formData.get("min_purchase")) || 0;
  const usage_limit = Number(formData.get("usage_limit")) || 1;
  const expired_at = formData.get("expired_at") as string;
  const is_active = formData.get("is_active") === "on" ? 1 : 0;

  await query(
    "UPDATE coupons SET code = ?, type = ?, value = ?, min_purchase = ?, usage_limit = ?, expired_at = ?, is_active = ? WHERE id = ?",
    [code, type, value, min_purchase, usage_limit, expired_at || null, is_active, id]
  );

  revalidatePath("/admin/kupon");
  redirect("/admin/kupon");
}

export async function deleteKupon(id: number) {
  await query("DELETE FROM coupons WHERE id = ?", [id]);
  revalidatePath("/admin/kupon");
}

export async function toggleActiveKupon(id: number, currentStatus: number) {
  await query("UPDATE coupons SET is_active = ? WHERE id = ?", [currentStatus === 1 ? 0 : 1, id]);
  revalidatePath("/admin/kupon");
}
