# Data shapes

Exact structures to follow when writing files.

## `Project` (TypeScript)

Defined in `src/data/projects.ts`:

```ts
interface Project {
  id: string;            // kebab-case slug, used in URLs
  title: string;         // UPPERCASE display name
  category: string;      // UPPERCASE category label (FR for source, see note below)
  year: string;          // "2026"
  date: string;          // "2026-01" — used for sorting
  color: string;         // "#hex"
  description: string;   // ~1 sentence
  longDescription: string; // 2-3 paragraphs joined with \n\n
  tags: string[];        // visible UPPERCASE tags
  skills: string[];      // skill IDs from src/data/skills.ts
  role: string;          // UPPERCASE role
  client: string;        // UPPERCASE client name (or OPEN SOURCE / PROJET PERSONNEL)
  link: string;          // live URL or repo URL
  image: string;         // "/images/projects/<slug>-medium.png"
  logo?: string;         // "/images/logos/<slug>.<ext>" — optional
  ogImage?: string;      // optional, used by SEO; usually omitted
  sections: ProjectSection[]; // exactly 4: intro, challenge, process, result
}

interface ProjectSection {
  type: "intro" | "challenge" | "process" | "result";
  title: string;   // UPPERCASE short title
  content: string; // 1-2 sentences
}
```

**Note on FR/EN in `projects.ts`**: the source file holds the FR strings. The English versions live in `messages/en.json`. The components fetch translations via `useTranslations('projectsData.<camelSlug>')`, which override the source FR strings at render time.

## i18n shape

Keys in `messages/{fr,en}.json` under `projectsData`:

```json
{
  "projectsData": {
    "<camelCaseSlug>": {
      "category": "...",
      "description": "...",
      "longDescription": "...",
      "role": "...",
      "client": "...",
      "sections": {
        "intro":     { "title": "...", "content": "..." },
        "challenge": { "title": "...", "content": "..." },
        "process":   { "title": "...", "content": "..." },
        "result":    { "title": "...", "content": "..." }
      }
    }
  }
}
```

**Slug conversion**: kebab-case to camelCase.
- `under-the-flow` → `underTheFlow`
- `victor-denay` → `victorDenay`
- `worktigre` (single word) → `worktigre`

**`client` is optional in i18n**: existing entries inconsistently include it. Include it only if the FR client value differs from a meaningful EN equivalent, or if you want to localize it (e.g. `OPEN SOURCE` → `OPEN SOURCE`, no change needed; `PROJET PERSONNEL` → `PERSONAL PROJECT`).

## `Skill` (TypeScript)

Defined in `src/data/skills.ts`:

```ts
interface Skill {
  id: string;             // kebab-case slug
  name: string;           // display name
  category: SkillCategory; // "frontend" | "backend" | "creative" | "tools" | "design"
  connections: string[];  // IDs of related skills (graph edges)
  description?: string;   // 1 short sentence (FR)
  projectIds?: string[];  // optional, derived elsewhere usually
}
```

## `iconMapping` and `logoColors` (in `src/lib/skillLogos.ts`)

```ts
const iconMapping: Record<string, string> = {
  // skill ID → Simple Icons slug (https://simpleicons.org/)
  // example: "nextjs": "nextdotjs"
};

const logoColors: Record<string, string> = {
  // skill ID → brand color hex
  // example: "react": "#61DAFB"
};
```

Both must include the new skill ID for icons to render. Find the official Simple Icons slug at https://simpleicons.org/ — it's the lowercase alphanum-only version of the brand name (e.g. "Node.js" → "nodedotjs").

## Image conventions

Place under `public/images/`:

| Asset | Path | Notes |
|---|---|---|
| Project logo | `/images/logos/<slug>.<ext>` | png, svg, webp, etc. — keep source ext |
| Project hero (full) | `/images/projects/<slug>.png` | original resolution |
| Project hero (medium) | `/images/projects/<slug>-medium.png` | 1200px wide |
| Project hero (small) | `/images/projects/<slug>-small.png` | 600px wide |

Aspect ratio: keep the source ratio. Existing projects are around 16:9 but it's not strict.

The `image` field in `Project` always points to the `-medium` variant. The full and small versions are used by other components (gallery zoom, mobile, etc.) and must exist with the matching naming convention.
