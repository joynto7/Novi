const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "public", "covers");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Simple deterministic PRNG so re-running produces stable, varied output.
function makeRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function seedFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

const ICON_PATHS = {
  music:
    '<path d="M180 130 L180 350 A45 40 0 1 1 150 312 L150 165 L330 130 L330 300 A45 40 0 1 1 300 262 L300 90 Z" />',
  cpu: '<rect x="150" y="150" width="200" height="200" rx="18" /><rect x="205" y="205" width="90" height="90" rx="8" fill="none" stroke-width="10" /><path d="M150 200h-30M150 260h-30M150 320h-30M350 200h30M350 260h30M350 320h30M200 150v-30M260 150v-30M320 150v-30M200 350v30M260 350v30M320 350v30" stroke-width="10" fill="none" stroke-linecap="round" />',
  briefcase:
    '<rect x="130" y="200" width="240" height="160" rx="16" /><path d="M210 200v-30a30 30 0 0 1 30-30h20a30 30 0 0 1 30 30v30" fill="none" stroke-width="14" /><rect x="130" y="255" width="240" height="30" />',
  palette:
    '<path d="M250 120c-80 0-140 60-140 130 0 60 40 90 80 90 20 0 25-15 15-30-10-15 0-30 20-30h50c45 0 75-35 75-80 0-45-45-80-100-80z" /><circle cx="200" cy="185" r="14" fill="#0000" stroke="none" /><circle cx="200" cy="185" r="14" /><circle cx="255" cy="160" r="14" /><circle cx="310" cy="185" r="14" /><circle cx="290" cy="245" r="14" />',
  trophy:
    '<path d="M190 130h120v70c0 45-25 80-60 80s-60-35-60-80z" /><path d="M190 145h-35a5 5 0 0 0-5 5c0 45 25 75 55 80" fill="none" stroke-width="12" /><path d="M310 145h35a5 5 0 0 1 5 5c0 45-25 75-55 80" fill="none" stroke-width="12" /><rect x="235" y="280" width="30" height="40" /><rect x="205" y="320" width="90" height="20" rx="6" />',
  utensils:
    '<path d="M190 110v90a20 20 0 0 0 20 20v130" fill="none" stroke-width="14" stroke-linecap="round" /><path d="M170 110v60M210 110v60M190 170v-60" stroke-width="14" stroke-linecap="round" /><path d="M320 110c-30 0-40 40-40 80 0 30 15 45 30 50v110" fill="none" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />',
  "heart-pulse":
    '<path d="M250 340c-70-50-120-95-120-150a65 65 0 0 1 120-38 65 65 0 0 1 120 38c0 55-50 100-120 150z" fill-rule="evenodd" /><path d="M170 235h35l20-40 25 70 20-45h40" fill="none" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />',
  "graduation-cap":
    '<path d="M250 140 L390 195 L250 250 L110 195 Z" /><path d="M180 220v55c0 20 32 38 70 38s70-18 70-38v-55" fill="none" stroke-width="12" /><path d="M390 195v70" stroke-width="12" stroke-linecap="round" />',
};

const CATEGORIES = [
  { slug: "music", from: "#6366f1", to: "#4338ca" },
  { slug: "technology", from: "#14b8a6", to: "#0f766e" },
  { slug: "business", from: "#4f46e5", to: "#312e81" },
  { slug: "arts-culture", from: "#f59e0b", to: "#b45309" },
  { slug: "sports", from: "#0d9488", to: "#134e4a" },
  { slug: "food-drink", from: "#f97316", to: "#c2410c" },
  { slug: "wellness", from: "#2dd4bf", to: "#0f766e" },
  { slug: "education", from: "#818cf8", to: "#3730a3" },
];

function iconFor(slug) {
  const map = {
    music: "music",
    technology: "cpu",
    business: "briefcase",
    "arts-culture": "palette",
    sports: "trophy",
    "food-drink": "utensils",
    wellness: "heart-pulse",
    education: "graduation-cap",
  };
  return ICON_PATHS[map[slug]] || ICON_PATHS.music;
}

function decorativeShapes(rand) {
  let shapes = "";
  for (let i = 0; i < 5; i += 1) {
    const cx = Math.round(rand() * 800);
    const cy = Math.round(rand() * 600);
    const r = Math.round(30 + rand() * 90);
    shapes += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="${(0.03 + rand() * 0.05).toFixed(3)}" />`;
  }
  return shapes;
}

function buildSvg({ slug, from, to, variant }) {
  const seed = seedFromString(`${slug}-${variant}`);
  const rand = makeRandom(seed);
  const angle = Math.round(rand() * 360);
  const icon = iconFor(slug);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 500 375">
  <defs>
    <linearGradient id="g" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="500" height="375" fill="url(#g)" />
  ${decorativeShapes(rand)}
  <g transform="translate(0,-30)" fill="white" opacity="0.9" stroke="white" stroke-linejoin="round">
    ${icon}
  </g>
</svg>`;
}

let count = 0;
for (const category of CATEGORIES) {
  for (let variant = 1; variant <= 4; variant += 1) {
    const svg = buildSvg({ ...category, variant });
    fs.writeFileSync(path.join(OUT_DIR, `${category.slug}-${variant}.svg`), svg);
    count += 1;
  }
}

// Blog covers: neutral brand gradient with a simple document/quill icon, varied per index.
const BLOG_ICON =
  '<rect x="160" y="110" width="180" height="230" rx="14" /><path d="M195 160h110M195 195h110M195 230h80" stroke="#312e81" stroke-width="10" stroke-linecap="round" />';
for (let i = 1; i <= 6; i += 1) {
  const rand = makeRandom(seedFromString(`blog-${i}`));
  const angle = Math.round(rand() * 360);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 500 375">
  <defs>
    <linearGradient id="g" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#0d9488" />
    </linearGradient>
  </defs>
  <rect width="500" height="375" fill="url(#g)" />
  ${decorativeShapes(rand)}
  <g transform="translate(0,-20)" fill="white" opacity="0.95">
    ${BLOG_ICON}
  </g>
</svg>`;
  fs.writeFileSync(path.join(OUT_DIR, `blog-${i}.svg`), svg);
  count += 1;
}

// Auth / marketing hero illustration placeholders (generic brand gradient tiles).
for (let i = 1; i <= 3; i += 1) {
  const rand = makeRandom(seedFromString(`brand-${i}`));
  const angle = Math.round(rand() * 360);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 500 375">
  <defs>
    <linearGradient id="g" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
  </defs>
  <rect width="500" height="375" fill="url(#g)" />
  ${decorativeShapes(rand)}
</svg>`;
  fs.writeFileSync(path.join(OUT_DIR, `brand-${i}.svg`), svg);
  count += 1;
}

console.log(`Generated ${count} cover images in ${OUT_DIR}`);
