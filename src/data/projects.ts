export interface ProjectSection {
  type: "intro" | "challenge" | "process" | "result";
  title: string;
  content: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  date: string; // Format: "YYYY-MM" pour le tri
  color: string;
  description: string;
  longDescription: string;
  tags: string[]; // Tags affichés publiquement
  skills: string[]; // IDs de skills pour le mapping avec le réseau neuronal
  role: string;
  client: string;
  link: string;
  image: string;
  logo?: string; // Path to project logo/icon for timeline
  ogImage?: string;
  sections: ProjectSection[];
}

const allProjects: Project[] = [
  {
    id: "genjutsu",
    title: "GENJUTSU",
    category: "CLAUDE PLUGIN",
    year: "2026",
    date: "2026-05",
    color: "#b11523",
    description: "Plugin Claude Code de creative coding. Il fait bouger une interface, donne une identité à un produit, et monte un site entier avec une équipe d'agents.",
    longDescription: `Genjutsu, l'art de l'illusion. Trois pipelines, selon l'échelle du travail : cast fait bouger une interface, paint donne à un produit son identité visuelle et son design system, bunshin construit un site entier avec une équipe d'agents sous un seul directeur artistique.

17 modules internes couvrent le Web (React, Vue, Svelte, Astro, CSS natif, Three.js, Canvas), Android (Compose, Compose Multiplatform) et Apple (SwiftUI iOS et macOS). Genjutsu nomme le slop au lieu de le promettre : un catalogue des réflexes d'un LLM, un audit qui les relève avec leur file:line, et une correction avant le rapport.

Plus de 2 000 clones uniques toutes les deux semaines, via npx, le marketplace Claude Code et claude.ai. Les exemples sont de vrais runs enregistrés, publiés avec leurs conversations, leur code et des démos en ligne. Le site, construit avec genjutsu, s'ouvre sur un 幻 dont la loupe révèle le code de l'encre.`,
    tags: ["CLAUDE CODE", "AGENT SKILLS", "MULTI-AGENT", "CREATIVE CODING", "ASTRO"],
    skills: ["claude", "canvas", "motion", "gsap", "threejs", "swift", "shell", "github"],
    role: "CRÉATEUR & DÉVELOPPEUR",
    client: "OPEN SOURCE",
    link: "https://genjutsu.athevon.dev",
    image: "/images/projects/genjutsu-medium.png",
    logo: "/images/logos/genjutsu.png",
    sections: [
      {
        type: "intro",
        title: "L'IDÉE",
        content: "Pousser Claude au-delà du code fonctionnel, sans retomber dans les réflexes génériques d'un LLM. Une thèse d'interaction validée avant la première ligne, et rien à l'écran qu'elle ne justifie.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Trois plateformes, trois échelles et des centaines d'API qui bougent. Le scan détecte le stack et ne charge que les modules utiles, le même bundle tourne sur Claude Code, claude.ai, Cowork et npx, et chaque affirmation de version est vérifiée contre sa source.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "cast pour une interaction, paint pour un univers complet, bunshin pour un site entier : recherche en parallèle, une page par agent sur des fichiers disjoints, captures et tests scriptés, revues indépendantes et un regard neuf, jusqu'à une règle d'arrêt. Le module tells nomme le slop, l'audit le mesure.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "v4.1.1, open source sous licence MIT, installé en une commande. 3 pipelines, 17 modules, une suite d'évals avec et sans genjutsu, et des exemples réels publiés avec leurs conversations, leur code et leurs démos.",
      },
    ],
  },
  {
    id: "worktigre",
    title: "WORKTIGRE",
    category: "CLI TOOL",
    year: "2026",
    date: "2026-01",
    color: "#EE982B",
    description: "Git worktree manager interactif avec intégration GitHub CLI, fzf et Claude AI.",
    longDescription: `WorkTigre simplifie radicalement la gestion des branches Git via les worktrees. Un seul outil pour naviguer, créer, supprimer et switcher entre tes worktrees.

Intégration GitHub CLI pour les PRs et issues, fzf pour la navigation fuzzy, et Claude AI pour l'assistance intelligente. Fix CI, review PRs, résolution de problèmes - le tout depuis le terminal.`,
    tags: ["SHELL", "CLI", "GIT", "FZF", "CLAUDE AI"],
    skills: ["shell", "git", "github", "nix"],
    role: "CRÉATEUR & DÉVELOPPEUR",
    client: "OPEN SOURCE",
    link: "https://worktigre.athevon.dev",
    image: "/images/projects/wt-tiger-medium.png",
    logo: "/images/logos/worktigre.png",
    sections: [
      {
        type: "intro",
        title: "L'IDÉE",
        content: "Rendre la gestion des worktrees Git aussi simple que de changer de branche. Un CLI puissant mais intuitif.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Créer une expérience utilisateur fluide en terminal. Intégrer plusieurs outils (git, gh, fzf, claude) de manière cohérente.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "100% Shell/Bash pour la portabilité. Navigation fuzzy avec fzf. Intégration native GitHub CLI. Assistant Claude pour les tâches complexes.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Un outil open source distribué via Homebrew, Nix et script universel. Utilisé au quotidien pour gérer des dizaines de worktrees.",
      },
    ],
  },
  {
    id: "tokeneater",
    title: "TOKENEATER",
    category: "MACOS APP",
    year: "2026",
    date: "2026-02",
    color: "#FFAF40",
    description: "App native macOS pour surveiller ta consommation Claude AI en temps réel.",
    longDescription: `TokenEater vit dans ta menu bar et surveille ton utilisation de Claude AI. Pourcentages live, seuils colorés, widgets natifs WidgetKit, et un overlay flottant qui montre tes sessions Claude Code actives.

Smart pacing pour savoir si tu brûles tes tokens ou si tu cruises. Clic sur une session dans l'overlay pour sauter directement au bon terminal.`,
    tags: ["SWIFT", "SWIFTUI", "WIDGETKIT", "MACOS"],
    skills: ["swift"],
    role: "CRÉATEUR & DÉVELOPPEUR",
    client: "OPEN SOURCE",
    link: "https://tokeneater.athevon.dev",
    image: "/images/projects/tokeneater-medium.png",
    logo: "/images/logos/tokeneater.png",
    sections: [
      {
        type: "intro",
        title: "LE BESOIN",
        content: "Savoir en temps réel combien de tokens il me reste sur Claude. Sans ouvrir le navigateur, sans interrompre le flow.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Créer une app macOS native performante avec menu bar, widgets WidgetKit, et un overlay flottant. Le tout en Swift pur.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "SwiftUI pour l'UI, WidgetKit pour les widgets desktop, scraping intelligent de l'API Claude. Distribution via DMG et Homebrew.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Une app que j'utilise toute la journée. Menu bar discrète, widgets sur le bureau, overlay qui me montre mes sessions actives.",
      },
    ],
  },
  {
    id: "pix2paint",
    title: "PIX2PAINT",
    category: "IMAGE PROCESSING",
    year: "2026",
    date: "2026-03",
    color: "#6C5CE7",
    description: "Transforme n'importe quelle image en grille paint-by-numbers. 100% navigateur.",
    longDescription: `Drop ton image, ajuste les paramètres, récupère une grille numérotée prête à peindre. Deux modes : pixel classique et smooth avec contours organiques.

Quantification de couleurs (max 20), numérotation par région, export PNG. Tout le traitement tourne dans un Web Worker, zéro lag UI. Persistence IndexedDB pour reprendre où tu en étais.`,
    tags: ["VITE", "CANVAS", "WEB WORKERS", "TYPESCRIPT"],
    skills: ["typescript", "vite", "canvas"],
    role: "CRÉATEUR & DÉVELOPPEUR",
    client: "OPEN SOURCE",
    link: "https://pix2paint.athevon.dev",
    image: "/images/projects/pix2paint-medium.png",
    logo: "/images/logos/pix2paint.png",
    sections: [
      {
        type: "intro",
        title: "L'IDÉE",
        content: "Transformer une photo en grille paint-by-numbers en quelques clics. Gratuit, sans compte, 100% dans le navigateur.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Traitement d'image lourd côté client sans bloquer l'UI. Quantification de couleurs précise et contours organiques.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "Vite + TypeScript vanilla, zéro framework. Web Worker pour le processing, Canvas 2D pour le rendu, IndexedDB pour la persistence.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Un outil fluide qui transforme n'importe quelle image en grille prête à peindre. Export PNG haute résolution.",
      },
    ],
  },
  {
    id: "yeetbg",
    title: "YEETBG",
    category: "IMAGE PROCESSING",
    year: "2026",
    date: "2026-03",
    color: "#E8E8E8",
    description: "Background removal par IA + éditeur de couleurs interactif. Zéro serveur.",
    longDescription: `Drop une image, l'IA retire le fond, tu recolores ce que tu veux. Segmentation ONNX dans un Web Worker pour zéro lag. Clustering K-means++ en espace Lab pour regrouper les couleurs similaires.

Éditeur interactif : clique sur le canvas ou la palette pour supprimer des couleurs. Recolore individuellement. Export PNG, JPG ou WebP. Undo/redo complet.`,
    tags: ["VITE", "CANVAS", "AI/ONNX", "WEB WORKERS"],
    skills: ["typescript", "vite", "canvas"],
    role: "CRÉATEUR & DÉVELOPPEUR",
    client: "OPEN SOURCE",
    link: "https://yeetbg.athevon.dev",
    image: "/images/projects/yeetbg-medium.png",
    logo: "/images/logos/yeetbg.svg",
    sections: [
      {
        type: "intro",
        title: "L'IDÉE",
        content: "Supprimer le fond d'une image et recolorer les zones restantes. Le tout dans le navigateur, sans upload.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Faire tourner un modèle IA (ONNX) côté client sans exploser les perfs. Clustering de couleurs précis en espace Lab.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "Vite + TypeScript vanilla. @imgly/background-removal dans un Web Worker. K-means++ pour le clustering. Design brutaliste noir/blanc.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Un outil rapide et privacy-first. Drop, remove, recolor, export. Rien ne quitte ton navigateur.",
      },
    ],
  },
  {
    id: "nixdash",
    title: "NIXDASH",
    category: "CLI / TUI",
    year: "2026",
    date: "2026-03",
    color: "#8055E3",
    description: "Interface terminal interactive pour gérer tes packages Nix.",
    longDescription: `NixDash donne une interface humaine à Nix. Browse tes packages installés, recherche fuzzy dans 177k+ nixpkgs, installe ou supprime avec preview de diff.

Shells temporaires pour tester un package avant de l'installer. Gestion de flakes externes. Raccourcis clavier pour tout. Compatible Home Manager, NixOS et tout setup Nix flake.`,
    tags: ["SHELL", "NIX", "TUI", "FZF"],
    skills: ["shell", "nix"],
    role: "CRÉATEUR & DÉVELOPPEUR",
    client: "OPEN SOURCE",
    link: "https://nixdash.athevon.dev",
    image: "/images/projects/nixdash-medium.png",
    logo: "/images/logos/nixdash.png",
    sections: [
      {
        type: "intro",
        title: "L'IDÉE",
        content: "Rendre Nix accessible. Un TUI interactif qui remplace les commandes cryptiques par une expérience fluide.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Parser l'écosystème Nix (177k+ packages) et offrir une recherche fuzzy rapide. Gérer les différents setups (Home Manager, NixOS).",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "100% Shell avec fzf, gum et jq. Nix flake pour la distribution. Preview de diff avant chaque changement.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Un hub interactif pour Nix. Browse, search, install, shell temporaire - tout en quelques touches.",
      },
    ],
  },
  {
    id: "envora",
    title: "ENVORA",
    category: "SECURITY TOOL",
    year: "2026",
    date: "2026-04",
    color: "#10B981",
    description: "Vault chiffré pour tes .env. Push/pull entre machines, chiffrement age.",
    longDescription: `Tes .env contiennent des secrets qui ne peuvent pas aller dans git. Mais ils doivent exister sur chaque machine. Envora les stocke dans un repo git privé, chiffrés avec age.

Une clé age, stockée dans ton password manager, déverrouille tout le vault. Push chiffre et stocke, pull déchiffre et restaure. Même si le repo est compromis, tes secrets restent safe.`,
    tags: ["SHELL", "AGE", "GIT", "NIX"],
    skills: ["shell", "git", "nix"],
    role: "CRÉATEUR & DÉVELOPPEUR",
    client: "OPEN SOURCE",
    link: "https://github.com/AThevon/envora",
    image: "/images/projects/envora-medium.png",
    logo: "/images/logos/envora.svg",
    sections: [
      {
        type: "intro",
        title: "LE PROBLÈME",
        content: "Les .env ne vont pas dans git. Mais tu bosses sur 3 machines. Envora résout ce dilemme avec du chiffrement.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Chiffrement transparent, zéro friction. Une seule clé pour tout débloquer. Cross-platform (macOS, Linux, WSL).",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "Shell + age encryption + git comme transport. Nix flake pour la distribution. Interface fzf/gum pour la sélection.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "ev push, ev pull. Deux commandes. Tous tes secrets synchronisés et chiffrés.",
      },
    ],
  },
  {
    id: "linekut",
    title: "LINEKUT",
    category: "CREATIVE TOOL",
    year: "2025",
    date: "2025-12",
    color: "#EE8A4E",
    description: "Transforme une image en gabarit découpable d'un seul tenant, pour la scie à chantourner, le laser et le vinyle.",
    longDescription: `LineKut transforme une photo, un dessin ou un prénom en gabarit prêt à découper.
Il repère les pièces qui tomberaient à la découpe, les relie par des ponts,
vérifie que tout tient d'un seul tenant, puis imprime le gabarit à sa taille réelle sur des feuilles A4.

Pensé pour un artisan chantourneur, l'outil tourne entièrement dans le navigateur :
l'image ne quitte jamais l'appareil. Gratuit, sans compte.`,
    tags: ["NEXT.JS", "WEB WORKER", "IMAGE PROCESSING", "SVG"],
    skills: ["nextjs", "react", "typescript", "tailwind", "canvas", "git", "vercel", "figma"],
    role: "DESIGN & DÉVELOPPEMENT",
    client: "PROJET PERSONNEL",
    link: "https://linekut.athevon.dev",
    image: "/images/projects/linekut-medium.png",
    logo: "/images/logos/linekut.webp",
    sections: [
      {
        type: "intro",
        title: "L'IDÉE",
        content: "Un gabarit de chantournage doit tenir d'un seul tenant : chaque pièce qui flotte tombe sous la lame. LineKut montre ce qui tomberait, le relie et le prouve, en centimètres et en millimètres plutôt qu'en pixels.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Poser des ponts propres sur des images complexes : pas de miettes accrochées à des tiges, pas de pont en travers d'un œil, et une connexité garantie. Le tout en direct, sans bloquer l'interface.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "Moteur en TypeScript sur tableaux typés, dans un Web Worker : seuil adaptatif par image intégrale, composantes 4-connexes, arbre de ponts construit depuis le corps du motif, vectorisation en marching squares. Titres découpés au pochoir par le moteur lui-même, thème clair et sombre.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Export PNG 300 DPI à la taille réelle, SVG en millimètres pour LightBurn, Inkscape ou Cricut, et impression sur feuilles A4 avec repères de raccord et carré de contrôle de 5 cm.",
      },
    ],
  },
  {
    id: "under-the-flow",
    title: "UNDER THE FLOW",
    category: "WEB PLATFORM",
    year: "2025",
    date: "2025-03",
    color: "#2BBADC",
    description: "Plateforme de sessions live hip-hop avec une expérience immersive pour les artistes et les fans.",
    longDescription: `Under The Flow est une plateforme dédiée aux sessions live de hip-hop.
Le projet capture l'essence du freestyle et des performances live, offrant une vitrine
unique pour les artistes émergents de la scène hip-hop française.

Une expérience web immersive qui met en avant la musique et les artistes
avec une direction artistique forte et moderne.`,
    tags: ["NEXT.JS", "TAILWIND", "MOTION", "SUPABASE"],
    skills: ["nextjs", "react", "typescript", "tailwind", "motion", "postgresql", "drizzle", "vercel", "git", "figma"],
    role: "DÉVELOPPEUR FULL-STACK",
    client: "UNDER THE FLOW",
    link: "https://undertheflow.com",
    image: "/images/projects/under-the-flow-medium.png",
    logo: "/images/logos/under-the-flow.png",
    sections: [
      {
        type: "intro",
        title: "LA VISION",
        content: "Créer une plateforme qui capture l'énergie brute des sessions live hip-hop. Un espace où la musique prend vie à travers le digital.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Transmettre l'authenticité et l'énergie du live à travers une interface web. Créer une expérience immersive sans sacrifier la performance.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "Next.js pour la performance et le SEO. Design sombre et contrasté pour mettre en valeur le contenu vidéo. Animations fluides pour renforcer l'immersion.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Une plateforme qui met en lumière la scène hip-hop live française avec une identité visuelle forte et mémorable.",
      },
    ],
  },
  {
    id: "victor-denay",
    title: "VICTOR DENAY",
    category: "PORTFOLIO",
    year: "2024",
    date: "2024-08",
    color: "#08C566",
    description: "Portfolio sur-mesure pour un monteur et photographe : filmographie, galerie photo et back-office maison.",
    longDescription: `Portfolio sur-mesure pour Victor Denay, monteur et photographe. 39 projets, 24 clients, un showreel en fond de hero et une filmographie qui se parcourt comme un générique.

Le site s'efface pour laisser passer les images : typo massive, fond noir, un accent vert et rien d'autre. Vidéos Vimeo chargées seulement après consentement, visuels servis en AVIF/WebP.

Derrière, un back-office complet : Victor gère ses projets, ses plans et ses photos lui-même. Base Turso, uploads S3, sauvegardes scriptées.`,
    tags: ["NUXT", "TAILWIND", "GSAP", "TURSO", "DRIZZLE"],
    skills: ["typescript", "nuxt", "vue", "tailwind", "gsap", "drizzle", "figma", "git", "vercel"],
    role: "DÉVELOPPEUR FULL-STACK",
    client: "VICTOR DENAY",
    link: "https://victordenay.vercel.app",
    image: "/images/projects/victor-denay-medium.webp",
    logo: "/images/logos/victor-denay.png",
    sections: [
      {
        type: "intro",
        title: "LE BRIEF",
        content: "Un portfolio qui s'efface pour laisser briller le travail. Minimaliste mais impactant, sobre mais mémorable.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Servir de la vidéo et de la photo lourdes sans plomber le chargement, et garder le texte lisible par-dessus un showreel qui change de plan toutes les deux secondes.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "Nuxt 4 et GSAP pour les transitions, @nuxt/image pour les visuels, Turso et Drizzle côté données, S3 pour les uploads. Consentement cookies avant toute vidéo.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Un portfolio que Victor administre seul : il ajoute un projet, ses plans et ses photos depuis son back-office, sans passer par moi.",
      },
    ],
  },
];

// Sort projects by date (most recent first)
export const projects = allProjects.sort((a, b) => {
  return b.date.localeCompare(a.date);
});

// Helper functions
export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectByIndex(index: number): Project | undefined {
  return projects[index];
}

export function getNextProject(currentId: string): Project {
  const currentIndex = projects.findIndex((p) => p.id === currentId);
  const nextIndex = (currentIndex + 1) % projects.length;
  return projects[nextIndex];
}

export function getPreviousProject(currentId: string): Project {
  const currentIndex = projects.findIndex((p) => p.id === currentId);
  const prevIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
  return projects[prevIndex];
}

// For components that only need basic info
export function getProjectsBasic() {
  return projects.map(({ id, title, category, year, color, description, tags, image }) => ({
    id,
    title,
    category,
    year,
    color,
    description,
    tags,
    image,
  }));
}
