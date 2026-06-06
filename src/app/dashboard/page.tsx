"use client";

import Link from "next/link";
import { courses, filiereConfig } from "@/data/courses";
import { cn } from "@/lib/utils";

const MOCK_PROGRESS: Record<string, number> = {
  "tssr-01": 75,
  "tssr-02": 33,
  "ais-01": 10,
  "tai-01": 0,
};

const badges = [
  { icon: "🌱", name: "Premier pas", description: "1er cours démarré", unlocked: true },
  { icon: "⚡", name: "Sprint", description: "3 modules en 1 jour", unlocked: true },
  { icon: "🔐", name: "Sécuriste", description: "Cours AIS complété", unlocked: false },
  { icon: "🏆", name: "Expert TSSR", description: "Toute la filière TSSR", unlocked: false },
  { icon: "🤖", name: "Automaticien", description: "Cours TAI complété", unlocked: false },
  { icon: "🎓", name: "Diplômable", description: "90% de complétion", unlocked: false },
];

export default function DashboardPage() {
  const inProgress = courses.filter((c) => MOCK_PROGRESS[c.id] && MOCK_PROGRESS[c.id] > 0 && MOCK_PROGRESS[c.id] < 100);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-8 border border-purple-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-slate-500 text-sm mb-1">Bon retour 👋</p>
            <h1 className="text-2xl font-bold text-white">Mon Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Continuez là où vous en étiez</p>
          </div>
          <div className="flex gap-4">
            {[
              { label: "Cours démarrés", value: "3" },
              { label: "Modules finis", value: "7" },
              { label: "Badges", value: "2" },
            ].map((s) => (
              <div key={s.label} className="text-center glass rounded-xl px-4 py-3">
                <div className="text-xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-slate-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress cards */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-white">En cours</h2>
            {inProgress.map((course) => {
              const config = filiereConfig[course.filiere];
              const progress = MOCK_PROGRESS[course.id] || 0;
              return (
                <Link
                  key={course.id}
                  href={`/formations/${course.filiere}/${course.slug}`}
                  className="glass rounded-2xl p-5 border border-white/5 glass-hover flex gap-5"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-xs font-bold", config.textColor)}>{config.name}</span>
                      <span className="text-slate-600 text-xs">{course.duration}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2 truncate">{course.title}</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r transition-all", config.color)}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className={cn("text-xs font-bold flex-shrink-0", config.textColor)}>{progress}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* All courses quick access */}
            <h2 className="text-lg font-bold text-white pt-4">Tous les cours disponibles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.map((course) => {
                const config = filiereConfig[course.filiere];
                const progress = MOCK_PROGRESS[course.id] || 0;
                return (
                  <Link
                    key={course.id}
                    href={`/formations/${course.filiere}/${course.slug}`}
                    className="flex items-center gap-3 p-3 glass rounded-xl border border-white/5 hover:border-purple-500/20 transition-all group"
                  >
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0", config.bgColor, "border", config.borderColor)}>
                      {config.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-xs font-medium truncate group-hover:text-white transition-colors">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-white/10 rounded-full">
                          <div className={cn("h-full rounded-full bg-gradient-to-r", config.color)} style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-600">{progress}%</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progression par filière */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-5">Progression par filière</h3>
              {(["tssr", "ais", "tai"] as const).map((key) => {
                const config = filiereConfig[key];
                const fCourses = courses.filter((c) => c.filiere === key);
                const avg = Math.round(fCourses.reduce((acc, c) => acc + (MOCK_PROGRESS[c.id] || 0), 0) / fCourses.length);
                return (
                  <div key={key} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        <span className="text-slate-300 text-sm font-medium">{config.name}</span>
                      </div>
                      <span className={cn("text-sm font-bold", config.textColor)}>{avg}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full bg-gradient-to-r transition-all", config.color)} style={{ width: `${avg}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Badges */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-5">Badges & Récompenses</h3>
              <div className="grid grid-cols-3 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.name}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all",
                      badge.unlocked
                        ? "bg-purple-600/10 border-purple-500/30 pulse-glow"
                        : "bg-white/2 border-white/5 opacity-40"
                    )}
                    title={badge.description}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-xs text-slate-400 font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4">Ressources rapides</h3>
              <div className="space-y-2">
                {[
                  { label: "📚 Éduscol BTS SIO", href: "https://eduscol.education.fr/2129/bts-sio-services-informatiques-aux-organisations" },
                  { label: "🔐 ANSSI Guides", href: "https://www.ssi.gouv.fr/guide/" },
                  { label: "🌐 Cisco NetAcad", href: "https://www.netacad.com" },
                  { label: "⚡ TryHackMe", href: "https://tryhackme.com" },
                ].map((r) => (
                  <a
                    key={r.label}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white text-sm transition-all"
                  >
                    {r.label}
                    <span className="ml-auto text-slate-600 text-xs">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
