export const metadata = {
  title: "Politique de confidentialité — Dojo.info",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2">Politique de confidentialité</h1>
        <p className="text-slate-500 text-sm mb-10">Dernière mise à jour : juin 2025</p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          <Section title="1. Responsable du traitement">
            <p>Le site Dojo.info est édité et exploité à titre personnel. Pour toute question relative à vos données personnelles, contactez-nous via le <a href="/contact" className="text-purple-400 hover:underline">formulaire de contact</a>.</p>
          </Section>

          <Section title="2. Données collectées">
            <p>Nous collectons uniquement les données que vous nous fournissez volontairement :</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li>Via le formulaire de contact : nom, adresse email, message</li>
              <li>Données de navigation anonymes (cookies analytiques, avec votre consentement)</li>
            </ul>
            <p className="mt-3">Nous ne collectons pas de données sensibles. Nous ne vendons jamais vos données à des tiers.</p>
          </Section>

          <Section title="3. Finalités du traitement">
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Répondre à vos messages via le formulaire de contact</li>
              <li>Améliorer le contenu pédagogique du site (statistiques anonymes)</li>
              <li>Mémoriser vos préférences (consentement cookies)</li>
            </ul>
          </Section>

          <Section title="4. Base légale">
            <p>Le traitement est basé sur votre consentement explicite (formulaire de contact, cookies) et notre intérêt légitime à améliorer le site.</p>
          </Section>

          <Section title="5. Durée de conservation">
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Messages de contact : 1 an maximum</li>
              <li>Données analytiques : 13 mois</li>
              <li>Consentement cookies : 6 mois</li>
            </ul>
          </Section>

          <Section title="6. Vos droits (RGPD)">
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679), vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
              <li><strong className="text-slate-300">Droit de rectification</strong> : corriger des données inexactes</li>
              <li><strong className="text-slate-300">Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
              <li><strong className="text-slate-300">Droit à la portabilité</strong> : recevoir vos données dans un format lisible</li>
              <li><strong className="text-slate-300">Droit d&apos;opposition</strong> : vous opposer à certains traitements</li>
            </ul>
            <p className="mt-3">Pour exercer ces droits, contactez-nous via le <a href="/contact" className="text-purple-400 hover:underline">formulaire de contact</a>. Vous pouvez également introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">CNIL</a>.</p>
          </Section>

          <Section title="7. Cookies">
            <p>Nous utilisons des cookies pour mémoriser vos préférences. Aucun cookie de tracking publicitaire n&apos;est utilisé. Vous pouvez gérer vos préférences à tout moment via le bandeau de consentement en bas de page.</p>
          </Section>

          <Section title="8. Sécurité">
            <p>Les données transmises via le formulaire de contact sont chiffrées en transit (HTTPS/TLS). Elles sont stockées de manière sécurisée et accessibles uniquement par l&apos;administrateur du site.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-5 border border-white/5">
      <h2 className="text-white font-semibold mb-3">{title}</h2>
      <div className="text-slate-400">{children}</div>
    </div>
  );
}
