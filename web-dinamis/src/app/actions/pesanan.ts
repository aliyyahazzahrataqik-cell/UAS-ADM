"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(id: number, newStatus: string) {
  await query("UPDATE orders SET status = ? WHERE id = ?", [newStatus, id]);
  revalidatePath("/admin/pesanan");
  revalidatePath(`/admin/pesanan/${id}`);
}

export async function updatePaymentStatus(id: number, newStatus: string) {
  const paid_at = newStatus === 'paid' ? new Date() : null;
  await query("UPDATE orders SET payment_status = ?, paid_at = ? WHERE id = ?", [newStatus, paid_at, id]);
  revalidatePath("/admin/pesanan");
  revalidatePath(`/admin/pesanan/${id}`);
}
