"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const TYPING_WORDS = ["TSSR", "TAI", "AIS", "Réseaux", "Cybersécurité", "Cloud", "Linux", "Pentest"];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex];
    let timeout: NodeJS.Timeout;

    if (!deleting && displayed === word) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed === "") {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % TYPING_WORDS.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayed(deleting ? word.slice(0, displayed.length - 1) : word.slice(0, displayed.length + 1));
      }, deleting ? 60 : 100);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/20 text-sm text-purple-300 mb-8 float">
          <span className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
          Plateforme mise à jour automatiquement — Référentiels Éduscol 2025
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          <span className="text-white">Deviens expert</span>
          <br />
          <span className="gradient-text text-glow">
            {displayed}
            <span className="cursor-blink text-purple-400">|</span>
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Cours complets et à jour pour <strong className="text-slate-300">BTS SIO</strong>,{" "}
          <strong className="text-slate-300">BUT Réseaux</strong> et{" "}
          <strong className="text-slate-300">BUT Informatique</strong>.
          Filières TSSR, TAI et AIS avec projets pratiques, QCM et veille tech live.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/formations"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-lg hover:opacity-90 transition-all glow-purple hover:scale-105"
          >
            Explorer les formations →
          </Link>
          <Link
            href="/tech-news"
            className="px-8 py-4 rounded-xl glass border border-purple-500/20 text-slate-300 font-semibold text-lg hover:border-purple-500/50 hover:text-white transition-all"
          >
            🔴 Tech News live
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: "8+", label: "Cours complets", icon: "📚" },
            { value: "3", label: "Filières", icon: "🎯" },
            { value: "100%", label: "Gratuit", icon: "✅" },
            { value: "Live", label: "Actu tech", icon: "⚡" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 glass-hover">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
        <span className="text-xs">Défiler</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500/50 to-transparent" />
      </div>
    </section>
  );
}
