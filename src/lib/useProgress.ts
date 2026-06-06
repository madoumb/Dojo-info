"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export interface ModuleProgress {
  module_index: number;
  completed: boolean;
  completed_at?: string;
}

export function useProgress(courseSlug: string, totalModules: number) {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const completedCount = progress.filter((m) => m.completed).length;
  const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("course_progress")
        .select("modules")
        .eq("user_id", user.id)
        .eq("course_slug", courseSlug)
        .single();

      if (data?.modules && data.modules.length > 0) {
        setProgress(data.modules);
      } else {
        setProgress(
          Array.from({ length: totalModules }, (_, i) => ({
            module_index: i,
            completed: false,
          }))
        );
      }
      setLoading(false);
    };

    fetchProgress();
  }, [user, courseSlug, totalModules, supabase]);

  const toggleModule = useCallback(
    async (index: number) => {
      if (!user) return;

      const updated = progress.map((m) =>
        m.module_index === index
          ? {
              ...m,
              completed: !m.completed,
              completed_at: !m.completed ? new Date().toISOString() : undefined,
            }
          : m
      );
      setProgress(updated);

      await supabase.from("course_progress").upsert(
        {
          user_id: user.id,
          course_slug: courseSlug,
          modules: updated,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_slug" }
      );
    },
    [user, progress, courseSlug, supabase]
  );

  const markStarted = useCallback(async () => {
    if (!user) return;
    await supabase.from("course_progress").upsert(
      {
        user_id: user.id,
        course_slug: courseSlug,
        modules: progress.length > 0 ? progress : Array.from({ length: totalModules }, (_, i) => ({ module_index: i, completed: false })),
        started_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_slug" }
    );
  }, [user, courseSlug, progress, totalModules, supabase]);

  return { progress, loading, completedCount, percentage, toggleModule, markStarted };
}

export function useAllProgress() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [allProgress, setAllProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      const { data } = await supabase
        .from("course_progress")
        .select("course_slug, modules")
        .eq("user_id", user.id);

      if (data) {
        const map: Record<string, number> = {};
        data.forEach((row) => {
          const total = row.modules?.length || 0;
          const done = row.modules?.filter((m: ModuleProgress) => m.completed).length || 0;
          map[row.course_slug] = total > 0 ? Math.round((done / total) * 100) : 0;
        });
        setAllProgress(map);
      }
      setLoading(false);
    };

    fetchAll();
  }, [user, supabase]);

  return { allProgress, loading };
}
