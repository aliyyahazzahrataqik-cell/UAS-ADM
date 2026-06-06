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
        if (entry.isIntersecting) el.classList.add("hero--visible");
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      <div className="floating-accent" style={{ top: "20%", left: "10%" }} />
      <div className="floating-accent floating-accent--alt" style={{ bottom: "10%", right: "15%" }} />

      <span className="hero-tagline">FloraShop Exclusive</span>
      <h1 className="hero-title">
        SAMPAIKAN PESANMU
        <br />
        <span className="hero-title--gradient">DENGAN BUNGA</span>
      </h1>
      <p className="hero-description">
        Rangkaian bunga segar berkualitas premium untuk setiap momen spesial Anda. 
        Mulai dari buket romantis, bunga papan ucapan, hingga dekorasi meja yang elegan.
      </p>
      <Link href="/produk" className="cta-button">
        LIHAT KOLEKSI KAMI
      </Link>
    </section>
  );
}
