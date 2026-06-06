"use client";

import { useEffect, useState } from "react";

interface Coupon {
  id: number;
  code: string;
  type: string;
  value: string;
  min_purchase: string;
  expired_at: string;
}

export default function PromoSection() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => {
        setCoupons(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading coupons:", err);
        setCoupons([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(price));
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Kode kupon ${code} berhasil disalin!`);
  };

  if (!loading && coupons.length === 0) return null;

  return (
    <section id="promo" className="berita-section" style={{ background: "rgba(212, 167, 106, 0.03)", borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)" }}>
      <h2 className="section-title">
        Promo <span className="text-gradient">Spesial</span>
      </h2>
      <p className="section-subtitle">
        Gunakan kode kupon di bawah ini saat checkout untuk mendapatkan potongan harga
      </p>

      {loading ? (
        <div className="promo-grid">
          {[1, 2].map((i) => (
            <div className="promo-card skeleton" style={{ height: "200px" }} key={i}></div>
          ))}
        </div>
      ) : (
        <div className="promo-grid">
          {coupons.map((coupon, i) => (
            <div className="promo-card" key={coupon.id} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="promo-card__code">{coupon.code}</div>
              <div className="promo-card__value">
                {coupon.type === "percent" 
                  ? `Diskon ${Number(coupon.value)}%` 
                  : `Potongan ${formatPrice(coupon.value)}`}
              </div>
              <div className="promo-card__detail">
                Min. Belanja: {formatPrice(coupon.min_purchase)}
              </div>
              <div className="promo-card__expiry">
                Berlaku hingga: {new Date(coupon.expired_at).toLocaleDateString("id-ID")}
              </div>
              <button 
                onClick={() => copyToClipboard(coupon.code)}
                className="catalog-filter__btn" 
                style={{ marginTop: "1.5rem", width: "100%" }}
              >
                SALIN KODE
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
