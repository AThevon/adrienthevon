import { COLORS } from "@/lib/constants";

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
  sections: ProjectSection[];
}

export const projects: Project[] = [
  {
    id: "project-alpha",
    title: "PROJECT ALPHA",
    category: "WEB EXPERIENCE",
    year: "2024",
    color: COLORS.accent,
    description: "An immersive 3D web experience pushing the boundaries of WebGL and real-time graphics.",
    longDescription: `Project Alpha represents the pinnacle of creative web development.
Built with cutting-edge technologies, it delivers an unforgettable user experience
that blurs the line between website and art installation.

The project features real-time 3D graphics, physics simulations, and
audio-reactive elements that respond to user interaction.`,
    tags: ["THREE.JS", "WEBGL", "REACT", "GSAP"],
    role: "LEAD DEVELOPER",
    client: "CREATIVE AGENCY X",
    link: "https://project-alpha.example.com",
    image: "/images/projects/project-alpha.jpg",
    sections: [
      {
        type: "intro",
        title: "THE VISION",
        content: "To create something that transcends the ordinary. A digital experience that feels alive, breathing, responding to every movement.",
      },
      {
        type: "challenge",
        title: "THE CHALLENGE",
        content: "How do you make pixels feel organic? How do you create emotion from code? These were the questions that drove this project.",
      },
      {
        type: "process",
        title: "THE PROCESS",
        content: "Months of experimentation. Thousands of iterations. Pushing WebGL to its limits while maintaining 60fps across devices.",
      },
      {
        type: "result",
        title: "THE RESULT",
        content: "An award-winning experience that redefined what's possible on the web. Featured on Awwwards, FWA, and CSS Design Awards.",
      },
    ],
  },
  {
    id: "neural-canvas",
    title: "NEURAL CANVAS",
    category: "CREATIVE TOOL",
    year: "2024",
    color: COLORS.secondary.green,
    description: "AI-powered generative art platform for digital artists and creative professionals.",
    longDescription: `Neural Canvas empowers artists to create unique generative artwork
using the latest in machine learning technology. The platform provides intuitive
controls while hiding the complexity of AI models behind a beautiful interface.

Artists can train custom models, blend styles, and generate endless variations
while maintaining complete creative control over the output.`,
    tags: ["AI/ML", "CANVAS", "REACT", "NODE.JS"],
    role: "FULL-STACK DEVELOPER",
    client: "STARTUP Y",
    link: "https://neural-canvas.example.com",
    image: "/images/projects/neural-canvas.jpg",
    sections: [
      {
        type: "intro",
        title: "THE IDEA",
        content: "Art meets artificial intelligence. A tool that amplifies human creativity rather than replacing it.",
      },
      {
        type: "challenge",
        title: "THE COMPLEXITY",
        content: "Making AI accessible without dumbing it down. Preserving artistic intent while leveraging machine learning.",
      },
      {
        type: "process",
        title: "THE BUILD",
        content: "Custom neural networks trained on millions of artworks. Real-time generation with intuitive controls.",
      },
      {
        type: "result",
        title: "THE IMPACT",
        content: "Used by over 50,000 artists worldwide. Generating millions of unique artworks every month.",
      },
    ],
  },
  {
    id: "void-studio",
    title: "VOID STUDIO",
    category: "DESIGN SYSTEM",
    year: "2023",
    color: COLORS.secondary.purple,
    description: "A comprehensive design system for modern web applications with 100+ components.",
    longDescription: `Void Studio is a meticulously crafted design system that provides
developers and designers with a unified language for building consistent,
accessible, and beautiful user interfaces.

Featuring dark mode support, responsive components, and extensive documentation,
it's the foundation for building modern web applications at scale.`,
    tags: ["DESIGN SYSTEM", "REACT", "STORYBOOK", "FIGMA"],
    role: "DESIGN ENGINEER",
    client: "TECH COMPANY Z",
    link: "https://void-studio.example.com",
    image: "/images/projects/void-studio.jpg",
    sections: [
      {
        type: "intro",
        title: "THE NEED",
        content: "Consistency at scale. A design language that speaks clearly across hundreds of interfaces.",
      },
      {
        type: "challenge",
        title: "THE PUZZLE",
        content: "Flexibility vs consistency. Enabling creativity while maintaining brand coherence.",
      },
      {
        type: "process",
        title: "THE CRAFT",
        content: "Token-based architecture. Themeable components. Documentation that developers actually want to read.",
      },
      {
        type: "result",
        title: "THE OUTCOME",
        content: "Adopted by 12 product teams. Reduced design-to-dev handoff time by 60%.",
      },
    ],
  },
  {
    id: "particle-flow",
    title: "PARTICLE FLOW",
    category: "EXPERIMENT",
    year: "2023",
    color: COLORS.secondary.pink,
    description: "Real-time particle simulation using GPU compute shaders and WebGPU.",
    longDescription: `Particle Flow is an experimental project exploring the capabilities
of WebGPU for real-time particle simulations. Millions of particles dance across
the screen, creating mesmerizing patterns driven by mathematical forces.

A deep dive into emergent behaviors, flocking algorithms, and the beauty
that emerges from simple rules applied at massive scale.`,
    tags: ["WEBGPU", "SHADERS", "CREATIVE CODING"],
    role: "CREATIVE DEVELOPER",
    client: "PERSONAL PROJECT",
    link: "https://particle-flow.example.com",
    image: "/images/projects/particle-flow.jpg",
    sections: [
      {
        type: "intro",
        title: "THE CURIOSITY",
        content: "What if we could render millions of particles in real-time? What patterns would emerge?",
      },
      {
        type: "challenge",
        title: "THE LIMITS",
        content: "Browser APIs. GPU memory. Frame budgets. Every constraint became an opportunity.",
      },
      {
        type: "process",
        title: "THE EXPLORATION",
        content: "WebGPU compute shaders. Spatial hashing. Emergent behaviors from simple rules.",
      },
      {
        type: "result",
        title: "THE BEAUTY",
        content: "5 million particles dancing at 60fps. Organic patterns from mathematical precision.",
      },
    ],
  },
  {
    id: "echo-space",
    title: "ECHO SPACE",
    category: "AUDIO VISUAL",
    year: "2023",
    color: COLORS.secondary.cyan,
    description: "Audio-reactive visual experience that transforms sound into stunning visuals.",
    longDescription: `Echo Space transforms sound into stunning visuals in real-time.
Using the Web Audio API and custom shaders, every beat and frequency becomes
a visual element in an ever-evolving digital canvas.

Experience music like never before - see the bass, feel the treble,
and immerse yourself in a synesthetic journey.`,
    tags: ["WEB AUDIO", "CANVAS", "MOTION"],
    role: "CREATIVE DEVELOPER",
    client: "MUSIC LABEL",
    link: "https://echo-space.example.com",
    image: "/images/projects/echo-space.jpg",
    sections: [
      {
        type: "intro",
        title: "THE SYNESTHESIA",
        content: "Sound has color. Rhythm has shape. Music has dimension.",
      },
      {
        type: "challenge",
        title: "THE LATENCY",
        content: "Audio analysis in real-time. Visual response with zero perceptible delay.",
      },
      {
        type: "process",
        title: "THE SYNTHESIS",
        content: "FFT analysis. Custom shaders. A visual language that speaks in frequencies.",
      },
      {
        type: "result",
        title: "THE EXPERIENCE",
        content: "Featured at 3 music festivals. Transformed how audiences experience live performances.",
      },
    ],
  },
  {
    id: "flux-motion",
    title: "FLUX MOTION",
    category: "ANIMATION LIBRARY",
    year: "2024",
    color: "#ff6b35",
    description: "A lightweight animation library for fluid, physics-based web animations.",
    longDescription: `Flux Motion is a performance-focused animation library that brings
natural, physics-based motion to the web. Spring animations, gesture handling,
and seamless transitions - all with a tiny footprint.

Built for developers who want beautiful animations without the bloat.
Every kilobyte counts when you're crafting premium web experiences.`,
    tags: ["TYPESCRIPT", "ANIMATION", "OPEN SOURCE"],
    role: "CREATOR & MAINTAINER",
    client: "OPEN SOURCE",
    link: "https://github.com/example/flux-motion",
    image: "/images/projects/flux-motion.jpg",
    sections: [
      {
        type: "intro",
        title: "THE FRUSTRATION",
        content: "Animation libraries that are either too heavy or too limited. There had to be a better way.",
      },
      {
        type: "challenge",
        title: "THE BALANCE",
        content: "Power vs simplicity. Features vs bundle size. Developer experience vs runtime performance.",
      },
      {
        type: "process",
        title: "THE ENGINEERING",
        content: "Custom spring physics. Tree-shakeable architecture. TypeScript from day one.",
      },
      {
        type: "result",
        title: "THE ADOPTION",
        content: "10k+ GitHub stars. Used in production by companies like Vercel and Stripe.",
      },
    ],
  },
  {
    id: "spectrum-ui",
    title: "SPECTRUM UI",
    category: "DASHBOARD",
    year: "2024",
    color: "#9d4edd",
    description: "Real-time data visualization dashboard for financial analytics.",
    longDescription: `Spectrum UI transforms complex financial data into intuitive,
real-time visualizations. Processing millions of data points per second,
it delivers insights at a glance while maintaining sub-16ms render times.

A masterclass in WebGL performance optimization and data streaming architecture.`,
    tags: ["D3.JS", "WEBGL", "WEBSOCKETS", "REACT"],
    role: "LEAD FRONTEND ENGINEER",
    client: "FINTECH STARTUP",
    link: "https://spectrum-ui.example.com",
    image: "/images/projects/spectrum-ui.jpg",
    sections: [
      {
        type: "intro",
        title: "THE DATA",
        content: "Millions of transactions. Hundreds of metrics. One unified view.",
      },
      {
        type: "challenge",
        title: "THE SCALE",
        content: "Real-time updates at 60fps. Smooth interactions with massive datasets.",
      },
      {
        type: "process",
        title: "THE ARCHITECTURE",
        content: "WebGL-accelerated charts. Streaming data with WebSockets. Virtual scrolling for infinite lists.",
      },
      {
        type: "result",
        title: "THE IMPACT",
        content: "Reduced analyst decision time by 40%. Now handles 10x more data than the previous solution.",
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
