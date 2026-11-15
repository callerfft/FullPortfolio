/**
 * Генерирует чистые векторные SVG-обложки для карточек и детальных страниц проектов.
 */
export function renderCoverSvg(project, className = 'card-cover-svg') {
  const color = project.accent || '#c8ff32';
  const pattern = project.pattern || 'grid';
  const uid = `${project.id}-${className}`;

  const motifs = {
    orbital: `
      <circle cx="240" cy="150" r="88" stroke="${color}" stroke-opacity="0.28" stroke-width="1.2" stroke-dasharray="4 6"/>
      <circle cx="240" cy="150" r="56" stroke="${color}" stroke-opacity="0.55" stroke-width="1.5"/>
      <circle cx="240" cy="150" r="18" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="1.5"/>
      <circle cx="328" cy="150" r="5" fill="${color}"/>
      <circle cx="196" cy="112" r="3.5" fill="#f2f4f8"/>
      <path d="M90 220 Q240 80 390 130" stroke="${color}" stroke-opacity="0.35" stroke-width="1.2" fill="none"/>
    `,
    grid: `
      <rect x="84" y="54" width="312" height="192" rx="10" stroke="${color}" stroke-opacity="0.32" stroke-width="1.2" fill="#0d1119"/>
      <line x1="84" y1="92" x2="396" y2="92" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <rect x="104" y="112" width="84" height="52" rx="6" fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-opacity="0.5"/>
      <rect x="200" y="112" width="176" height="22" rx="4" fill="rgba(255,255,255,0.08)"/>
      <rect x="200" y="142" width="132" height="22" rx="4" fill="rgba(255,255,255,0.05)"/>
      <rect x="104" y="180" width="272" height="44" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>
      <circle cx="104" cy="73" r="4" fill="${color}"/>
      <circle cx="118" cy="73" r="4" fill="rgba(255,255,255,0.25)"/>
    `,
    matrix: `
      <rect x="115" y="58" width="250" height="184" rx="8" stroke="${color}" stroke-opacity="0.35" stroke-width="1.2" fill="none"/>
      <path d="M140 150 L185 110 L235 165 L290 95 L340 135" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="185" cy="110" r="4.5" fill="${color}"/>
      <circle cx="235" cy="165" r="4.5" fill="${color}"/>
      <circle cx="290" cy="95" r="4.5" fill="${color}"/>
      <rect x="171" y="96" width="28" height="28" stroke="${color}" stroke-opacity="0.45" stroke-dasharray="3 3" fill="none"/>
      <rect x="276" y="81" width="28" height="28" stroke="${color}" stroke-opacity="0.65" fill="none"/>
    `,
    waves: `
      <path d="M40 170 C120 95, 190 230, 270 140 C330 75, 390 175, 440 135" stroke="${color}" stroke-width="2" fill="none"/>
      <path d="M40 195 C120 120, 190 255, 270 165 C330 100, 390 200, 440 160" stroke="${color}" stroke-opacity="0.4" stroke-width="1.2" fill="none"/>
      <path d="M40 145 C120 70, 190 205, 270 115 C330 50, 390 150, 440 110" stroke="${color}" stroke-opacity="0.22" stroke-width="1" fill="none"/>
      <circle cx="270" cy="140" r="6" fill="${color}"/>
    `,
    nodes: `
      <line x1="140" y1="100" x2="240" y2="150" stroke="${color}" stroke-opacity="0.45" stroke-width="1.4"/>
      <line x1="140" y1="200" x2="240" y2="150" stroke="${color}" stroke-opacity="0.45" stroke-width="1.4"/>
      <line x1="240" y1="150" x2="345" y2="105" stroke="${color}" stroke-opacity="0.45" stroke-width="1.4"/>
      <line x1="240" y1="150" x2="345" y2="195" stroke="${color}" stroke-opacity="0.45" stroke-width="1.4"/>
      <circle cx="140" cy="100" r="14" fill="#0d1119" stroke="${color}" stroke-width="1.5"/>
      <circle cx="140" cy="200" r="14" fill="#0d1119" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
      <circle cx="240" cy="150" r="22" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="1.8"/>
      <circle cx="345" cy="105" r="14" fill="#0d1119" stroke="${color}" stroke-width="1.5"/>
      <circle cx="345" cy="195" r="14" fill="#0d1119" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
    `,
    bars: `
      <rect x="96" y="72" width="288" height="26" rx="5" fill="rgba(255,255,255,0.06)"/>
      <rect x="96" y="112" width="210" height="26" rx="5" fill="${color}" fill-opacity="0.22" stroke="${color}" stroke-opacity="0.6"/>
      <rect x="96" y="152" width="256" height="26" rx="5" fill="rgba(255,255,255,0.08)"/>
      <rect x="96" y="192" width="164" height="26" rx="5" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-opacity="0.35"/>
    `,
    diagonal: `
      <line x1="60" y1="240" x2="260" y2="40" stroke="${color}" stroke-opacity="0.25" stroke-width="1.2"/>
      <line x1="120" y1="260" x2="340" y2="40" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="260" x2="420" y2="40" stroke="${color}" stroke-opacity="0.4" stroke-width="1.2"/>
      <polygon points="210,165 255,115 275,145 230,195" fill="${color}" fill-opacity="0.22" stroke="${color}" stroke-width="1.5"/>
    `,
    hex: `
      <polygon points="240,62 316,106 316,194 240,238 164,194 164,106" fill="none" stroke="${color}" stroke-opacity="0.45" stroke-width="1.5"/>
      <polygon points="240,94 288,122 288,178 240,206 192,178 192,122" fill="${color}" fill-opacity="0.1" stroke="${color}" stroke-opacity="0.75" stroke-width="1.2"/>
      <line x1="240" y1="62" x2="240" y2="238" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
      <line x1="164" y1="106" x2="316" y2="194" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    `,
  };

  return `
    <svg class="${className}" viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="glow-${uid}" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.16"/>
          <stop offset="100%" stop-color="#0b0d12" stop-opacity="0"/>
        </radialGradient>
        <pattern id="dots-${uid}" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.08)"/>
        </pattern>
      </defs>
      <rect width="480" height="300" fill="#0b0d12"/>
      <rect width="480" height="300" fill="url(#dots-${uid})"/>
      <rect width="480" height="300" fill="url(#glow-${uid})"/>
      ${motifs[pattern] || motifs.grid}
    </svg>
  `;
}
