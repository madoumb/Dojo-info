import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                D
              </div>
              <span className="font-bold text-lg">
                <span className="gradient-text">Dojo</span>
                <span className="text-slate-300">.info</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">
              Plateforme de formation révolutionnaire pour étudiants en informatique
              TSSR, TAI et AIS. Cours alignés sur Éduscol.
            </p>
          </div>
          <div>
            <h4 className="text-slate-300 font-semibold mb-3 text-sm">Formations</h4>
            <div className="flex flex-col gap-2">
              {["TSSR", "TAI", "AIS"].map((f) => (
                <Link
                  key={f}
                  href={`/formations/${f.toLowerCase()}`}
                  className="text-slate-500 hover:text-purple-400 text-sm transition-colors"
                >
                  {f}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-slate-300 font-semibold mb-3 text-sm">Ressources</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Tech News", href: "/tech-news" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Éduscol", href: "https://eduscol.education.fr" },
                { label: "ANSSI", href: "https://www.ssi.gouv.fr" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-slate-500 hover:text-purple-400 text-sm transition-colors"
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © 2025 Dojo.info — Plateforme pédagogique open-source
          </p>
          <p className="text-slate-600 text-xs">
            Basé sur les référentiels{" "}
            <a href="https://eduscol.education.fr" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-400">
              Éduscol
            </a>
            {" "}BTS SIO & BUT Informatique
          </p>
        </div>
      </div>
    </footer>
  );
}
