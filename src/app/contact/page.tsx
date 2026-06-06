import ContactForm from "@/components/sections/ContactForm";

export const metadata = {
  title: "Contact — Dojo.info",
  description: "Contactez l'équipe Dojo.info pour toute question sur nos formations TSSR, TAI, AIS.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nous <span className="gradient-text">contacter</span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Une question sur une formation ? Un bug sur le site ? Une idée de cours ?
            On vous répond sous 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: "📚", title: "Question cours", desc: "Contenu, prérequis, exercices..." },
            { icon: "🐛", title: "Bug / Erreur", desc: "Signaler un problème technique" },
            { icon: "💡", title: "Suggestion", desc: "Proposer un nouveau cours ou thème" },
          ].map((item) => (
            <div key={item.title} className="glass rounded-xl p-4 border border-white/5 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
              <div className="text-slate-500 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
