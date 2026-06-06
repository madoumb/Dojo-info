import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { courses, filiereConfig } from "@/data/courses";
import { cn } from "@/lib/utils";
import { Filiere } from "@/types";

interface Props {
  params: Promise<{ filiere: string; slug: string }>;
}

export async function generateStaticParams() {
  return courses.map((c) => ({ filiere: c.filiere, slug: c.slug }));
}

const SAMPLE_MODULES = [
  { title: "Introduction et prérequis", duration: "30 min", completed: true },
  { title: "Installation et configuration", duration: "1h30", completed: true },
  { title: "Concepts fondamentaux", duration: "2h", completed: false },
  { title: "Travaux pratiques guidés", duration: "3h", completed: false },
  { title: "Cas d'usage professionnel", duration: "1h30", completed: false },
  { title: "QCM de validation", duration: "20 min", completed: false },
];

export default async function CoursePage({ params }: Props) {
  const { filiere, slug } = await params;
  const course = courses.find((c) => c.filiere === filiere && c.slug === slug);
  if (!course) notFound();

  const config = filiereConfig[filiere as Filiere];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-purple-400 transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/formations" className="hover:text-purple-400 transition-colors">Formations</Link>
          <span>/</span>
          <Link href={`/formations/${filiere}`} className={cn("hover:opacity-80 transition-opacity", config.textColor)}>{config.name}</Link>
          <span>/</span>
          <span className="text-slate-300 line-clamp-1">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course header */}
            <div className="glass rounded-2xl overflow-hidden border border-white/5">
              <div className="relative h-64">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2 mb-3">
                    <span className={cn("text-xs font-bold px-2 py-1 rounded border", config.bgColor, config.textColor, config.borderColor)}>
                      {config.name}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-black/50 text-slate-300 border border-white/10">
                      {course.level}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{course.title}</h1>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-400 mb-6">{course.description}</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: "⏱", label: course.duration, sub: "durée totale" },
                    { icon: "📦", label: `${course.modules} modules`, sub: "progression" },
                    { icon: "📅", label: new Date(course.updatedAt).toLocaleDateString("fr-FR"), sub: "mis à jour" },
                  ].map((stat) => (
                    <div key={stat.sub} className="bg-white/3 rounded-xl p-3">
                      <div className="text-xl mb-1">{stat.icon}</div>
                      <div className="text-white text-sm font-semibold">{stat.label}</div>
                      <div className="text-slate-500 text-xs">{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                🎯 Objectifs pédagogiques
              </h2>
              <div className="space-y-3">
                {course.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5", config.bgColor, config.textColor, "border", config.borderColor)}>
                      {i + 1}
                    </span>
                    <p className="text-slate-300 text-sm">{obj}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample course content */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                📖 Contenu du cours
              </h2>

              {/* Theory section */}
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <h3 className="text-white font-semibold text-base">1. Introduction</h3>
                <p>
                  Ce module couvre les fondamentaux essentiels de{" "}
                  <strong className="text-purple-300">{course.title}</strong>.
                  Vous apprendrez à maîtriser les concepts clés utilisés en environnement professionnel,
                  conformément aux compétences attendues dans le référentiel{" "}
                  <a href="https://eduscol.education.fr" target="_blank" rel="noopener noreferrer" className={cn("underline", config.textColor)}>
                    Éduscol BTS SIO
                  </a>.
                </p>

                <div className={cn("rounded-xl p-4 border", config.bgColor, config.borderColor)}>
                  <p className="font-mono text-xs text-slate-300">
                    <span className={config.textColor}>$ </span>
                    # Exemple de commande professionnelle<br />
                    <span className={config.textColor}>$ </span>
                    systemctl status nginx<br />
                    <span className="text-green-400">● nginx.service - A high performance web server</span><br />
                    <span className="text-slate-500">   Active: active (running) since Mon...</span>
                  </p>
                </div>

                <h3 className="text-white font-semibold text-base mt-6">2. Concepts clés</h3>
                <p>
                  Les compétences développées dans ce cours sont directement applicables
                  en situation professionnelle et correspondent aux blocs de compétences
                  officiels du diplôme.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {course.tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2 bg-white/3 rounded-lg p-3 border border-white/5">
                      <span className={cn("w-2 h-2 rounded-full", config.bgColor.replace("/10", ""))} style={{background: config.textColor.includes("blue") ? "#60A5FA" : config.textColor.includes("orange") ? "#FB923C" : "#F87171"}} />
                      <span className="text-slate-300 text-sm">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4">Votre progression</h3>
              <div className="relative h-2 bg-white/10 rounded-full mb-2">
                <div className={cn("absolute left-0 top-0 h-full rounded-full bg-gradient-to-r", config.color)} style={{ width: "33%" }} />
              </div>
              <p className="text-slate-500 text-xs">2/6 modules complétés</p>
            </div>

            {/* Modules */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4">Plan du cours</h3>
              <div className="space-y-2">
                {SAMPLE_MODULES.map((mod, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl text-sm transition-all",
                      mod.completed ? "bg-green-500/5 border border-green-500/15" : "bg-white/2 border border-white/5 hover:border-purple-500/20"
                    )}
                  >
                    <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0", mod.completed ? "bg-green-500/20 text-green-400" : "bg-white/10 text-slate-500")}>
                      {mod.completed ? "✓" : i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-medium truncate", mod.completed ? "text-slate-400 line-through" : "text-slate-300")}>
                        {mod.title}
                      </p>
                    </div>
                    <span className="text-slate-600 text-xs flex-shrink-0">{mod.duration}</span>
                  </div>
                ))}
              </div>
              <button className={cn("w-full mt-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r transition-opacity hover:opacity-90", config.color)}>
                Continuer le cours →
              </button>
            </div>

            {/* Resources */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4">Ressources</h3>
              <div className="space-y-2">
                {[
                  { icon: "📄", label: "Fiche récap PDF", tag: "PDF" },
                  { icon: "🛠", label: "TP corrigé", tag: "ZIP" },
                  { icon: "🔗", label: "Docs Éduscol officielles", tag: "EXT" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5 hover:border-purple-500/20 cursor-pointer transition-colors group">
                    <span>{r.icon}</span>
                    <span className="text-slate-300 text-sm flex-1 group-hover:text-white transition-colors">{r.label}</span>
                    <span className="text-xs bg-white/10 text-slate-500 px-2 py-0.5 rounded">{r.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
