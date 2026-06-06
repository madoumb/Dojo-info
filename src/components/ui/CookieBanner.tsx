"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 glass rounded-2xl p-5 border border-purple-500/20 shadow-2xl shadow-black/50">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl flex-shrink-0">🍪</span>
        <div>
          <h3 className="text-white font-semibold text-sm mb-1">Cookies & Confidentialité</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Nous utilisons des cookies pour améliorer votre expérience. Aucun cookie publicitaire.{" "}
            <Link href="/confidentialite" className="text-purple-400 hover:underline">
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={accept}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Accepter
        </button>
        <button
          onClick={decline}
          className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:text-white hover:border-white/20 transition-all"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}
