import Link from "next/link";
import Image from "next/image";
import { mockNews } from "@/data/tech-events";

const categoryColors: Record<string, string> = {
  hardware: "tag-hardware",
  software: "tag-software",
  ia: "tag-ia",
  securite: "tag-securite",
  reseau: "tag-reseau",
};

export default function TechPulse() {
  const news = mockNews.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="glass rounded-3xl p-8 border border-purple-500/10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 pulse-glow" />
              <span className="text-red-400 text-sm font-bold">LIVE</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Tech Pulse</h2>
            <span className="text-slate-500 text-sm hidden sm:block">— Computex · CES · WWDC · Google I/O · MWC</span>
          </div>
          <Link href="/tech-news" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
            Tout voir →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {news.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/5 bg-white/2 overflow-hidden hover:border-purple-500/20 transition-all group">
              <div className="relative h-36">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className={cn("absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded border", categoryColors[item.category] || "text-slate-400")} style={{fontSize: "10px"}}>
                  {item.category.toUpperCase()}
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-white text-sm font-medium line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{item.source}</span>
                  <span>{new Date(item.date).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
