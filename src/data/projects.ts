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
  color: string;
  description: string;
  longDescription: string;
  tags: string[];
  role: string;
  client: string;
  link: string;
  image: string;
  ogImage?: string;
  sections: ProjectSection[];
}

export const projects: Project[] = [
  {
    id: "under-the-flow",
    title: "UNDER THE FLOW",
    category: "WEB PLATFORM",
    year: "2024",
    color: "#60cbd7", // Cyan turquoise (couleur officielle du projet)
    description: "Plateforme de sessions live hip-hop avec une expérience immersive pour les artistes et les fans.",
    longDescription: `Under The Flow est une plateforme dédiée aux sessions live de hip-hop.
Le projet capture l'essence du freestyle et des performances live, offrant une vitrine
unique pour les artistes émergents de la scène hip-hop française.

Une expérience web immersive qui met en avant la musique et les artistes
avec une direction artistique forte et moderne.`,
    tags: ["NEXT.JS", "TAILWIND", "MOTION", "SUPABASE"],
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
    color: "#1890ff", // Bleu vibrant (couleur officielle du portfolio)
    description: "Portfolio créatif pour un vidéaste et photographe professionnel.",
    longDescription: `Portfolio sur-mesure pour Victor Denay, vidéaste et photographe.
Un design épuré qui laisse toute la place au travail visuel de l'artiste,
avec des transitions fluides et une navigation intuitive.

L'objectif était de créer un écrin digital qui sublime les créations
tout en offrant une expérience de navigation mémorable.`,
    tags: ["NUXT", "TAILWIND", "MOTION", "THREE.JS", "SUPABASE"],
    role: "DÉVELOPPEUR FULL-STACK",
    client: "VICTOR DENAY",
    link: "https://victordenay.com",
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
    id: "depense-man",
    title: "DÉPENSE MAN",
    category: "WEB APP",
    year: "2024",
    color: "#D97706", // Orange-amber (couleur officielle de l'app)
    description: "Application de gestion de finances personnelles simple et efficace.",
    longDescription: `Dépense Man est une application web progressive (PWA) pour gérer
ses finances mensuelles de manière simple et intuitive. Pas de complexité inutile,
juste les fonctionnalités essentielles pour suivre ses dépenses.

Une approche minimaliste du budget personnel, accessible sur tous les appareils
avec une interface claire et des visualisations pertinentes.`,
    tags: ["NEXT.JS", "TAILWIND", "PWA", "SUPABASE"],
    role: "DÉVELOPPEUR FULL-STACK",
    client: "PROJET PERSONNEL",
    link: "https://depense-man.vercel.app",
    image: "/images/projects/depense-man-medium.png",
    sections: [
      {
        type: "intro",
        title: "LE BESOIN",
        content: "Une app de budget sans la complexité des solutions bancaires. Simple, rapide, efficace.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Rendre la gestion de budget agréable. Créer une interface qui donne envie d'être utilisée régulièrement.",
      },
      {
        type: "process",
        title: "LE PROCESS",
        content: "PWA pour l'accès offline. Interface épurée. Visualisations claires des dépenses. Catégorisation intelligente.",
      },
      {
        type: "result",
        title: "LE RÉSULTAT",
        content: "Une app que j'utilise au quotidien pour gérer mes finances. Simple, mais qui fait exactement ce qu'on lui demande.",
      },
    ],
  },
  {
    id: "linekut",
    title: "LINEKUT",
    category: "CREATIVE TOOL",
    year: "2024",
    color: "#F97316", // Orange (couleur officielle de l'outil)
    description: "Convertisseur d'images en patrons découpables pour scie à chantourner, laser et vinyl.",
    longDescription: `Linekut transforme n'importe quelle image en patron prêt à découper.
Que ce soit pour la scie à chantourner, la découpe laser, le vinyl ou les stickers,
l'outil génère des fichiers optimisés pour chaque technique.

Une PWA qui démocratise la création de patrons de découpe,
rendant accessible un processus habituellement complexe.`,
    tags: ["NEXT.JS", "CANVAS", "PWA", "IMAGE PROCESSING"],
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
    id: "blenkdev",
    title: "BLENKDEV",
    category: "WEB AGENCY",
    year: "2024",
    color: "#fdbb00", // Jaune (couleur officielle de l'agence)
    description: "Site vitrine pour une agence de développement web freelance spécialisée dans les solutions sur-mesure.",
    longDescription: `BlenkDev est le site vitrine de mon activité freelance en développement web.
Une plateforme qui présente mes services, mon approche et mon portfolio de manière claire et professionnelle.

L'objectif : inspirer confiance et démontrer mon expertise à travers une identité visuelle moderne et des études de cas détaillées.`,
    tags: ["NEXT.JS", "TAILWIND", "MOTION", "SEO", "ANALYTICS"],
    role: "DÉVELOPPEUR FULL-STACK",
    client: "BLENKDEV",
    link: "https://blenkdev.vercel.app",
    image: "/images/projects/blenkdev-medium.png",
    sections: [
      {
        type: "intro",
        title: "LA MISSION",
        content: "Créer une présence en ligne professionnelle pour mon activité freelance. Un site qui inspire confiance et démontre mon expertise technique.",
      },
      {
        type: "challenge",
        title: "LE DÉFI",
        content: "Se démarquer dans un marché saturé en mettant en avant mes compétences uniques et mon approche centrée sur le client.",
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
