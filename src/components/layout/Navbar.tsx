"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/formations", label: "Formations" },
  { href: "/formations/tssr", label: "TSSR" },
  { href: "/formations/tai", label: "TAI" },
  { href: "/formations/ais", label: "AIS" },
  { href: "/tech-news", label: "Tech News" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-purple-500/20 py-3" : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm glow-purple transition-transform group-hover:scale-110">
            D
          </div>
          <span className="font-bold text-lg">
            <span className="gradient-text">Dojo</span>
            <span className="text-slate-300">.info</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium hover:opacity-90 transition-opacity glow-purple"
          >
            Commencer →
          </Link>
        </div>

        <button
          className="lg:hidden text-slate-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className={cn("block h-0.5 w-6 bg-current transition-transform", menuOpen && "rotate-45 translate-y-2")} />
            <span className={cn("block h-0.5 w-6 bg-current transition-opacity", menuOpen && "opacity-0")} />
            <span className={cn("block h-0.5 w-6 bg-current transition-transform", menuOpen && "-rotate-45 -translate-y-2")} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden glass border-t border-purple-500/20 mt-3">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "bg-purple-600/20 text-purple-300"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
