import Link from "next/link";
import Image from "next/image";
import { courses, filiereConfig } from "@/data/courses";
import { cn } from "@/lib/utils";

export default function LatestCourses() {
  const latest = courses.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Cours récents
          </h2>
          <p className="text-slate-500 text-sm">Mis à jour selon les référentiels Éduscol 2025</p>
        </div>
        <Link href="/formations" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
          Voir tout →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {latest.map((course, i) => {
          const config = filiereConfig[course.filiere];
          return (
            <Link
              key={course.id}
              href={`/formations/${course.filiere}/${course.slug}`}
              className="glass rounded-2xl overflow-hidden glass-hover border border-white/5 group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className={cn("text-xs font-bold px-2 py-1 rounded-md", config.bgColor, config.textColor, "border", config.borderColor)}>
                    {config.name}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-md bg-black/50 text-slate-300 border border-white/10">
                    {course.level}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 mb-4">{course.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>⏱ {course.duration}</span>
                  <span>📦 {course.modules} modules</span>
                  <span>📅 {new Date(course.updatedAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
