import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { courses, filiereConfig } from "@/data/courses";
import { cn } from "@/lib/utils";
import { Filiere } from "@/types";

interface Props {
  params: Promise<{ filiere: string }>;
}

export async function generateStaticParams() {
  return ["tssr", "tai", "ais"].map((filiere) => ({ filiere }));
}

export default async function FilierePage({ params }: Props) {
  const { filiere } = await params;
  if (!["tssr", "tai", "ais"].includes(filiere)) notFound();

  const key = filiere as Filiere;
  const config = filiereConfig[key];
  const filiereCourses = courses.filter((c) => c.filiere === key);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero filiere */}
        <div className={cn("glass rounded-3xl p-8 mb-12 border", config.borderColor)}>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <span className="text-6xl">{config.icon}</span>
            <div>
              <div className={cn("text-xs font-bold uppercase tracking-widest mb-2", config.textColor)}>
                Filière
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{config.name}</h1>
              <p className="text-slate-400 text-lg">{config.fullName}</p>
              <p className="text-slate-500 mt-2 max-w-xl">{config.description}</p>
            </div>
            <div className="md:ml-auto">
              <div className={cn("text-center px-6 py-4 rounded-xl border", config.bgColor, config.borderColor)}>
                <div className={cn("text-3xl font-bold", config.textColor)}>{filiereCourses.length}</div>
                <div className="text-slate-500 text-sm">cours disponibles</div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses grid */}
        <h2 className="text-xl font-bold text-white mb-6">Tous les cours {config.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filiereCourses.map((course) => (
            <Link
              key={course.id}
              href={`/formations/${filiere}/${course.slug}`}
              className="glass rounded-2xl overflow-hidden glass-hover border border-white/5 group"
            >
              <div className="relative h-48">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-white font-bold mb-2 group-hover:text-purple-300 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-600 border-t border-white/5 pt-3">
                  <span>⏱ {course.duration}</span>
                  <span>📦 {course.modules} modules</span>
                  <span className={cn("font-medium", config.textColor)}>{course.level}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filiereCourses.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-slate-500">Cours en cours de rédaction… revenez bientôt !</p>
          </div>
        )}
      </div>
    </div>
  );
}
