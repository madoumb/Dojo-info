"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const subjects = [
  "Question sur un cours",
  "Bug / Erreur technique",
  "Suggestion de cours",
  "Partenariat",
  "Autre",
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", honeypot: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Nom requis";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email invalide";
    if (!form.subject) e.subject = "Sujet requis";
    if (form.message.trim().length < 20) e.message = "Message trop court (20 caractères minimum)";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-bot honeypot
    if (form.honeypot) return;

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "", honeypot: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="glass rounded-2xl p-10 border border-green-500/20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-white font-bold text-xl mb-2">Message envoyé !</h2>
        <p className="text-slate-400">Nous vous répondrons sous 24h à l&apos;adresse <span className="text-purple-400">{form.email || "indiquée"}</span>.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-purple-500/30 transition-all text-sm"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 border border-white/5 space-y-5">
      {/* Honeypot anti-bot (champ caché) */}
      <input
        type="text"
        name="website"
        value={form.honeypot}
        onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Nom / Prénom" error={errors.name} required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jean Dupont"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all text-sm"
          />
        </Field>

        <Field label="Adresse email" error={errors.email} required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jean@exemple.fr"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all text-sm"
          />
        </Field>
      </div>

      <Field label="Sujet" error={errors.subject} required>
        <select
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm appearance-none cursor-pointer"
        >
          <option value="" className="bg-gray-900">— Choisir un sujet —</option>
          {subjects.map((s) => (
            <option key={s} value={s} className="bg-gray-900">{s}</option>
          ))}
        </select>
      </Field>

      <Field label="Message" error={errors.message} required>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={6}
          placeholder="Décrivez votre demande en détail..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all text-sm resize-none"
        />
        <p className="text-slate-600 text-xs mt-1">{form.message.length} caractères</p>
      </Field>

      <p className="text-slate-600 text-xs">
        En soumettant ce formulaire, vous acceptez que vos données soient utilisées uniquement pour traiter votre demande, conformément à notre{" "}
        <a href="/confidentialite" className="text-purple-400 hover:underline">politique de confidentialité</a>.
      </p>

      {status === "error" && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Une erreur est survenue. Veuillez réessayer ou nous écrire directement.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Envoi en cours…" : "Envoyer le message →"}
      </button>
    </form>
  );
}

function Field({ label, error, required, children }: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-2">
        {label} {required && <span className="text-purple-400">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
