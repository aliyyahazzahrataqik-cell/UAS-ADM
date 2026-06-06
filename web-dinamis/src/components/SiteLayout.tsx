"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHiddenRoute = pathname?.startsWith("/admin") || pathname === "/login";

  return (
    <>
      {!isHiddenRoute && (
        <>
          <div className="mesh-bg" />
          <div className="floating-blob blob-1" />
          <div className="floating-blob blob-2" />
          <div className="floating-blob blob-3" />
        </>
      )}
      {!isHiddenRoute && <Navbar />}
      <main className={isHiddenRoute ? "w-full min-h-screen" : ""}>{children}</main>
      {!isHiddenRoute && <Footer />}
    </>
  );
}
