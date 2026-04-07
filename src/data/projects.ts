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
  ogImage?: string;
  sections: ProjectSection[];
}

const allProjects: Project[] = [
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
    link: "https://worktigre.vercel.app",
    image: "/images/projects/wt-tiger-medium.png",
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
    link: "https://tokeneater.vercel.app",
    image: "/images/projects/tokeneater-medium.png",
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
    link: "https://pix2paint.vercel.app",
    image: "/images/projects/pix2paint-medium.png",
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
    link: "https://yeetbg.vercel.app",
    image: "/images/projects/yeetbg-medium.png",
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
    link: "https://nixdash.vercel.app",
    image: "/images/projects/nixdash-medium.png",
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
    color: "#EE4E83",
    description: "Convertisseur d'images en patrons découpables pour scie à chantourner, laser et vinyl.",
    longDescription: `Linekut transforme n'importe quelle image en patron prêt à découper.
Que ce soit pour la scie à chantourner, la découpe laser, le vinyl ou les stickers,
l'outil génère des fichiers optimisés pour chaque technique.

Une PWA qui démocratise la création de patrons de découpe,
rendant accessible un processus habituellement complexe.`,
    tags: ["NEXT.JS", "CANVAS", "PWA", "IMAGE PROCESSING"],
    skills: ["nextjs", "react", "typescript", "tailwind", "canvas", "git", "vercel", "figma"],
    role: "DÉVELOPPEUR FRONT-END",
    client: "PROJET PERSONNEL",
    link: "https://linekut.vercel.app",
    image: "/images/projects/linekut-medium.png",
    sections: [
      {
        type: "intro",
        title: "L'IDÉE",
        content: "Simplifier la création de patrons de découpe. Transformer une photo en fichier prêt à usiner en quelques clics.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Traitement d'image côté client pour la rapidité. Algorithmes de vectorisation et de simplification des contours.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "Canvas API pour le traitement d'image. Algorithmes de détection de contours. Export en formats standards (SVG, DXF).",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Un outil utilisé par des makers et artisans pour créer rapidement des patrons de découpe personnalisés.",
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
    skills: ["nextjs", "react", "typescript", "tailwind", "motion", "postgresql", "vercel", "git", "figma"],
    role: "DÉVELOPPEUR FULL-STACK",
    client: "UNDER THE FLOW",
    link: "https://undertheflow.com",
    image: "/images/projects/under-the-flow-medium.png",
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
    description: "Portfolio créatif pour un vidéaste et photographe professionnel.",
    longDescription: `Portfolio sur-mesure pour Victor Denay, vidéaste et photographe.
Un design épuré qui laisse toute la place au travail visuel de l'artiste,
avec des transitions fluides et une navigation intuitive.

L'objectif était de créer un écrin digital qui sublime les créations
tout en offrant une expérience de navigation mémorable.`,
    tags: ["NUXT", "TAILWIND", "MOTION", "THREE.JS", "SUPABASE"],
    skills: ["typescript", "nuxt", "vue", "tailwind", "motion", "threejs", "postgresql", "figma", "git", "vercel"],
    role: "DÉVELOPPEUR FULL-STACK",
    client: "VICTOR DENAY",
    link: "https://victordenay.vercel.app",
    image: "/images/projects/victor-denay-medium.png",
    sections: [
      {
        type: "intro",
        title: "LE BRIEF",
        content: "Un portfolio qui s'efface pour laisser briller le travail. Minimaliste mais impactant, sobre mais mémorable.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Présenter du contenu vidéo et photo de haute qualité sans compromettre les temps de chargement. Créer une galerie fluide et intuitive.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "Design mobile-first. Lazy loading intelligent. Transitions soignées entre les projets. Typographie minimaliste.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Un portfolio élégant qui met en valeur le travail de Victor tout en offrant une expérience utilisateur premium.",
      },
    ],
  },
  {
    id: "blenkdev",
    title: "BLENKDEV",
    category: "WEB AGENCY",
    year: "2024",
    date: "2024-04",
    color: "#FE1832",
    description: "Site vitrine pour une agence de développement web freelance spécialisée dans les solutions sur-mesure.",
    longDescription: `BlenkDev est le site vitrine d'une activité freelance en développement web.
Une plateforme qui présente des services, approches et portfolio de manière claire et professionnelle.

L'objectif : inspirer confiance et démontrer expertise à travers une identité visuelle moderne et des études de cas détaillées.`,
    tags: ["NEXT.JS", "TAILWIND", "MOTION", "SEO", "ANALYTICS"],
    skills: ["nextjs", "react", "typescript", "tailwind", "motion", "git", "vercel", "figma"],
    role: "DÉVELOPPEUR FULL-STACK",
    client: "BLENKDEV",
    link: "https://blenkdev.vercel.app",
    image: "/images/projects/blenkdev-medium.png",
    sections: [
      {
        type: "intro",
        title: "LA MISSION",
        content: "Créer une présence en ligne professionnelle pour une activité freelance. Un site qui inspire confiance et démontre expertise technique.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Se démarquer dans un marché saturé en mettant en avant compétences uniques et approche centrée sur le client.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "Design moderne et épuré. Mise en avant des projets réalisés. Section services claire. Témoignages clients pour la crédibilité.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Un site vitrine qui convertit les visiteurs en clients potentiels et reflète mon identité professionnelle.",
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
