import Link from "next/link";
import { filiereConfig } from "@/data/courses";
import { cn } from "@/lib/utils";

const filiereDetails = {
  tssr: { modules: ["Windows Server & AD", "Linux Debian/Ubuntu", "Réseaux TCP/IP & VLAN", "Virtualisation Proxmox/VMware", "Cloud AWS/Azure", "Supervision Zabbix"], courses: 4 },
  tai: { modules: ["Automates Siemens S7", "Réseaux industriels Modbus", "SCADA & Supervision", "Robotique industrielle", "Cybersécurité OT/ICS"], courses: 2 },
  ais: { modules: ["Pentest & OWASP Top 10", "SOC & SIEM Wazuh", "Cryptographie & PKI", "Conformité RGPD/NIS2", "DevSecOps", "Forensics & IR"], courses: 2 },
};

export default function FiliereCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          3 filières,{" "}
          <span className="gradient-text">une expertise</span>
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          Des parcours complets alignés sur les référentiels officiels Éduscol,
          mis à jour en continu selon les évolutions du secteur.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["tssr", "tai", "ais"] as const).map((key) => {
          const config = filiereConfig[key];
          const details = filiereDetails[key];
          return (
            <Link
              key={key}
              href={`/formations/${key}`}
              className={cn(
                "glass rounded-2xl p-6 glass-hover card-shine border transition-all duration-300",
                config.borderColor
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{config.icon}</span>
                <span className={cn("text-xs font-bold px-3 py-1 rounded-full", config.bgColor, config.textColor, "border", config.borderColor)}>
                  {details.courses} cours
                </span>
              </div>

              <h3 className="text-white font-bold text-xl mb-1">{config.name}</h3>
              <p className={cn("text-xs font-medium mb-3", config.textColor)}>{config.fullName}</p>
              <p className="text-slate-500 text-sm mb-5">{config.description}</p>

              <div className="space-y-2">
                {details.modules.slice(0, 4).map((mod) => (
                  <div key={mod} className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className={cn("w-1 h-1 rounded-full flex-shrink-0", key === "tssr" ? "bg-blue-400" : key === "tai" ? "bg-orange-400" : "bg-red-400")} />
                    {mod}
                  </div>
                ))}
                {details.modules.length > 4 && (
                  <p className="text-slate-600 text-xs">+{details.modules.length - 4} modules…</p>
                )}
              </div>

              <div className={cn("mt-6 flex items-center gap-2 text-sm font-medium", config.textColor)}>
                Voir les cours
                <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
