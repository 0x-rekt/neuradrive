"use client";

import { usePathname } from "next/navigation";

const Footer = () => {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  if (!pathname) return null;

  if (pathname.startsWith("/chat")) return null;

  return (
    <footer className="py-4 border-t border-white/5 text-center text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4">
        <span>© {year} NeuraDrive.</span>
      </div>
    </footer>
  );
};

export default Footer;
