import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { courses, filiereConfig } from "@/data/courses";
import { courseContents } from "@/data/course-content";
import { cn } from "@/lib/utils";
import { Filiere } from "@/types";

interface Props {
  params: Promise<{ filiere: string; slug: string }>;
}

export async function generateStaticParams() {
  return courses.map((c) => ({ filiere: c.filiere, slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  return { title: course ? `${course.title} — Dojo.info` : "Cours — Dojo.info" };
}

const modulesByCourse: Record<string, { title: string; duration: string }[]> = {
  "administration-windows-server": [
    { title: "Introduction à Windows Server 2022", duration: "30 min" },
    { title: "Active Directory — Concepts et déploiement", duration: "2h" },
    { title: "Gestion des utilisateurs et groupes", duration: "1h" },
    { title: "Stratégies de groupe (GPO)", duration: "1h30" },
    { title: "Configuration DNS", duration: "1h" },
    { title: "Configuration DHCP", duration: "1h" },
    { title: "Partages de fichiers et NTFS", duration: "1h30" },
    { title: "Surveillance et journaux d'événements", duration: "45 min" },
    { title: "Sauvegarde Windows Server Backup", duration: "45 min" },
    { title: "Sécurisation du contrôleur de domaine", duration: "1h" },
    { title: "TP — Infrastructure complète", duration: "4h" },
    { title: "QCM de validation", duration: "20 min" },
  ],
  "linux-debian-admin": [
    { title: "Installation Debian/Ubuntu Server", duration: "30 min" },
    { title: "Système de fichiers et permissions", duration: "1h30" },
    { title: "Gestion des utilisateurs et groupes", duration: "1h" },
    { title: "Gestion des paquets (apt)", duration: "45 min" },
    { title: "Services systemd", duration: "1h30" },
    { title: "Sécurisation SSH", duration: "1h" },
    { title: "Firewall UFW / iptables", duration: "1h30" },
    { title: "Scripts Bash — Bases", duration: "2h" },
    { title: "Scripts Bash — Avancé", duration: "2h" },
    { title: "Cron et automatisation", duration: "1h" },
    { title: "QCM de validation", duration: "20 min" },
  ],
};

const DEFAULT_MODULES = [
  { title: "Introduction et prérequis", duration: "30 min" },
  { title: "Concepts théoriques fondamentaux", duration: "2h" },
  { title: "Mise en pratique guidée", duration: "2h" },
  { title: "Cas d'usage professionnel", duration: "1h30" },
  { title: "Travaux pratiques", duration: "3h" },
  { title: "QCM de validation", duration: "20 min" },
];

export default async function CoursePage({ params }: Props) {
  const { filiere, slug } = await params;
  const course = courses.find((c) => c.filiere === filiere && c.slug === slug);
  if (!course) notFound();

  const config = filiereConfig[filiere as Filiere];
  const content = courseContents[slug];
  const modules = modulesByCourse[slug] || DEFAULT_MODULES;

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 flex-wrap">
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
                <Image src={course.image} alt={course.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2 mb-3">
                    <span className={cn("text-xs font-bold px-2 py-1 rounded border", config.bgColor, config.textColor, config.borderColor)}>{config.name}</span>
                    <span className="text-xs px-2 py-1 rounded bg-black/50 text-slate-300 border border-white/10">{course.level}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{course.title}</h1>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-400 mb-6">{course.description}</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: "⏱", label: course.duration, sub: "durée totale" },
                    { icon: "📦", label: `${modules.length} modules`, sub: "au programme" },
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
              <h2 className="text-lg font-bold text-white mb-4">🎯 Objectifs pédagogiques</h2>
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

            {/* Real course content */}
            {content ? (
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-8">
                <h2 className="text-lg font-bold text-white">📖 Contenu du cours</h2>

                {/* Intro */}
                <div className={cn("rounded-xl p-4 border text-sm text-slate-300 leading-relaxed", config.bgColor, config.borderColor)}>
                  {content.intro}
                </div>

                {content.sections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-white font-semibold text-base border-b border-white/10 pb-2">{section.title}</h3>

                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {section.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                        i % 2 === 1
                          ? <strong key={i} className="text-white font-semibold">{part}</strong>
                          : part
                      )}
                    </div>

                    {section.code && (
                      <div className="rounded-xl overflow-hidden border border-white/10">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
                          <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500/60" />
                            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                            <span className="w-3 h-3 rounded-full bg-green-500/60" />
                          </div>
                          <span className="text-slate-500 text-xs ml-2">{section.code.lang}</span>
                        </div>
                        <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 bg-black/30 leading-relaxed">
                          <code>{section.code.code}</code>
                        </pre>
                      </div>
                    )}

                    {section.tip && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                        <span className="text-yellow-400 text-lg flex-shrink-0">💡</span>
                        <p className="text-yellow-200/80 text-sm">{section.tip}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl p-8 border border-white/5 text-center">
                <p className="text-slate-400 mb-2">Contenu détaillé en cours de rédaction</p>
                <p className="text-slate-600 text-sm">Revenez bientôt — ce cours sera disponible prochainement.</p>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">#{tag}</span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4">Votre progression</h3>
              <div className="relative h-2 bg-white/10 rounded-full mb-2">
                <div className={cn("absolute left-0 top-0 h-full rounded-full bg-gradient-to-r", config.color)} style={{ width: "0%" }} />
              </div>
              <p className="text-slate-500 text-xs">0/{modules.length} modules complétés</p>
            </div>

            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4">Plan du cours</h3>
              <div className="space-y-2">
                {modules.map((mod, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl text-sm bg-white/2 border border-white/5 hover:border-purple-500/20 transition-colors">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-white/10 text-slate-500">
                      {i + 1}
                    </span>
                    <p className="text-slate-300 flex-1 text-xs">{mod.title}</p>
                    <span className="text-slate-600 text-xs flex-shrink-0">{mod.duration}</span>
                  </div>
                ))}
              </div>
              <button className={cn("w-full mt-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r transition-opacity hover:opacity-90", config.color)}>
                Commencer le cours →
              </button>
            </div>

            <div className="glass rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4">Ressources</h3>
              <div className="space-y-2">
                {[
                  { icon: "📄", label: "Fiche récap PDF", tag: "PDF" },
                  { icon: "🛠", label: "TP avec corrigé", tag: "ZIP" },
                  { icon: "🔗", label: "Documentation officielle", tag: "EXT" },
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
