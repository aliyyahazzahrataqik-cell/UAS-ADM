import { query } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus, updatePaymentStatus } from "@/app/actions/pesanan";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const orders = await query<any>("SELECT * FROM orders WHERE id = ?", [id]);
  if (!orders || orders.length === 0) notFound();
  const order = orders[0];

  const items = await query<any>(
    `SELECT oi.*, p.name, p.slug 
     FROM order_items oi 
     JOIN products p ON oi.product_id = p.id 
     WHERE oi.order_id = ?`, 
    [id]
  );

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(price));
  };

  const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentOptions = ['unpaid', 'paid', 'refunded'];

  return (
    <div style={{ maxWidth: "900px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/pesanan" className="admin-btn admin-btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <div className="admin-page-title">Detail Pesanan #{order.order_number}</div>
            <div className="admin-page-subtitle">{new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="admin-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Item Pesanan</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Harga</th>
                  <th>Qty</th>
                  <th align="right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                    </td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td align="right" style={{ fontWeight: 600 }}>{formatPrice(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} align="right" style={{ paddingTop: "16px" }}>Subtotal</td>
                  <td align="right" style={{ paddingTop: "16px" }}>{formatPrice(order.subtotal)}</td>
                </tr>
                {Number(order.discount_amount) > 0 && (
                  <tr>
                    <td colSpan={3} align="right">Diskon</td>
                    <td align="right" style={{ color: "#ef4444" }}>-{formatPrice(order.discount_amount)}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={3} align="right">Ongkos Kirim</td>
                  <td align="right">{formatPrice(order.shipping_cost)}</td>
                </tr>
                <tr>
                  <td colSpan={3} align="right" style={{ fontSize: "16px", fontWeight: 700 }}>Total Akhir</td>
                  <td align="right" style={{ fontSize: "16px", fontWeight: 700, color: "#e8637a" }}>{formatPrice(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="admin-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Informasi Pengiriman</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Nama Penerima</div>
                <div style={{ fontWeight: 500 }}>{order.recipient_name}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>No. Telepon Penerima</div>
                <div style={{ fontWeight: 500 }}>{order.recipient_phone}</div>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Alamat Lengkap</div>
                <div style={{ fontWeight: 500 }}>{order.shipping_address}</div>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Catatan Pesanan</div>
                <div style={{ fontWeight: 500, padding: "12px", background: "#f8fafc", borderRadius: "8px", marginTop: "4px" }}>
                  {order.notes || "Tidak ada catatan"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="admin-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Update Status</h3>
            
            <form action={async (formData) => {
              "use server";
              await updateOrderStatus(Number(id), formData.get("status") as string);
            }} style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Status Pesanan</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select name="status" defaultValue={order.status} className="admin-form-input">
                  {statusOptions.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                </select>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: "0 16px" }}>Update</button>
              </div>
            </form>

            <form action={async (formData) => {
              "use server";
              await updatePaymentStatus(Number(id), formData.get("payment_status") as string);
            }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Status Pembayaran</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select name="payment_status" defaultValue={order.payment_status} className="admin-form-input">
                  {paymentOptions.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                </select>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: "0 16px" }}>Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
