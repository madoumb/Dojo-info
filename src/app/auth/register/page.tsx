"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="font-bold text-xl">
              <span className="gradient-text">Dojo</span>
              <span className="text-slate-300">.info</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Créer un compte 🚀</h1>
          <p className="text-slate-500 text-sm">Gratuit · Progression sauvegardée · Badges débloquables</p>
        </div>

        <form onSubmit={handleRegister} className="glass rounded-2xl p-6 border border-white/5 space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jean Dupont"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Adresse email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jean@exemple.fr"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="8 caractères minimum"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="••••••••"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all text-sm"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Création du compte…" : "Créer mon compte →"}
          </button>

          <p className="text-center text-slate-500 text-sm">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Se connecter
            </Link>
          </p>

          <p className="text-center text-slate-600 text-xs">
            En créant un compte, vous acceptez notre{" "}
            <Link href="/confidentialite" className="text-purple-500 hover:underline">politique de confidentialité</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
