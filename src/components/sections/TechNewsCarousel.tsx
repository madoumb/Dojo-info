"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockNews } from "@/data/tech-events";

const categoryColors: Record<string, string> = {
  hardware: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  software: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  ia: "text-green-400 bg-green-400/10 border-green-400/20",
  securite: "text-red-400 bg-red-400/10 border-red-400/20",
  reseau: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

const categoryLabels: Record<string, string> = {
  hardware: "⚙️ Hardware",
  software: "💻 Software",
  ia: "🤖 IA",
  securite: "🔐 Sécurité",
  reseau: "🌐 Réseau",
};

export default function TechNewsCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % mockNews.length), []);
  const prev = () => setCurrent((c) => (c - 1 + mockNews.length) % mockNews.length);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [paused, next]);

  const item = mockNews[current];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 pulse-glow" />
            <span className="text-red-400 text-sm font-bold">LIVE</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Actu Tech du moment</h2>
        </div>
        <Link href="/tech-news" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
          Tout voir →
        </Link>
      </div>

      <div
        className="glass rounded-3xl overflow-hidden border border-white/5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative h-56 md:h-80">
            <Image
              key={item.id}
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 md:bg-gradient-to-r" />
            <span className={`absolute top-4 left-4 text-xs px-3 py-1 rounded-full border font-medium ${categoryColors[item.category]}`}>
              {categoryLabels[item.category]}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-slate-500 text-xs">{item.source}</span>
                <span className="text-slate-700">•</span>
                <span className="text-slate-500 text-xs">
                  {new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h3 className="text-white font-bold text-xl md:text-2xl mb-4 leading-tight">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.summary}</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              {/* Dots */}
              <div className="flex gap-2">
                {mockNews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`transition-all rounded-full ${i === current ? "w-6 h-2 bg-purple-500" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-xl glass border border-white/10 text-slate-400 hover:text-white hover:border-purple-500/30 transition-all flex items-center justify-center text-sm"
                >
                  ←
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-xl glass border border-white/10 text-slate-400 hover:text-white hover:border-purple-500/30 transition-all flex items-center justify-center text-sm"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini cards en dessous */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {mockNews.filter((_, i) => i !== current).slice(0, 3).map((news) => (
          <button
            key={news.id}
            onClick={() => setCurrent(mockNews.indexOf(news))}
            className="glass rounded-xl p-3 border border-white/5 hover:border-purple-500/20 transition-all text-left group"
          >
            <span className={`text-xs px-2 py-0.5 rounded border ${categoryColors[news.category]}`}>
              {categoryLabels[news.category]}
            </span>
            <p className="text-slate-300 text-xs mt-2 line-clamp-2 group-hover:text-white transition-colors">
              {news.title}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
