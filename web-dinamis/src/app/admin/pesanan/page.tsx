import { query } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPesananPage() {
  const orders = await query<any>("SELECT * FROM orders ORDER BY created_at DESC");

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(price));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'admin-badge-gray';
      case 'paid': return 'admin-badge-green';
      case 'processing': return 'admin-badge-blue';
      case 'shipped': return 'admin-badge-blue';
      case 'delivered': return 'admin-badge-green';
      case 'cancelled': return 'admin-badge-red';
      default: return 'admin-badge-gray';
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Kelola Pesanan</div>
          <div className="admin-page-subtitle">Daftar semua pesanan dari pelanggan</div>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nomor Pesanan</th>
              <th>Tanggal</th>
              <th>Penerima</th>
              <th>Total</th>
              <th>Status Pesanan</th>
              <th>Status Bayar</th>
              <th align="right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Belum ada pesanan.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: "#1e293b" }}>{order.order_number}</td>
                <td>{new Date(order.created_at).toLocaleString("id-ID", { dateStyle: 'medium', timeStyle: 'short' })}</td>
                <td>{order.recipient_name}</td>
                <td style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
                <td>
                  <span className={`admin-badge ${getStatusColor(order.status)}`} style={{ textTransform: "capitalize" }}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${order.payment_status === 'paid' ? 'admin-badge-green' : order.payment_status === 'unpaid' ? 'admin-badge-red' : 'admin-badge-gray'}`} style={{ textTransform: "capitalize" }}>
                    {order.payment_status}
                  </span>
                </td>
                <td align="right">
                  <Link href={`/admin/pesanan/${order.id}`} className="admin-btn admin-btn-secondary" style={{ padding: "6px 12px", fontSize: "13px" }}>
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
