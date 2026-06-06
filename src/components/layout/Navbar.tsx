"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/formations", label: "Formations" },
  { href: "/formations/tssr", label: "TSSR" },
  { href: "/formations/tai", label: "TAI" },
  { href: "/formations/ais", label: "AIS" },
  { href: "/tech-news", label: "Tech News" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? "?";

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "glass border-b border-purple-500/20 py-3" : "py-5 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm glow-purple transition-transform group-hover:scale-110">
            D
          </div>
          <span className="font-bold text-lg">
            <span className="gradient-text">Dojo</span>
            <span className="text-slate-300">.info</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                pathname === link.href
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-white/10 hover:border-purple-500/30 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-slate-300 text-sm max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <span className="text-slate-500 text-xs">{userMenuOpen ? "▲" : "▼"}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-white/10 overflow-hidden shadow-xl">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-colors"
                  >
                    📊 Mon dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 text-sm transition-colors border-t border-white/5"
                  >
                    🚪 Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-lg text-slate-300 text-sm font-medium hover:text-white hover:bg-white/5 transition-all"
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium hover:opacity-90 transition-opacity glow-purple"
              >
                Créer un compte →
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
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

      {/* Mobile menu */}
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
                  pathname === link.href ? "bg-purple-600/20 text-purple-300" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/5 pt-3 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-slate-300 text-sm">📊 Dashboard</Link>
                  <button onClick={handleSignOut} className="px-3 py-2 text-red-400 text-sm text-left">🚪 Se déconnecter</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-slate-400 text-sm hover:text-white">Connexion</Link>
                  <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="px-3 py-2 bg-purple-600/20 text-purple-300 rounded-lg text-sm">Créer un compte</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
