"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Beranda", href: "/#hero" },
  { label: "Kategori", href: "/#categories" },
  { label: "Produk", href: "/produk" },
  { label: "Promo", href: "/#promo" },
  { label: "Kontak", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <Link href="/" className="logo">
        FloraShop
      </Link>

      {/* Desktop */}
      <ul className="nav-links">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>

      {/* Hamburger */}
      <button
        className={`hamburger ${menuOpen ? "hamburger--active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="mobile-menu__link">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
