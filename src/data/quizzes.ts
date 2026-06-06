export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number; // index de la bonne réponse
  explanation: string;
}

export interface Quiz {
  courseSlug: string;
  title: string;
  passingScore: number; // % minimum pour valider
  questions: QuizQuestion[];
}

export const quizzes: Record<string, Quiz> = {
  "administration-windows-server": {
    courseSlug: "administration-windows-server",
    title: "QCM — Windows Server 2022",
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "Quel est l'ordre d'application des GPO (du moins prioritaire au plus prioritaire) ?",
        options: ["OU → Domaine → Site → Local", "Local → Site → Domaine → OU", "Domaine → OU → Site → Local", "Site → Local → OU → Domaine"],
        correct: 1,
        explanation: "L'ordre LSDOU (Local, Site, Domaine, OU) détermine l'application des GPO. La dernière appliquée (OU) est la plus prioritaire.",
      },
      {
        id: 2,
        question: "Quelle commande PowerShell permet de promouvoir un serveur en contrôleur de domaine ?",
        options: ["New-ADDomain", "Install-ADDSForest", "Add-ADDomainController", "Set-ADDomain"],
        correct: 1,
        explanation: "Install-ADDSForest crée une nouvelle forêt AD et promeut le serveur en DC. Install-ADDSDomainController est utilisé pour ajouter un DC supplémentaire.",
      },
      {
        id: 3,
        question: "Que signifie l'ID d'événement 4625 dans le journal de Sécurité ?",
        options: ["Connexion réussie", "Compte créé", "Échec de connexion", "Compte verrouillé"],
        correct: 2,
        explanation: "L'événement 4625 indique un échec de connexion. Une accumulation de cet événement depuis la même IP indique une attaque par brute-force.",
      },
      {
        id: 4,
        question: "Quelle est la bonne pratique pour les permissions de partage de fichiers ?",
        options: [
          "Gérer finement les droits au niveau du partage",
          "Donner Contrôle total au partage et gérer via NTFS",
          "Utiliser uniquement les permissions NTFS sans partage",
          "Donner les mêmes droits au partage et en NTFS",
        ],
        correct: 1,
        explanation: "La bonne pratique est de donner Contrôle total au niveau du partage et de gérer finement les droits via NTFS. La permission effective est la plus restrictive des deux.",
      },
      {
        id: 5,
        question: "Quel enregistrement DNS permet de localiser les services Active Directory (LDAP, Kerberos) ?",
        options: ["A", "MX", "SRV", "CNAME"],
        correct: 2,
        explanation: "Les enregistrements SRV (Service Record) permettent aux clients de localiser les services comme LDAP (_ldap._tcp) et Kerberos (_kerberos._tcp) dans le DNS.",
      },
      {
        id: 6,
        question: "Quelle fonctionnalité AD génère automatiquement des mots de passe uniques pour les comptes administrateurs locaux ?",
        options: ["Fine-Grained Password Policy", "Protected Users", "LAPS", "Credential Guard"],
        correct: 2,
        explanation: "LAPS (Local Administrator Password Solution) génère des mots de passe aléatoires et uniques pour le compte administrateur local de chaque machine et les stocke dans l'AD.",
      },
      {
        id: 7,
        question: "Combien de machines virtuelles sont incluses dans la licence Windows Server 2022 Standard ?",
        options: ["0", "2", "4", "Illimitées"],
        correct: 1,
        explanation: "La licence Windows Server 2022 Standard inclut 2 VM Hyper-V. L'édition Datacenter permet un nombre illimité de VM.",
      },
      {
        id: 8,
        question: "Quelle est la règle de sauvegarde recommandée en entreprise ?",
        options: ["1-1-1", "2-1-0", "3-2-1", "3-3-3"],
        correct: 2,
        explanation: "La règle 3-2-1 : 3 copies des données, sur 2 supports différents, dont 1 hors-site. Cette stratégie protège contre la plupart des sinistres.",
      },
      {
        id: 9,
        question: "Que fait la commande 'Invoke-GPUpdate -Force' ?",
        options: [
          "Crée une nouvelle GPO",
          "Supprime les GPO en cache",
          "Force l'application immédiate des GPO sans attendre le délai",
          "Exporte les GPO en XML",
        ],
        correct: 2,
        explanation: "Invoke-GPUpdate force la mise à jour immédiate des stratégies de groupe sur un ordinateur, sans attendre le délai standard de 90 minutes.",
      },
      {
        id: 10,
        question: "Quelle étendue de groupe AD permet d'avoir des membres de n'importe quel domaine de la forêt ?",
        options: ["Local de domaine", "Global", "Universel", "Local d'ordinateur"],
        correct: 2,
        explanation: "Les groupes Universels peuvent contenir des membres de n'importe quel domaine de la forêt et être utilisés pour des ressources dans toute la forêt. Attention : leur contenu est répliqué dans le catalogue global.",
      },
    ],
  },

  "linux-debian-admin": {
    courseSlug: "linux-debian-admin",
    title: "QCM — Linux Debian/Ubuntu",
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "Quelle commande affiche les ports en écoute sur un système Linux (remplace netstat) ?",
        options: ["netstat -tlnp", "ss -tlnp", "ifconfig -a", "ip addr show"],
        correct: 1,
        explanation: "ss (socket statistics) est le remplaçant moderne de netstat. L'option -tlnp affiche les ports TCP en écoute avec les processus associés.",
      },
      {
        id: 2,
        question: "Que signifie la permission 750 en notation octal ?",
        options: ["rwxrwxrwx", "rwxr-xr-x", "rwxr-x---", "rwx------"],
        correct: 2,
        explanation: "750 = 7(rwx) pour le propriétaire + 5(r-x) pour le groupe + 0(---) pour les autres. Seul le propriétaire peut lire/écrire/exécuter, le groupe peut lire/exécuter.",
      },
      {
        id: 3,
        question: "Quelle directive dans sshd_config interdit la connexion directe en root ?",
        options: ["DenyRoot yes", "PermitRootLogin no", "RootAccess disabled", "DisableRoot yes"],
        correct: 1,
        explanation: "PermitRootLogin no dans /etc/ssh/sshd_config empêche toute connexion SSH directe avec le compte root. C'est une mesure de sécurité essentielle.",
      },
      {
        id: 4,
        question: "Quel gestionnaire de paquets est utilisé sur Debian/Ubuntu ?",
        options: ["yum", "dnf", "apt", "pacman"],
        correct: 2,
        explanation: "apt (Advanced Package Tool) est le gestionnaire de paquets de Debian et ses dérivés (Ubuntu, Mint...). yum/dnf sont utilisés sur Red Hat/CentOS/Fedora.",
      },
      {
        id: 5,
        question: "Quelle commande crée une entrée cron s'exécutant tous les jours à 3h30 ?",
        options: ["30 3 * * * /script.sh", "3 30 * * * /script.sh", "* * 3 30 * /script.sh", "0 3 30 * * /script.sh"],
        correct: 0,
        explanation: "Format cron : minute heure jour_du_mois mois jour_semaine. '30 3 * * *' = à la minute 30 de l'heure 3, tous les jours.",
      },
      {
        id: 6,
        question: "Quel répertoire contient les fichiers de configuration sous Linux ?",
        options: ["/var", "/usr", "/etc", "/home"],
        correct: 2,
        explanation: "/etc contient tous les fichiers de configuration du système. /var pour les données variables, /usr pour les programmes, /home pour les utilisateurs.",
      },
      {
        id: 7,
        question: "Quelle commande systemd vérifie le statut d'un service et affiche les derniers logs ?",
        options: ["service status nginx", "systemctl status nginx", "journalctl nginx", "ps -ef | grep nginx"],
        correct: 1,
        explanation: "systemctl status nginx affiche l'état du service, son PID, la date de démarrage et les dernières lignes du journal. C'est la commande de diagnostic de premier niveau.",
      },
      {
        id: 8,
        question: "Que fait la commande 'set -euo pipefail' au début d'un script Bash ?",
        options: [
          "Active le mode verbeux",
          "Arrête le script sur erreur, variable non définie ou pipe échoué",
          "Désactive les messages d'erreur",
          "Active la compatibilité POSIX",
        ],
        correct: 1,
        explanation: "-e arrête sur erreur, -u arrête si variable non définie, -o pipefail arrête si un élément d'un pipe échoue. Indispensable pour des scripts robustes.",
      },
      {
        id: 9,
        question: "Quelle clé de chiffrement est recommandée pour SSH en 2024 ?",
        options: ["RSA 1024 bits", "DSA 1024 bits", "Ed25519", "ECDSA P-256"],
        correct: 2,
        explanation: "Ed25519 est l'algorithme recommandé : clés courtes (256 bits), très rapide, résistant aux attaques par canal auxiliaire. RSA reste acceptable à 4096 bits.",
      },
      {
        id: 10,
        question: "Quel outil permet de bloquer automatiquement les IPs après des échecs de connexion SSH ?",
        options: ["iptables", "ufw", "fail2ban", "firewalld"],
        correct: 2,
        explanation: "fail2ban analyse les logs et ajoute des règles iptables temporaires pour bannir les IPs qui génèrent trop d'échecs. Il protège contre le brute-force SSH.",
      },
    ],
  },

  "securite-offensive-pentest": {
    courseSlug: "securite-offensive-pentest",
    title: "QCM — Sécurité Offensive & Pentest",
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "Avant tout test d'intrusion, quel document est OBLIGATOIRE ?",
        options: ["Un rapport de vulnérabilité", "Un mandat d'autorisation signé", "Une liste des cibles", "Un contrat de confidentialité"],
        correct: 1,
        explanation: "Sans mandat écrit signé par le propriétaire du système, toute intrusion est illégale (art. 323-1 du Code pénal). C'est la règle absolue du pentester.",
      },
      {
        id: 2,
        question: "Que détecte une apostrophe (') ajoutée dans un champ de formulaire ?",
        options: ["XSS réfléchi", "Injection SQL potentielle", "CSRF", "Traversée de répertoire"],
        correct: 1,
        explanation: "Une apostrophe dans un paramètre peut casser une requête SQL mal construite. Si une erreur SQL apparaît, le paramètre est potentiellement injectable.",
      },
      {
        id: 3,
        question: "Quelle vulnérabilité permet de voler des cookies de session via JavaScript injecté ?",
        options: ["SQLi", "CSRF", "XSS stocké", "XXE"],
        correct: 2,
        explanation: "Le XSS stocké injecte du JavaScript malveillant persistant en base de données. Chaque visiteur exécute le script qui peut exfiltrer document.cookie.",
      },
      {
        id: 4,
        question: "Quel est le score CVSS considéré comme Critique ?",
        options: ["≥ 7.0", "≥ 8.0", "≥ 9.0", "= 10.0"],
        correct: 2,
        explanation: "CVSS v3 : 0-3.9 = Faible, 4.0-6.9 = Moyen, 7.0-8.9 = Élevé, 9.0-10.0 = Critique. Un score ≥ 9.0 requiert une remédiation immédiate.",
      },
      {
        id: 5,
        question: "Quelle commande Nmap effectue une détection de version des services (-sV) sur tous les ports ?",
        options: ["nmap -p 80,443 -sV cible", "nmap -sV -p- cible", "nmap --all-ports cible", "nmap -A cible"],
        correct: 1,
        explanation: "nmap -sV -p- cible scanne tous les 65535 ports (-p-) et tente de détecter la version de chaque service ouvert (-sV).",
      },
      {
        id: 6,
        question: "Qu'est-ce que le CSRF ?",
        options: [
          "Injection de code dans une base de données",
          "Forcer un utilisateur authentifié à effectuer une action à son insu",
          "Vol de session via JavaScript",
          "Exploitation d'une faille dans le serveur web",
        ],
        correct: 1,
        explanation: "CSRF (Cross-Site Request Forgery) exploite la confiance du serveur envers le navigateur d'un utilisateur authentifié pour lui faire effectuer des actions non désirées.",
      },
      {
        id: 7,
        question: "Quel outil est indispensable pour intercepter et modifier les requêtes HTTP en pentest web ?",
        options: ["Wireshark", "Metasploit", "Burp Suite", "Nmap"],
        correct: 2,
        explanation: "Burp Suite est le proxy d'interception HTTP de référence pour le pentest web. Il permet d'analyser, modifier et rejouer les requêtes entre le navigateur et le serveur.",
      },
      {
        id: 8,
        question: "Quelle phase du pentest consiste à maintenir l'accès et se déplacer latéralement ?",
        options: ["Reconnaissance", "Exploitation", "Post-exploitation", "Rapport"],
        correct: 2,
        explanation: "La post-exploitation comprend l'élévation de privilèges, le mouvement latéral, la persistance et l'exfiltration de données après avoir obtenu un accès initial.",
      },
      {
        id: 9,
        question: "Comment prévenir les injections SQL ?",
        options: [
          "Encoder les données en base64",
          "Utiliser des requêtes préparées (PreparedStatement)",
          "Limiter la taille des champs formulaire",
          "Utiliser HTTPS",
        ],
        correct: 1,
        explanation: "Les requêtes préparées (ou paramétrées) séparent le code SQL des données. Même si un attaquant injecte du SQL, il sera traité comme une donnée et non exécuté.",
      },
      {
        id: 10,
        question: "Quelle section d'un rapport de pentest est destinée à la direction (non technique) ?",
        options: ["Résumé technique", "Résumé exécutif", "Annexes", "Liste des vulnérabilités"],
        correct: 1,
        explanation: "Le résumé exécutif (2 pages max, sans jargon) présente le niveau de sécurité global et les priorités à la direction. Le résumé technique est destiné aux équipes IT.",
      },
    ],
  },

  "soc-siem-blue-team": {
    courseSlug: "soc-siem-blue-team",
    title: "QCM — SOC, SIEM & Blue Team",
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "Quel est le rôle principal d'un analyste SOC N1 ?",
        options: [
          "Développer des règles de détection avancées",
          "Reverser des malwares",
          "Surveiller les alertes et qualifier les incidents",
          "Gérer les pare-feu",
        ],
        correct: 2,
        explanation: "L'analyste N1 assure la surveillance 24/7, trie les alertes (faux positifs vs vrais incidents) et escalade vers N2 si nécessaire.",
      },
      {
        id: 2,
        question: "Que signifie l'événement Windows ID 4625 ?",
        options: ["Connexion réussie", "Échec de connexion", "Service démarré", "Compte créé"],
        correct: 1,
        explanation: "L'ID 4625 indique un échec d'ouverture de session. De nombreux 4625 depuis la même IP = tentative de brute-force à investiguer.",
      },
      {
        id: 3,
        question: "Quel framework classe les techniques d'attaque utilisées par les groupes APT ?",
        options: ["OWASP Top 10", "MITRE ATT&CK", "ISO 27001", "NIST CSF"],
        correct: 1,
        explanation: "MITRE ATT&CK est une base de connaissances mondiale des tactiques et techniques d'attaque, organisée par phases (Reconnaissance, Initial Access, Persistence...).",
      },
      {
        id: 4,
        question: "Où se trouvent les logs d'authentification SSH sur Debian/Ubuntu ?",
        options: ["/var/log/ssh.log", "/var/log/auth.log", "/var/log/syslog", "/etc/ssh/logs"],
        correct: 1,
        explanation: "/var/log/auth.log contient tous les événements d'authentification : connexions SSH, sudo, PAM. C'est le fichier de référence pour l'analyse des connexions.",
      },
      {
        id: 5,
        question: "Qu'est-ce que la FIM dans le contexte d'un SIEM ?",
        options: [
          "File Intrusion Monitoring",
          "File Integrity Monitoring",
          "Firewall Integrated Module",
          "Forensic Investigation Method",
        ],
        correct: 1,
        explanation: "File Integrity Monitoring surveille les modifications des fichiers critiques (binaires système, configs). Wazuh inclut cette fonctionnalité nativement.",
      },
      {
        id: 6,
        question: "Quelle commande Linux recherche les connexions SSH réussies dans les logs ?",
        options: [
          "grep 'Failed' /var/log/auth.log",
          "grep 'Accepted' /var/log/auth.log",
          "tail -f /var/log/ssh.log",
          "journalctl -u ssh",
        ],
        correct: 1,
        explanation: "grep 'Accepted' /var/log/auth.log filtre les connexions SSH réussies. Toute connexion depuis une IP inconnue mérite investigation.",
      },
      {
        id: 7,
        question: "Wazuh est basé sur quel SIEM open-source historique ?",
        options: ["Splunk", "OSSEC", "Elastic SIEM", "AlienVault"],
        correct: 1,
        explanation: "Wazuh est un fork et une amélioration d'OSSEC (Open Source Security). Il ajoute une interface moderne (OpenSearch/Kibana), la conformité réglementaire et le cloud.",
      },
      {
        id: 8,
        question: "Quelle est la première action lors de la réponse à un incident de sécurité ?",
        options: ["Supprimer le malware", "Isoler le système compromis du réseau", "Notifier la direction", "Reformater le disque"],
        correct: 1,
        explanation: "L'isolation réseau est la priorité absolue pour stopper la propagation. On préserve ensuite les preuves (logs, mémoire RAM) avant toute modification du système.",
      },
      {
        id: 9,
        question: "Que signifie l'événement Windows ID 4698 ?",
        options: ["Service installé", "Tâche planifiée créée", "Connexion réseau établie", "Registre modifié"],
        correct: 1,
        explanation: "ID 4698 = création d'une tâche planifiée. C'est une technique de persistance courante des malwares. Toute tâche planifiée inconnue est suspecte.",
      },
      {
        id: 10,
        question: "Quelle norme internationale régit la cybersécurité des systèmes de contrôle industriels ?",
        options: ["ISO 27001", "RGPD", "IEC 62443", "PCI-DSS"],
        correct: 2,
        explanation: "IEC 62443 est la norme internationale de cybersécurité pour les systèmes d'automatisation et de contrôle industriels (IACS). Elle est recommandée par l'ANSSI.",
      },
    ],
  },
};
