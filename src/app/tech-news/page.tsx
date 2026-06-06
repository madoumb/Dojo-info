import Image from "next/image";
import { mockNews, techEvents } from "@/data/tech-events";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Tech News — Dojo.info",
  description: "Actualités tech en temps réel : Computex, CES, WWDC, Google I/O, MWC et salons hi-tech.",
};

const categoryColors: Record<string, string> = {
  hardware: "tag-hardware",
  software: "tag-software",
  ia: "tag-ia",
  securite: "tag-securite",
  reseau: "tag-reseau",
};

const categoryLabels: Record<string, string> = {
  hardware: "⚙️ Hardware",
  software: "💻 Software",
  ia: "🤖 IA",
  securite: "🔐 Sécurité",
  reseau: "🌐 Réseau",
};

export default function TechNewsPage() {
  const upcoming = techEvents.filter((e) => e.upcoming);
  const past = techEvents.filter((e) => !e.upcoming);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-red-500/20 text-sm text-red-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-400 pulse-glow" />
            Actualités en temps réel
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tech <span className="gradient-text">Pulse</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Computex · CES · WWDC · Google I/O · Microsoft Build · Black Hat · AWS re:Invent
          </p>
        </div>

        {/* Latest news */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            📰 Dernières actualités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockNews.map((item, i) => (
              <article
                key={item.id}
                className={cn(
                  "glass rounded-2xl overflow-hidden glass-hover border border-white/5 group",
                  i === 0 && "md:col-span-2"
                )}
              >
                <div className={cn("relative overflow-hidden", i === 0 ? "h-56" : "h-44")}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "33vw"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <span className={cn("absolute top-3 left-3 text-xs px-2 py-1 rounded border", categoryColors[item.category])}>
                    {categoryLabels[item.category]}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{item.summary}</p>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-400">{item.source}</span>
                    <span>{new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Upcoming events */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            📅 Salons & Keynotes à venir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((event) => {
              const date = new Date(event.date);
              const monthsAway = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
              return (
                <div
                  key={event.id}
                  className={cn("glass rounded-xl p-5 border glass-hover", categoryColors[event.category]?.replace("tag-", "border-").replace(/color[^;]+;/g, ""),"border-white/5")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("text-xs px-2 py-0.5 rounded border", categoryColors[event.category])}>
                          {categoryLabels[event.category]}
                        </span>
                        {monthsAway <= 3 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-orange-400/10 text-orange-400 border border-orange-400/20">
                            Dans {monthsAway} mois
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-bold mb-1">{event.name}</h3>
                      <p className="text-slate-500 text-sm mb-3">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>📍 {event.location}</span>
                        <span>🗓 {date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                      </div>
                    </div>
                    <div className="text-center glass rounded-xl p-3 min-w-[60px]">
                      <div className="text-xl font-bold text-white">{date.getDate()}</div>
                      <div className="text-xs text-slate-500">{date.toLocaleDateString("fr-FR", { month: "short" })}</div>
                      <div className="text-xs text-slate-600">{date.getFullYear()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Past events */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            🏁 Événements passés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {past.map((event) => (
              <div key={event.id} className="glass rounded-xl p-4 border border-white/5 opacity-60 hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded border", categoryColors[event.category])}>
                    {categoryLabels[event.category]}
                  </span>
                </div>
                <h3 className="text-slate-300 font-semibold mb-1">{event.name}</h3>
                <p className="text-slate-600 text-xs">{event.location}</p>
                <p className="text-slate-600 text-xs mt-1">
                  {new Date(event.date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
