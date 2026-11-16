/**
 * Генерирует чистые векторные SVG-обложки для проектов и иконки для стеков в стиле Monolith Ghost.
 */
export function renderStackIconSvg(stackName, color = '#f4f4f6') {
  const key = String(stackName || '').toLowerCase();
  let paths = `
    <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
    <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="${color}" stroke-width="1.5"/>
    <rect x="4" y="13" width="16" height="7" rx="1.5" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5"/>
  `;

  if (/docker/.test(key)) {
    paths = `
      <rect x="4" y="10" width="4" height="4" rx="0.8" fill="currentColor" fill-opacity="0.75"/>
      <rect x="9" y="10" width="4" height="4" rx="0.8" fill="${color}"/>
      <rect x="14" y="10" width="4" height="4" rx="0.8" fill="currentColor" fill-opacity="0.75"/>
      <rect x="9" y="5" width="4" height="4" rx="0.8" fill="currentColor" fill-opacity="0.55"/>
      <path d="M3 16h16.5c-.7 2.8-3 4.2-6.5 4.2H9c-3.5 0-5.4-1.5-6-4.2Z" stroke="currentColor" stroke-width="1.4"/>
    `;
  } else if (/redis|lua/.test(key)) {
    paths = `
      <path d="M12 4 20 8l-8 4-8-4 8-4Z" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M4 12l8 4 8-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 16l8 4 8-4" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  } else if (/postgres|db/.test(key)) {
    paths = `
      <ellipse cx="12" cy="6.5" rx="7" ry="2.8" stroke="${color}" stroke-width="1.5"/>
      <path d="M5 6.5v11c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-11" stroke="currentColor" stroke-width="1.5"/>
      <path d="M5 12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.4"/>
    `;
  } else if (/nginx/.test(key)) {
    paths = `
      <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" stroke="currentColor" stroke-opacity="0.6" stroke-width="1.4"/>
      <path d="M9 16V8l6 8V8" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  } else if (/kubernetes|k8s/.test(key)) {
    paths = `
      <polygon points="12,3.5 19.5,8 19.5,16 12,20.5 4.5,16 4.5,8" stroke="currentColor" stroke-opacity="0.6" stroke-width="1.4"/>
      <circle cx="12" cy="12" r="2.6" stroke="${color}" stroke-width="1.6"/>
      <path d="M12 4v5.2M12 14.8V20M5.2 8.5l4.4 2.4M14.4 13.1l4.4 2.4M18.8 8.5l-4.4 2.4M9.6 13.1l-4.4 2.4" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.2"/>
    `;
  } else if (/python|fastapi|asyncio|парсинг|docx/.test(key)) {
    paths = `
      <path d="M8 7.5C8 5.5 9.6 4 12 4s4 1.2 4 3.5V11H8.5C6.5 11 5 12.4 5 14.5S6.5 18 8.5 18H11" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M16 16.5c0 2-1.6 3.5-4 3.5s-4-1.2-4-3.5V13h7.5c2 0 3.5-1.4 3.5-3.5S17.5 6 15.5 6H13" stroke="currentColor" stroke-opacity="0.65" stroke-width="1.5" stroke-linecap="round"/>
    `;
  } else if (/godot|gdscript|physics|jolt|multiplayer/.test(key)) {
    paths = `
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.4"/>
      <circle cx="9.5" cy="11.5" r="1.4" fill="${color}"/>
      <circle cx="14.5" cy="11.5" r="1.4" fill="${color}"/>
      <path d="M8.5 15.2c1 .9 2.2 1.3 3.5 1.3s2.5-.4 3.5-1.3" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/>
    `;
  } else if (/rust|kalman|sendinput|hooks/.test(key)) {
    paths = `
      <circle cx="12" cy="12" r="5" stroke="${color}" stroke-width="1.6"/>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" stroke="currentColor" stroke-opacity="0.6" stroke-width="1.4" stroke-linecap="round"/>
    `;
  } else if (/pak|reverse|security|auth/.test(key)) {
    paths = `
      <path d="M12 3.5 19 6.5v5.2c0 4.3-2.9 7.8-7 8.8-4.1-1-7-4.5-7-8.8V6.5l7-3Z" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="m9.5 12 1.8 1.8 3.4-3.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  } else if (/aiogram|bot|telegram|payment|donate|tribute|boosty/.test(key)) {
    paths = `
      <path d="M20 4.5 3.8 11l5.6 2.1L16.5 8l-5.3 6.1v4.4l2.9-2.8 3.7 2.2L20 4.5Z" stroke="${color}" stroke-width="1.4" stroke-linejoin="round"/>
    `;
  } else if (/remotion|esrgan|mediapipe|whisper|ffmpeg|yt-dlp/.test(key)) {
    paths = `
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" stroke-opacity="0.65" stroke-width="1.4"/>
      <polygon points="10,9.2 15.5,12 10,14.8" fill="${color}"/>
    `;
  } else if (/next|typescript|workers|netlify|edupage/.test(key)) {
    paths = `
      <rect x="4" y="5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-opacity="0.65" stroke-width="1.4"/>
      <path d="M4 9.5h16" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.2"/>
      <path d="m8.5 13 2 2-2 2M12.5 17h3" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  }

  return `<svg class="bento-stack-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">${paths}</svg>`;
}

export function renderCoverSvg(project, className = 'card-cover-svg') {
  const color = project.accent || '#f4f4f6';
  const pattern = project.pattern || 'grid';
  const uid = `${project.id}-${className}`;

  const customScenes = {
    'downloader-bot': `
      <rect x="64" y="42" width="352" height="216" rx="14" fill="#101014"/>
      <rect x="82" y="60" width="210" height="24" rx="6" fill="rgba(255,255,255,0.06)"/>
      <circle cx="94" cy="72" r="4.5" fill="${color}"/>
      <rect x="106" y="69" width="128" height="6" rx="3" fill="rgba(255,255,255,0.35)"/>
      <rect x="304" y="60" width="94" height="24" rx="12" fill="${color}" fill-opacity="0.16"/>
      <text x="351" y="76" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="600">2 GB LOCAL</text>
      <rect x="82" y="98" width="152" height="44" rx="8" fill="rgba(255,255,255,0.04)"/>
      <rect x="246" y="98" width="152" height="44" rx="8" fill="rgba(255,255,255,0.04)"/>
      <rect x="82" y="152" width="152" height="44" rx="8" fill="${color}" fill-opacity="0.14"/>
      <rect x="246" y="152" width="152" height="44" rx="8" fill="rgba(255,255,255,0.04)"/>
      <rect x="82" y="206" width="316" height="34" rx="8" fill="rgba(255,255,255,0.07)"/>
      <text x="158" y="124" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="11">360p · ~5 MB</text>
      <text x="322" y="124" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="11">480p · ~12 MB</text>
      <text x="158" y="178" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600">720p · ~24 MB</text>
      <text x="322" y="178" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="11">Audio · MP3</text>
      <text x="240" y="227" text-anchor="middle" fill="#f4f4f6" font-family="JetBrains Mono, monospace" font-size="11">Оригинал без сжатия (:8081)</text>
    `,
    'upscaler-bot': `
      <rect x="64" y="44" width="352" height="212" rx="14" fill="#101014"/>
      <rect x="82" y="64" width="150" height="172" rx="10" fill="rgba(255,255,255,0.03)"/>
      <rect x="248" y="64" width="150" height="172" rx="10" fill="${color}" fill-opacity="0.09"/>
      <rect x="108" y="96" width="98" height="98" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" stroke-dasharray="6 4"/>
      <circle cx="323" cy="145" r="44" fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-width="1.6"/>
      <path d="M304 145h38M323 126v38" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
      <text x="157" y="84" text-anchor="middle" fill="#71717a" font-family="JetBrains Mono, monospace" font-size="10">INPUT 720p</text>
      <text x="323" y="84" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="600">4x VULKAN GPU</text>
      <text x="323" y="222" text-anchor="middle" fill="#f4f4f6" font-family="JetBrains Mono, monospace" font-size="10">Real-ESRGAN · 0.7s</text>
    `,
    linguatype: `
      <rect x="58" y="46" width="364" height="208" rx="14" fill="#101014"/>
      <path d="M84 188 C130 165, 165 130, 212 138 C255 145, 290 92, 345 96 C375 98, 392 84, 398 78" stroke="${color}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="345" cy="96" r="5" fill="${color}"/>
      <rect x="82" y="66" width="110" height="32" rx="8" fill="${color}" fill-opacity="0.14"/>
      <text x="137" y="86" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">118 WPM</text>
      <rect x="82" y="206" width="145" height="28" rx="6" fill="rgba(255,255,255,0.05)"/>
      <rect x="237" y="206" width="161" height="28" rx="6" fill="rgba(255,255,255,0.05)"/>
      <text x="154" y="224" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="10">Web Workers</text>
      <text x="317" y="224" text-anchor="middle" fill="#f4f4f6" font-family="JetBrains Mono, monospace" font-size="10">Redis Lua Rank</text>
    `,
    'reverse-arena-breakout': `
      <rect x="64" y="44" width="352" height="212" rx="14" fill="#101014"/>
      <rect x="84" y="66" width="132" height="168" rx="8" fill="rgba(255,255,255,0.035)"/>
      <text x="150" y="96" text-anchor="middle" fill="#71717a" font-family="JetBrains Mono, monospace" font-size="10">RAW DUMP</text>
      <text x="150" y="138" text-anchor="middle" fill="#f4f4f6" font-family="JetBrains Mono, monospace" font-size="16" font-weight="700">4.25 ГБ</text>
      <text x="150" y="164" text-anchor="middle" fill="#71717a" font-family="JetBrains Mono, monospace" font-size="10">2 814 files</text>
      <path d="M226 150h28m-8-7 8 7-8 7" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="264" y="66" width="132" height="168" rx="8" fill="${color}" fill-opacity="0.12"/>
      <text x="330" y="96" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="600">.LOCRES / ASSETS</text>
      <text x="330" y="138" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="16" font-weight="700">63.8 МБ</text>
      <text x="330" y="164" text-anchor="middle" fill="#d4d4d8" font-family="JetBrains Mono, monospace" font-size="10">66× clean</text>
    `,
    'skillspace-crm': `
      <rect x="54" y="46" width="372" height="208" rx="14" fill="#101014"/>
      <rect x="72" y="66" width="76" height="168" rx="8" fill="rgba(255,255,255,0.035)"/>
      <rect x="158" y="66" width="76" height="168" rx="8" fill="rgba(255,255,255,0.035)"/>
      <rect x="244" y="66" width="76" height="168" rx="8" fill="${color}" fill-opacity="0.1"/>
      <rect x="330" y="66" width="76" height="168" rx="8" fill="rgba(255,255,255,0.035)"/>
      <rect x="80" y="92" width="60" height="30" rx="5" fill="rgba(255,255,255,0.08)"/>
      <rect x="80" y="128" width="60" height="30" rx="5" fill="rgba(255,255,255,0.06)"/>
      <rect x="166" y="92" width="60" height="30" rx="5" fill="rgba(255,255,255,0.08)"/>
      <rect x="252" y="92" width="60" height="36" rx="5" fill="${color}" fill-opacity="0.28"/>
      <rect x="252" y="136" width="60" height="30" rx="5" fill="rgba(255,255,255,0.08)"/>
      <rect x="338" y="92" width="60" height="30" rx="5" fill="rgba(255,255,255,0.08)"/>
      <text x="110" y="82" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="9">НОВЫЙ</text>
      <text x="196" y="82" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="9">ПРОБНЫЙ</text>
      <text x="282" y="82" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="9" font-weight="600">ОПЛАТА</text>
      <text x="368" y="82" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="9">ГРУППА</text>
    `,
    'visual-controller': `
      <rect x="64" y="44" width="352" height="212" rx="14" fill="#101014"/>
      <circle cx="176" cy="176" r="24" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-width="1.5"/>
      <path d="M162 158 L142 106 M172 152 L168 88 M182 152 L192 92 M192 160 L216 112" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="142" cy="106" r="4" fill="#f4f4f6"/>
      <circle cx="168" cy="88" r="4" fill="${color}"/>
      <circle cx="192" cy="92" r="4" fill="#f4f4f6"/>
      <circle cx="216" cy="112" r="4" fill="#f4f4f6"/>
      <rect x="256" y="76" width="138" height="36" rx="8" fill="${color}" fill-opacity="0.14"/>
      <text x="325" y="98" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">120+ FPS RUST</text>
      <rect x="256" y="124" width="138" height="34" rx="8" fill="rgba(255,255,255,0.05)"/>
      <text x="325" y="145" text-anchor="middle" fill="#f4f4f6" font-family="JetBrains Mono, monospace" font-size="10">2D Kalman &lt;30ms</text>
      <rect x="256" y="170" width="138" height="34" rx="8" fill="rgba(255,255,255,0.05)"/>
      <text x="325" y="191" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="10">VAD + Whisper</text>
    `,
    'moodle-data-tools': `
      <rect x="64" y="44" width="352" height="212" rx="14" fill="#101014"/>
      <rect x="84" y="66" width="312" height="34" rx="8" fill="${color}" fill-opacity="0.13"/>
      <text x="102" y="87" fill="${color}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600">e-university.space → Year 2/</text>
      <rect x="84" y="112" width="96" height="114" rx="8" fill="rgba(255,255,255,0.045)"/>
      <rect x="192" y="112" width="96" height="114" rx="8" fill="rgba(255,255,255,0.045)"/>
      <rect x="300" y="112" width="96" height="114" rx="8" fill="rgba(255,255,255,0.045)"/>
      <text x="132" y="168" text-anchor="middle" fill="#f4f4f6" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700">.PPTX</text>
      <text x="240" y="168" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700">.DOCX</text>
      <text x="348" y="168" text-anchor="middle" fill="#f4f4f6" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700">.XLSX</text>
    `,
    'drone-inersion': `
      <rect x="58" y="44" width="364" height="212" rx="14" fill="#101014"/>
      <path d="M80 184 Q165 130 245 156 T400 108" stroke="${color}" stroke-width="2.2" fill="none"/>
      <circle cx="245" cy="156" r="10" fill="${color}" fill-opacity="0.22" stroke="${color}" stroke-width="1.8"/>
      <line x1="226" y1="146" x2="264" y2="166" stroke="#f4f4f6" stroke-width="2" stroke-linecap="round"/>
      <rect x="82" y="66" width="96" height="26" rx="13" fill="rgba(255,255,255,0.06)"/>
      <rect x="190" y="66" width="96" height="26" rx="13" fill="rgba(255,255,255,0.06)"/>
      <rect x="298" y="66" width="96" height="26" rx="13" fill="${color}" fill-opacity="0.16"/>
      <text x="130" y="83" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="10">FOREST</text>
      <text x="238" y="83" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="10">WINTER</text>
      <text x="346" y="83" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="600">DESERT</text>
    `,
    'hell-runner-2d': `
      <rect x="58" y="44" width="364" height="212" rx="14" fill="#101014"/>
      <line x1="78" y1="210" x2="210" y2="210" stroke="rgba(255,255,255,0.22)" stroke-width="4" stroke-linecap="round"/>
      <line x1="245" y1="158" x2="395" y2="158" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <path d="M180 202 Q216 112 268 148" stroke="${color}" stroke-width="2" stroke-dasharray="5 4" fill="none"/>
      <rect x="260" y="132" width="22" height="22" rx="4" fill="${color}"/>
      <text x="148" y="82" fill="#f4f4f6" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600">JOLT PHYSICS · D3D12</text>
      <text x="148" y="102" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="10">Coyote-Time + Input Buffer</text>
    `,
    'payment-portal': `
      <rect x="64" y="44" width="352" height="212" rx="14" fill="#101014"/>
      <rect x="84" y="66" width="148" height="78" rx="10" fill="${color}" fill-opacity="0.14"/>
      <rect x="248" y="66" width="148" height="78" rx="10" fill="rgba(255,255,255,0.05)"/>
      <rect x="84" y="158" width="312" height="72" rx="10" fill="rgba(255,255,255,0.05)"/>
      <text x="158" y="102" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">СБП / МИР</text>
      <text x="158" y="122" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="10">DonatePay QR</text>
      <text x="322" y="102" text-anchor="middle" fill="#f4f4f6" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">TON / TG</text>
      <text x="322" y="122" text-anchor="middle" fill="#a1a1aa" font-family="JetBrains Mono, monospace" font-size="10">Tribute WebApp</text>
      <text x="240" y="198" text-anchor="middle" fill="#f4f4f6" font-family="JetBrains Mono, monospace" font-size="11">Boosty · Зарубежные карты · PayPal</text>
    `,
  };

  const motifs = {
    orbital: `
      <circle cx="240" cy="150" r="88" stroke="${color}" stroke-opacity="0.28" stroke-width="1.2" stroke-dasharray="4 6"/>
      <circle cx="240" cy="150" r="56" stroke="${color}" stroke-opacity="0.55" stroke-width="1.5"/>
      <circle cx="240" cy="150" r="18" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="1.5"/>
      <circle cx="328" cy="150" r="5" fill="${color}"/>
    `,
    grid: `
      <rect x="84" y="54" width="312" height="192" rx="10" stroke="${color}" stroke-opacity="0.32" stroke-width="1.2" fill="#0d0d11"/>
      <rect x="104" y="112" width="84" height="52" rx="6" fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-opacity="0.5"/>
      <rect x="200" y="112" width="176" height="22" rx="4" fill="rgba(255,255,255,0.08)"/>
      <rect x="200" y="142" width="132" height="22" rx="4" fill="rgba(255,255,255,0.05)"/>
    `,
    matrix: `
      <rect x="115" y="58" width="250" height="184" rx="8" stroke="${color}" stroke-opacity="0.35" stroke-width="1.2" fill="none"/>
      <path d="M140 150 L185 110 L235 165 L290 95 L340 135" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    `,
    waves: `
      <path d="M40 170 C120 95, 190 230, 270 140 C330 75, 390 175, 440 135" stroke="${color}" stroke-width="2" fill="none"/>
      <circle cx="270" cy="140" r="6" fill="${color}"/>
    `,
    nodes: `
      <line x1="140" y1="100" x2="240" y2="150" stroke="${color}" stroke-opacity="0.45" stroke-width="1.4"/>
      <line x1="240" y1="150" x2="345" y2="105" stroke="${color}" stroke-opacity="0.45" stroke-width="1.4"/>
      <circle cx="240" cy="150" r="22" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="1.8"/>
    `,
    bars: `
      <rect x="96" y="72" width="288" height="26" rx="5" fill="rgba(255,255,255,0.06)"/>
      <rect x="96" y="112" width="210" height="26" rx="5" fill="${color}" fill-opacity="0.22"/>
    `,
    diagonal: `
      <line x1="120" y1="260" x2="340" y2="40" stroke="${color}" stroke-width="2"/>
    `,
    hex: `
      <polygon points="240,62 316,106 316,194 240,238 164,194 164,106" fill="none" stroke="${color}" stroke-opacity="0.45" stroke-width="1.5"/>
    `,
  };

  return `
    <svg class="${className}" viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="glow-${uid}" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.14"/>
          <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
        </radialGradient>
        <pattern id="dots-${uid}" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)"/>
        </pattern>
      </defs>
      <rect width="480" height="300" fill="#09090b"/>
      <rect width="480" height="300" fill="url(#dots-${uid})"/>
      <rect width="480" height="300" fill="url(#glow-${uid})"/>
      ${customScenes[project.id] || motifs[pattern] || motifs.grid}
    </svg>
  `;
}
