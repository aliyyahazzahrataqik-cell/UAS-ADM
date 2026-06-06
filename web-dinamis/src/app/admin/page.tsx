import { query } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const productCount = await query<any>("SELECT COUNT(*) as total FROM products");
  const orderCount = await query<any>("SELECT COUNT(*) as total FROM orders");
  const pendingOrder = await query<any>("SELECT COUNT(*) as total FROM orders WHERE status = 'pending'");
  const totalRevenue = await query<any>("SELECT SUM(total) as revenue FROM orders WHERE payment_status = 'paid'");

  const stats = [
    { name: "Total Pendapatan", value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalRevenue[0]?.revenue || 0), href: "/admin/pesanan", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    { name: "Pesanan Baru", value: pendingOrder[0]?.total ?? 0, href: "/admin/pesanan", color: "#e8637a", bg: "#fff1f2", border: "#fecdd3" },
    { name: "Total Pesanan", value: orderCount[0]?.total ?? 0, href: "/admin/pesanan", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    { name: "Total Produk", value: productCount[0]?.total ?? 0, href: "/admin/produk", color: "#d4a76a", bg: "#fefce8", border: "#fef08a" },
  ];

  const recentOrders = await query<any>(
    "SELECT id, order_number, recipient_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5"
  );
  
  const recentProducts = await query<any>(
    "SELECT id, name, price, stock, is_active FROM products ORDER BY created_at DESC LIMIT 5"
  );

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
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
          Selamat Datang di FloraShop 👋
        </h2>
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          Berikut adalah ringkasan performa toko bunga Anda hari ini.
        </p>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {stats.map((s) => (
          <Link key={s.name} href={s.href} className="admin-stat-card" style={{ textDecoration: "none" }}>
            <div>
              <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, marginBottom: "8px" }}>{s.name}</div>
              <div style={{ fontSize: s.name === "Total Pendapatan" ? "24px" : "32px", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{s.value}</div>
            </div>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: s.bg, border: `1px solid ${s.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: s.color, fontSize: "22px", fontWeight: 800,
            }}>
              {s.name === "Total Pendapatan" ? "💰" : s.name === "Pesanan Baru" ? "🔔" : s.name === "Total Pesanan" ? "📦" : "🌸"}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Recent Orders */}
        <div className="admin-card">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>Pesanan Terbaru</div>
            <Link href="/admin/pesanan" className="admin-btn admin-btn-secondary" style={{ padding: "6px 14px", fontSize: "12px" }}>Lihat Semua</Link>
          </div>
          <div>
            {recentOrders.length === 0 ? (
               <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>Belum ada pesanan.</div>
            ) : recentOrders.map((o: any) => (
              <div key={o.id} style={{ padding: "14px 24px", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{o.order_number} <span style={{ fontWeight: 400, color: "#64748b" }}>• {o.recipient_name}</span></div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{formatPrice(o.total)}</div>
                </div>
                <span className={`admin-badge ${getStatusColor(o.status)}`} style={{ textTransform: "capitalize" }}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="admin-card">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>Produk Terbaru</div>
            <Link href="/admin/produk/create" className="admin-btn admin-btn-primary" style={{ padding: "6px 14px", fontSize: "12px", background: "#e8637a" }}>+ Tambah</Link>
          </div>
          <div>
            {recentProducts.length === 0 ? (
               <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>Belum ada produk.</div>
            ) : recentProducts.map((p: any) => (
              <div key={p.id} style={{ padding: "14px 24px", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{formatPrice(p.price)} • Stok: {p.stock}</div>
                </div>
                <span className={`admin-badge ${p.is_active ? "admin-badge-green" : "admin-badge-gray"}`}>
                  {p.is_active ? "Aktif" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
