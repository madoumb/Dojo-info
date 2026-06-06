import Link from "next/link";
import Image from "next/image";
import { courses, filiereConfig } from "@/data/courses";
import { cn } from "@/lib/utils";
import { Filiere } from "@/types";

export const metadata = {
  title: "Formations — Dojo.info",
  description: "Tous les cours TSSR, TAI, AIS — réseaux, sécurité, automates industriels.",
};

const levelColors: Record<string, string> = {
  "débutant": "text-green-400 bg-green-400/10 border-green-400/20",
  "intermédiaire": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  "avancé": "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function FormationsPage() {
  const filieres: Filiere[] = ["tssr", "ais", "tai"];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Toutes les{" "}
            <span className="gradient-text">formations</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Cours professionnels alignés sur Éduscol BTS SIO & BUT Informatique.
            Mis à jour en continu.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {["Tous", "TSSR", "AIS", "TAI"].map((f) => (
            <span
              key={f}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all border",
                f === "Tous"
                  ? "bg-purple-600/20 text-purple-300 border-purple-500/30"
                  : "glass text-slate-400 border-white/5 hover:border-purple-500/20 hover:text-white"
              )}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Courses by filiere */}
        {filieres.map((filiere) => {
          const config = filiereConfig[filiere];
          const filiereCourses = courses.filter((c) => c.filiere === filiere);
          if (!filiereCourses.length) return null;

          return (
            <div key={filiere} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{config.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{config.name}</h2>
                  <p className={cn("text-sm", config.textColor)}>{config.fullName}</p>
                </div>
                <span className={cn("ml-auto text-xs px-3 py-1 rounded-full border font-medium", config.bgColor, config.textColor, config.borderColor)}>
                  {filiereCourses.length} cours
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filiereCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/formations/${filiere}/${course.slug}`}
                    className="glass rounded-xl overflow-hidden glass-hover border border-white/5 group"
                  >
                    <div className="relative h-40">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <span className={cn("absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded border", levelColors[course.level])}>
                        {course.level}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white text-sm font-semibold mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex gap-3 text-xs text-slate-600">
                        <span>⏱ {course.duration}</span>
                        <span>📦 {course.modules} mod.</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
