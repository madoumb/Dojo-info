"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/lib/useProgress";
import { cn } from "@/lib/utils";

interface Module {
  title: string;
  duration: string;
}

interface Props {
  courseSlug: string;
  modules: Module[];
  colorClass: string;
}

export default function CourseProgressSidebar({ courseSlug, modules, colorClass }: Props) {
  const { user, loading: authLoading } = useAuth();
  const { progress, loading, completedCount, percentage, toggleModule, markStarted } = useProgress(courseSlug, modules.length);

  useEffect(() => {
    if (user) markStarted();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass rounded-2xl p-6 border border-purple-500/20 text-center space-y-4">
        <div className="text-4xl">🔒</div>
        <h3 className="text-white font-semibold">Suivez votre progression</h3>
        <p className="text-slate-400 text-sm">Connectez-vous pour sauvegarder votre avancement, débloquer des badges et reprendre où vous en étiez.</p>
        <div className="flex flex-col gap-2">
          <Link
            href="/auth/login"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-90 transition-all text-center"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/register"
            className="w-full py-2 rounded-xl glass border border-white/10 text-slate-300 text-sm hover:text-white hover:border-purple-500/30 transition-all text-center"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progression */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold text-sm">Votre progression</h3>
          <span className="text-purple-400 font-bold text-sm">{percentage}%</span>
        </div>
        <div className="relative h-2 bg-white/10 rounded-full mb-2 overflow-hidden">
          <div
            className={cn("absolute left-0 top-0 h-full rounded-full bg-gradient-to-r transition-all duration-500", colorClass)}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs">{completedCount}/{modules.length} modules complétés</p>
        {percentage === 100 && (
          <div className="mt-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
            <p className="text-green-400 text-sm font-semibold">🎉 Cours terminé ! Badge débloqué.</p>
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="text-white font-semibold mb-4 text-sm">Plan du cours</h3>
        <div className="space-y-2">
          {modules.map((mod, i) => {
            const modProgress = progress.find((p) => p.module_index === i);
            const isCompleted = modProgress?.completed ?? false;

            return (
              <button
                key={i}
                onClick={() => toggleModule(i)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-all text-left group",
                  isCompleted
                    ? "bg-green-500/8 border border-green-500/20 hover:border-green-500/40"
                    : "bg-white/2 border border-white/5 hover:border-purple-500/30 hover:bg-white/5"
                )}
              >
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all",
                  isCompleted ? "bg-green-500/30 text-green-400" : "bg-white/10 text-slate-500 group-hover:bg-purple-500/20 group-hover:text-purple-400"
                )}>
                  {isCompleted ? "✓" : i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium text-xs truncate transition-colors", isCompleted ? "text-slate-400 line-through" : "text-slate-300 group-hover:text-white")}>
                    {mod.title}
                  </p>
                </div>
                <span className="text-slate-600 text-xs flex-shrink-0">{mod.duration}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-slate-600 text-xs text-center">
            Cochez chaque module après l&apos;avoir terminé
          </p>
        </div>
      </div>
    </div>
  );
}
