"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("hero--visible");
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className="hero-split" ref={sectionRef}>
      <div className="hero-split__content">
        <span className="hero-tagline">✨ Rangkaian Bunga Premium ✨</span>

        <h1 className="hero-title">
          UNGKAPKAN PERASAANMU
          <br />
          <span className="hero-title--gradient">DENGAN BUNGA INDAH</span>
        </h1>

        <p className="hero-description">
          Koleksi bunga eksklusif yang dirancang khusus untuk momen spesial Anda.
          Dari buket romantis hingga dekorasi elegan, dirangkai dengan sepenuh hati.
        </p>

        <div className="hero-actions">
          <Link href="/produk" className="cta-button">
            JELAJAHI KOLEKSI
          </Link>
          <Link href="#featured" className="cta-button cta-button--gold">
            LIHAT BESTSELLER
          </Link>
        </div>

        {/* Flower badges */}
        <div className="hero-badges">
          <div className="hero-badge">
            <div className="hero-badge__icon">🌸</div>
            <div className="hero-badge__text">Bunga Segar</div>
          </div>
          <div className="hero-badge">
            <div className="hero-badge__icon">🚚</div>
            <div className="hero-badge__text">Pengiriman Cepat</div>
          </div>
          <div className="hero-badge">
            <div className="hero-badge__icon">❤️</div>
            <div className="hero-badge__text">Kualitas Premium</div>
          </div>
        </div>
      </div>

      <div className="hero-split__image">
        <div className="hero-image-wrapper">
          <img 
            src="/images/hero_flower_1.png" 
            alt="Beautiful Premium Peonies"
            className="hero-main-img"
          />
          <div className="hero-image-backdrop"></div>
        </div>
      </div>
    </section>
  );
}
