/**
 * Центральный профиль, данные резюме, хабы направлений со стеками,
 * схема добавления проектов (defineProject) и 14 подробных кейсов портфолио.
 *
 * Как добавить новый проект:
 *   Вызовите `defineProject({ ... })` внутри `PROJECTS`.
 *   Укажите понятное описание (`valueProp`, `description`), `features` (функции),
 *   технические разделы (`metrics`, `architecture`, `challenges`, `modules`), `screenshots` и `hubs`.
 */

export const PROFILE_NODE = {
  id: 'profile',
  label: 'Yohanson',
  fullName: 'Kamron Nabiev',
  avatarUrl: './assets/avatar.jpg',
  handle: 'KAMRON NABIEV // YOHANSON',
  role: 'Python Full-Stack Developer · GameDeveloper · ServerAdmission',
  title: 'Python Full-Stack · GameDev · ServerAdmission',
  status: 'Open to Work',
  bio: 'Python Full-Stack Developer, GameDeveloper и ServerAdmission. Бэкенд и проектирование БД (Docker, Redis, PostgreSQL), Nginx, разработка игр (Godot 4), CyberSec и Pentest.',
  color: '#ffffff',
  accent: '#c8ff32',
  x: 0,
  y: 0,
  radius: 36,
  links: {
    github: 'https://github.com/callerfft',
    linkedin: 'https://www.linkedin.com/in/kamron-nabiev-3b59943b7',
    telegram: 'https://t.me/yfnntd',
    email: 'callerff01@gmail.com',
  },
  skills: [
    'Backend Stack: Python (FastAPI/Asyncio), Docker, Redis, PostgreSQL (Database Design)',
    'Infrastructure & Skills: Nginx, Kubernetes, ServerAdmission, Linux',
    'Bots & AI: aiogram v3, Local Bot API (2 ГБ), Real-ESRGAN, Whisper, Мультипарсинг',
    'Extra Expertise: Game Dev (Godot 4), Cybersec, Pentest, Reverse Engineering',
  ],
  domains: [
    { id: 'backend', label: 'Backend', badge: 'Docker · Redis · PostgreSQL · Nginx' },
    { id: 'cybersec', label: 'CyberSec & Reverse', badge: 'Pentest · Cybersec · Reverse' },
    { id: 'ai', label: 'AI & Vision', badge: 'Rust + CV · Real-ESRGAN · ML' },
    { id: 'web', label: 'Web & UI', badge: 'Next.js · TypeScript' },
    { id: 'gamedev', label: 'GameDev', badge: 'Godot 4 · Физика' },
    { id: 'bots', label: 'Bots & Parsing', badge: 'Telegram API · Parsing' },
    { id: 'extra', label: 'Другие проекты', badge: 'Tools · Automation' },
  ],
};

export const PROFILE = PROFILE_NODE;

/**
 * Слот под резюме (готов к замене текста или подключению PDF-файла).
 */
export const RESUME_DATA = {
  name: 'Kamron Nabiev (Yohanson)',
  role: 'Python Full-Stack Developer · GameDeveloper · ServerAdmission',
  availability: 'Open to Work · Remote / Hybrid',
  summary:
    'Python Full-Stack Developer, GameDeveloper и ServerAdmission. Проектирую серверную архитектуру и базы данных (Docker, Redis, PostgreSQL), настраиваю Nginx и продакшен-инфраструктуру, разрабатываю игры на Godot 4 и занимаюсь кибербезопасностью и пентестом.',
  pdfUrl: null, // Укажите путь (например, './assets/resume.pdf'), когда добавите файл резюме
  links: {
    github: 'https://github.com/callerfft',
    linkedin: 'https://www.linkedin.com/in/kamron-nabiev-3b59943b7',
    telegram: 'https://t.me/yfnntd',
    email: 'callerff01@gmail.com',
  },
  sections: [
    {
      title: 'Backend Stack & Infrastructure',
      items: [
        'Python (FastAPI, Asyncio, aiogram v3)',
        'Docker & Docker Compose',
        'Redis (кэш, очереди, Lua-скрипты)',
        'PostgreSQL (Database Design)',
        'Nginx (Reverse Proxy, SSL, Load Balancing)',
        'Kubernetes & ServerAdmission',
        'Мультипарсинг и антибот-обход',
      ],
    },
    {
      title: 'Extra Expertise: Cybersec & Pentest',
      items: [
        'Cybersecurity & Pentest',
        'Анализ бинарных форматов (.pak, .locres)',
        'Реверс игровых структур и протоколов (Ghidra / IDA)',
        'Исследование защищённых сессий и API',
        'Security Headers, Validation & Server Hardening',
      ],
    },
    {
      title: 'Extra Expertise: GameDev, AI & Web',
      items: [
        'Game Dev (Godot 4, GDScript 2.0, Jolt Physics)',
        'Rust Native Core (2D Kalman, SendInput)',
        'Real-ESRGAN (Vulkan GPU), MediaPipe, Whisper',
        'Next.js 14, React, TypeScript, Web Workers',
      ],
    },
  ],
};

/**
 * 7 направлений вокруг центрального узла профиля со стеками и привязками к проектам.
 */
export const HUBS = [
  {
    id: 'backend',
    label: 'Backend',
    subtitle: 'Docker · Redis · PostgreSQL · Nginx',
    color: '#22d3ee',
    x: 0,
    y: -295,
    description:
      'Серверная архитектура, проектирование PostgreSQL-схем, Redis Lua-скрипты, контейнеризация в Docker, Nginx, FastAPI-сервисы и высокопроизводительный мультипарсинг.',
    techStacks: [
      { name: 'Docker', projects: ['downloader-bot', 'upscaler-bot', 'linguatype', 'skillspace-crm', 'decay-zone-2d'] },
      { name: 'Redis / Lua', projects: ['downloader-bot', 'linguatype'] },
      { name: 'PostgreSQL (DB Design)', projects: ['skillspace-crm', 'linguatype', 'secondpage'] },
      { name: 'Nginx', projects: ['skillspace-crm', 'payment-portal', 'secondpage'] },
      { name: 'Kubernetes', projects: ['downloader-bot', 'skillspace-crm'] },
      { name: 'Python / FastAPI', projects: ['secondpage', 'downloader-bot', 'upscaler-bot', 'moodle-data-tools'] },
      { name: 'Мультипарсинг', projects: ['moodle-data-tools', 'downloader-bot', 'linguatype'] },
    ],
  },
  {
    id: 'web',
    label: 'Web & UI',
    subtitle: 'Next.js · TypeScript',
    color: '#60a5fa',
    x: 245,
    y: -185,
    description:
      'Реактивные веб-платформы, CRM-системы, оценка компетенций на Netlify Functions, платёжные шлюзы и интерфейсы с Web Workers.',
    techStacks: [
      { name: 'Next.js / React', projects: ['skillspace-crm', 'ai-series-studio'] },
      { name: 'TypeScript', projects: ['skillspace-crm', 'linguatype', 'ai-series-studio'] },
      { name: 'Remotion / SVG', projects: ['ai-series-studio'] },
      { name: 'Netlify / esbuild', projects: ['skillspace-test'] },
      { name: 'Web Workers', projects: ['linguatype'] },
      { name: 'Payment / WebApps', projects: ['payment-portal', 'timetable'] },
    ],
  },
  {
    id: 'bots',
    label: 'Bots & Parsing',
    subtitle: 'Telegram API · Queues',
    color: '#38bdf8',
    x: 310,
    y: 65,
    description:
      'Полноценные Telegram-боты с монетизацией, локальный Bot API для файлов до 2 ГБ, GPU-апскейл и асинхронный сбор данных.',
    techStacks: [
      { name: 'aiogram v3', projects: ['downloader-bot', 'upscaler-bot'] },
      { name: 'Local Bot API (2 ГБ)', projects: ['downloader-bot'] },
      { name: 'Asyncio / Parsing', projects: ['downloader-bot', 'moodle-data-tools'] },
      { name: 'yt-dlp / FFmpeg', projects: ['downloader-bot', 'upscaler-bot'] },
    ],
  },
  {
    id: 'extra',
    label: 'Другие проекты',
    subtitle: 'Утилиты · Инструменты',
    color: '#fb923c',
    x: 145,
    y: 265,
    description:
      'Прикладные веб-сервисы, офлайн-переводчики документов, платёжные порталы и инструменты автоматизации.',
    techStacks: [
      { name: 'python-docx / lxml', projects: ['secondpage', 'moodle-data-tools'] },
      { name: 'EduPage / GitHub Actions', projects: ['timetable'] },
      { name: 'DonatePay / Tribute / Boosty', projects: ['payment-portal'] },
      { name: 'Remotion / FFmpeg Video', projects: ['ai-series-studio'] },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Vision',
    subtitle: 'Rust + CV · Real-ESRGAN',
    color: '#34d399',
    x: -145,
    y: 265,
    description:
      'Нейросетевой апскейл фото и видео на GPU, компьютерное зрение реального времени (Rust + Python), Whisper, AI-сериалы на Remotion и локальный ML-перевод.',
    techStacks: [
      { name: 'Real-ESRGAN (Vulkan GPU)', projects: ['upscaler-bot'] },
      { name: 'Rust + 2D Kalman', projects: ['visual-controller'] },
      { name: 'MediaPipe / OpenCV', projects: ['visual-controller'] },
      { name: 'VAD + Whisper + Argos', projects: ['visual-controller', 'secondpage', 'ai-series-studio'] },
      { name: 'Remotion + ElevenLabs', projects: ['ai-series-studio'] },
    ],
  },
  {
    id: 'cybersec',
    label: 'CyberSec & Reverse',
    subtitle: 'Binary · Security · R&D',
    color: '#a78bfa',
    x: -310,
    y: 65,
    description:
      'Кибербезопасность, реверс-инжиниринг бинарных форматов Unreal Engine, разбор сессионной защиты и харденинг веб-контуров.',
    techStacks: [
      { name: 'Reverse Engineering', projects: ['reverse-arena-breakout', 'moodle-data-tools'] },
      { name: 'UE4 .pak / .locres', projects: ['reverse-arena-breakout'] },
      { name: 'Security Headers / Auth', projects: ['skillspace-test', 'moodle-data-tools'] },
      { name: 'SendInput / OS Hooks', projects: ['visual-controller'] },
    ],
  },
  {
    id: 'gamedev',
    label: 'GameDev',
    subtitle: 'Godot 4 · Физика',
    color: '#c8ff32',
    x: -245,
    y: -185,
    description:
      'Игры и физические симуляции на Godot 4, Jolt Physics, кастомные шейдеры и исследование игровых движков.',
    techStacks: [
      { name: 'Godot 4', projects: ['decay-zone-2d', 'cosmo-inersion', 'drone-inersion', 'hell-runner-2d'] },
      { name: 'GDScript 2.0', projects: ['decay-zone-2d', 'cosmo-inersion', 'drone-inersion', 'hell-runner-2d'] },
      { name: 'Physics & Jolt / Shaders', projects: ['decay-zone-2d', 'cosmo-inersion', 'drone-inersion', 'hell-runner-2d'] },
      { name: 'Multiplayer & Extraction', projects: ['decay-zone-2d'] },
    ],
  },
];

/**
 * Эталонная схема объекта проекта для удобного расширения портфолио.
 */
export const PROJECT_TEMPLATE = {
  id: 'example-project',
  index: '00',
  title: 'Example Project',
  hubs: ['backend'],
  categoryLabel: 'Backend',
  year: '2026',
  status: 'Active',
  role: 'Lead Engineer',
  tagline: 'Короткое понятное описание сути проекта.',
  originReason: 'Личная боль или практическая задача, из-за которой появился проект.',
  valueProp: 'Зачем нужен этот продукт и какую задачу пользователя он решает.',
  description: 'Понятное описание проекта для любого посетителя.',
  features: [{ title: 'Функция', detail: 'Как она помогает пользователю' }],
  stack: ['Tech 1', 'Tech 2'],
  metrics: [{ label: 'Метрика', value: 'Значение' }],
  architecture: [{ stage: 'Layer', detail: 'Ответственность слоя и поток данных' }],
  challenges: [{ problem: 'Инженерное ограничение', solution: 'Применённое решение' }],
  highlights: ['Ключевой результат'],
  modules: ['src/'],
  screenshots: [],
  uiPreview: null,
  links: [],
  bentoSpan: 'bento-span-6',
  accent: '#22d3ee',
  pattern: 'nodes',
  previewMode: 'network',
  repoPath: '../example',
};

/**
 * Фабрика создания проекта с валидацией и безопасными значениями по умолчанию.
 */
export function defineProject(spec) {
  if (!spec || !spec.id || !spec.title) {
    throw new Error('[defineProject] Проект обязан содержать id и title');
  }
  const hubs = Array.isArray(spec.hubs) && spec.hubs.length > 0 ? spec.hubs : ['extra'];
  return {
    ...PROJECT_TEMPLATE,
    ...spec,
    hubs,
    features: Array.isArray(spec.features) ? spec.features : [],
    stack: Array.isArray(spec.stack) ? spec.stack : [],
    metrics: Array.isArray(spec.metrics) ? spec.metrics : [],
    architecture: Array.isArray(spec.architecture) ? spec.architecture : [],
    challenges: Array.isArray(spec.challenges) ? spec.challenges : [],
    highlights: Array.isArray(spec.highlights) ? spec.highlights : [],
    modules: Array.isArray(spec.modules) ? spec.modules : [],
    screenshots: Array.isArray(spec.screenshots) ? spec.screenshots : [],
    links: Array.isArray(spec.links) ? spec.links : [],
  };
}

export const PROJECTS = [
  defineProject({
    id: 'downloader-bot',
    index: '01',
    title: 'Media Downloader Bot',
    hubs: ['bots', 'backend'],
    categoryLabel: 'Telegram Bot / Media',
    year: '2025',
    status: 'Production',
    role: 'Backend & Telegram Bot Architect',
    tagline: 'Скачивание видео без водяных знаков (TikTok, YouTube, Reels, VK) до 2 ГБ прямо в Telegram.',
    originReason:
      'Устал от рекламы, всплывающих окон и обязательных подписок на сомнительные каналы у чужих ботов-загрузчиков — сделал свой чистый инструмент без спама и с лимитом до 2 ГБ.',
    valueProp:
      'Позволяет любому пользователю в 2 клика сохранить видео, Shorts, Reels или музыку из соцсетей без рекламы, сомнительных сайтов и водяных знаков — включая тяжёлые ролики до 2 ГБ, которые обычные боты отправить не могут.',
    description:
      'Бот принимает ссылку на видео (TikTok, YouTube, Instagram, VK, X/Twitter, Reddit, Pinterest), заранее оценивает вес каждого качества и показывает наглядные кнопки. Благодаря собственному локальному серверу Telegram Bot API обходит стандартное ограничение Telegram в 50 МБ в 40 раз — до 2000 МБ.',
    features: [
      { title: 'Без водяных знаков', detail: 'Чистая загрузка видео из TikTok и Instagram Reels в исходном HD-качестве.' },
      { title: 'Выбор качества и веса заранее', detail: 'Бот мгновенно оценивает битрейт и пишет примерный вес файла прямо на кнопках (360p, 480p, 720p, Оригинал).' },
      { title: 'Только звук в MP3', detail: 'Быстрая вырезка аудиодорожки из любого ролика через FFmpeg без лишнего скачивания картинки.' },
      { title: 'Обход лимита 50 МБ → 2 ГБ', detail: 'Собственный локальный сервер telegram-bot-api на порту 8081 позволяет слать фильмы и длинные видео.' },
      { title: 'Premium-лимиты и админ-панель', detail: 'База пользователей на SQLite, учёт квот, история загрузок и команды администратора (/profile, /admin).' },
    ],
    stack: ['Python 3.10+', 'aiogram 3.20+', 'Local Bot API', 'yt-dlp', 'FFmpeg', 'aiosqlite', 'Redis', 'Docker'],
    metrics: [
      { label: 'Лимит файла', value: 'До 2000 МБ (2 ГБ)' },
      { label: 'Площадки', value: '7 соцсетей + MP3' },
      { label: 'Bot API', value: ':8081 (--local)' },
    ],
    architecture: [
      { stage: '01. Bot Gateway', detail: 'aiogram 3.20+ (роутинг ссылок, FSM-админка, чистые сообщения без цитирования).' },
      { stage: '02. Media Engine', detail: 'yt-dlp извлекает потоки и метаданные веса; FFmpeg ремуксирует видео или извлекает MP3.' },
      { stage: '03. Local Bot API', detail: 'Нативный бинарник telegram-bot-api.exe считывает FSInputFile прямо с диска до 2 ГБ.' },
      { stage: '04. Database & Infra', detail: 'aiosqlite хранит подписки Premium и счётчики; Docker + Redis масштабируют воркеры.' },
    ],
    challenges: [
      {
        problem: 'Обычный Telegram Bot API жёстко режет отправку файлов больше 50 МБ.',
        solution: 'Поднят локальный сервер telegram-bot-api в режиме --local, что расширило предел до 2 ГБ без передачи по внешним шлюзам.',
      },
      {
        problem: 'Пользователь нажимает кнопку качества вслепую и тратит мобильный трафик на огромный файл.',
        solution: 'Встроен префетч битрейта и длительности, отображающий расчётный размер на каждой inline-кнопке.',
      },
    ],
    highlights: [
      'Отправка файлов до 2 ГБ через собственный локальный Telegram Bot API',
      'Предварительный расчёт размера файла в МБ на каждой кнопке качества',
      'Поддержка TikTok (без watermark), YouTube, Reels, VK, X, Reddit и Pinterest',
    ],
    modules: ['DownloaderBot/main.py', 'bot/services/downloader.py', 'bot/handlers/download.py', 'telegram-bot-api-server/'],
    uiPreview: {
      title: 'Интерфейс кнопок DownloaderBot',
      header: '@MediaDownloaderBot · Ссылка распознана',
      body: 'YouTube Video · 12:40 · Выберите формат:',
      buttons: [
        ['360p (~5.0 МБ)', '480p (~12.5 МБ)'],
        ['720p (~24.0 МБ)', 'Только аудио (MP3 ~3.8 МБ)'],
        ['Оригинал без сжатия (~185 МБ) [Premium]'],
      ],
    },
    bentoSpan: 'bento-span-7',
    accent: '#38bdf8',
    pattern: 'nodes',
    previewMode: 'network',
    repoPath: '../TelegramBots/DownloaderBot',
  }),

  defineProject({
    id: 'upscaler-bot',
    index: '02',
    title: 'UpscalerBot (AI GPU)',
    hubs: ['bots', 'ai', 'backend'],
    categoryLabel: 'Telegram Bot / Neural GPU',
    year: '2025',
    status: 'Production',
    role: 'AI Pipeline & Bot Developer',
    tagline: 'Нейросетевое улучшение фото и видео до 4K на GPU (Real-ESRGAN) прямо в Telegram.',
    originReason:
      'Не хотелось платить за платные онлайн-сервисы и подписки ради простого улучшения фото или видео — развернул собственный GPU Real-ESRGAN прямо в Telegram.',
    valueProp:
      'Превращает размытые, сжатые мессенджерами или старые фотографии и короткие видео в чёткие 4x HD-изображения и обои 1080p прямо в чате — без установки сложных нейросетей на компьютер.',
    description:
      'Бот на aiogram 3 с очередью задач на GPU (Vulkan / Real-ESRGAN NCNN). Обрабатывает как фото (удаление артефактов JPEG, чёткий лайн-арт, умное кадрирование обоев 1920×1080), так и видео по кадрам с сохранением исходного звука. Встроена система бесплатных попыток, кредитов и админ-панель.',
    features: [
      { title: '2x Быстрый апскейл (~0.7 сек)', detail: 'Модель realesr-animevideov3 с 2 бесплатными попытками для каждого нового пользователя.' },
      { title: '4x Фото HD и 4x Арт', detail: 'Отдельные нейромодели (realesrgan-x4plus и anime) для деталей лиц/текстур и чистых контуров графики.' },
      { title: 'Обои 1920×1080', detail: 'Интеллектуальное кадрирование + Lanczos-подгонка любой картинки под экран без искажений.' },
      { title: 'Покадровый апскейл видео 2x/4x', detail: 'FFmpeg разбивает видео на кадры, GPU прогоняет через Real-ESRGAN и собирает H.264 с оригинальным аудио.' },
      { title: 'Готовая монетизация и админка', detail: 'Кредиты, VIP-подписки, команды /profile, /tariffs, /boost и интерактивная панель управления /admin.' },
    ],
    stack: ['Python 3.10+', 'aiogram 3', 'Real-ESRGAN Vulkan', 'FFmpeg', 'Pillow', 'aiosqlite', 'GPU Queue'],
    metrics: [
      { label: 'Скорость 2x', value: '~0.7 сек на фото' },
      { label: 'Увеличение', value: '2x / 4x Фото и Видео' },
      { label: 'Рендер-ядро', value: 'NCNN Vulkan GPU' },
    ],
    architecture: [
      { stage: '01. Intake & Billing', detail: 'Проверка квот пользователя (2 бесплатных 2x, кредиты или VIP) в SQLite (aiosqlite).' },
      { stage: '02. GPU Queue', detail: 'Асинхронная очередь задач защищает видеокарту от перегрузки при одновременных запросах.' },
      { stage: '03. Real-ESRGAN Engine', detail: 'Локальный инференс моделей realesrgan-x4plus, animevideov3 или Smart Обои 1080p.' },
      { stage: '04. Dual Delivery', detail: 'Отдача быстрого превью в чат + оригинального результата документом без сжатия Telegram.' },
    ],
    challenges: [
      {
        problem: 'При одновременной отправке нескольких 4x-фото или видео падает память GPU.',
        solution: 'Реализована управляемая асинхронная очередь queue.py с ограничением параллельных задач и лимитом до 4096px.',
      },
      {
        problem: 'Telegram автоматически сжимает отправленные картинки и портит результат апскейла.',
        solution: 'Бот выдаёт результат парой: быстрое превью в ленту и несжатый оригинал отдельным файлом-документом.',
      },
    ],
    highlights: [
      'Апскейл и фото (2x, 4x Photo, 4x Art, 1080p), и видео (2x/4x с сохранением звука)',
      'Выдача результата без потери качества отдельным файлом',
      'Полная система тарифов, кредитов, VIP и управления администраторами',
    ],
    modules: ['UpscalerBot/main.py', 'services/upscaler.py', 'services/video.py', 'services/queue.py', 'database/db.py'],
    uiPreview: {
      title: 'Меню режимов UpscalerBot',
      header: '@UpscalerAIBot · Фото получено (720×1280 · 184 КБ)',
      body: 'Выберите режим нейросетевого улучшения (Доступно 2x бесплатно: 2):',
      buttons: [
        ['2x Быстрый (~0.7с)', '4x Фото HD (1 кредит)'],
        ['4x Арт / Аниме', 'Обои 1920×1080'],
        ['Мой профиль и тарифы'],
      ],
    },
    bentoSpan: 'bento-span-5',
    accent: '#06b6d4',
    pattern: 'matrix',
    previewMode: 'vision',
    repoPath: '../TelegramBots/UpscalerBot',
  }),

  defineProject({
    id: 'linguatype',
    index: '03',
    title: 'LangType Platform',
    hubs: ['backend', 'web', 'extra'],
    categoryLabel: 'Backend / Web',
    year: '2025',
    status: 'Production',
    role: 'Full-Stack & Backend Engineer',
    tagline: 'Платформа изучения языков и слепой печати: мгновенный расчёт WPM, рейтинги на Redis и AI-анализ.',
    originReason:
      'Хотелось совместить тренировку слепой печати с изучением реальной иностранной лексики, нулевой задержкой интерфейса и честными глобальными рейтингами.',
    valueProp:
      'Помогает тренировать скорость и точность печати с нулевой задержкой интерфейса, соревноваться в глобальных рейтингах и изучать лексику на реальных языковых корпусах.',
    description:
      'Полноценное веб-приложение и масштабируемый бэкенд в едином монорепозитории (pnpm + Turborepo). Клиент мгновенно считает скорость и статистику ошибок, а сервер хранит глобальные лидерборды на атомарных Lua-скриптах Redis и проверяет качество текстов.',
    features: [
      { title: 'Нулевая задержка печати', detail: 'Тяжёлый подсчёт WPM, графика точности и разбор ошибок вынесены из главного потока в фоновые потоки.' },
      { title: 'Моментальные лидерборды', detail: 'Позиция игрока и рекорды рассчитываются прямо внутри памяти Redis через Lua-скрипты.' },
      { title: 'Умный подбор слов и корпусов', detail: 'Конвейер мультипарсинга и скрипты анализа частоты слов формируют сбалансированные тренировки.' },
      { title: 'Контроль безопасности и квот', detail: 'Строгая серверная валидация результатов, OpenAPI-контракты и защита от накруток.' },
    ],
    stack: ['TypeScript', 'Docker Compose', 'Redis / Lua', 'OpenAPI', 'Vitest', 'Python', 'Turborepo', 'Мультипарсинг'],
    metrics: [
      { label: 'Монорепо', value: 'pnpm + Turborepo' },
      { label: 'Лидерборды', value: 'Redis Lua-скрипты' },
      { label: 'Тест-покрытие', value: 'Vitest + Pytest' },
    ],
    architecture: [
      { stage: '01. Frontend Core', detail: 'Клиент на TypeScript + Vite с вынесенным расчётом WPM/метрик в Web Workers.' },
      { stage: '02. API & Contracts', detail: 'Типизированный backend (@monkeytype/backend) со схемой openapi.ts и проверкой квот.' },
      { stage: '03. Redis Lua Engine', detail: 'Атомарные скрипты add-result.lua, get-rank.lua и purge-results.lua для рейтингов.' },
      { stage: '04. Evaluation Suite', detail: 'Python-пайплайн analyze_corpus.py, test_latency_benchmark.py и closed-loop тесты.' },
    ],
    challenges: [
      {
        problem: 'Гонки данных и задержки при одновременной отправке результатов в общую таблицу лидеров.',
        solution: 'Инкременты и вычисление ранга перенесены в атомарные Lua-скрипты внутри Redis.',
      },
    ],
    highlights: [
      'Атомарные Lua-скрипты в Redis для мгновенного ранжирования пользователей',
      'Оркестрация сервисов через Docker Compose (compose.yml)',
      'Автотесты производительности, безопасности и квот на Vitest + Pytest',
    ],
    modules: ['backend/compose.yml', 'backend/*.lua', 'backend/openapi.ts', 'backend/analyze_corpus.py'],
    bentoSpan: 'bento-span-6',
    accent: '#fb923c',
    pattern: 'grid',
    previewMode: 'telemetry',
    repoPath: '../LangType',
  }),

  defineProject({
    id: 'reverse-arena-breakout',
    index: '04',
    title: 'Arena Breakout R&D',
    hubs: ['cybersec'],
    categoryLabel: 'CyberSec / Reverse',
    year: '2025',
    status: 'Research',
    role: 'Reverse & Data Engineer',
    tagline: 'Исследование и распаковка мобильного клиента Arena Breakout: очистка 4.25 ГБ до 63.8 МБ и поиск .locres.',
    originReason:
      'Для разработки собственной 2D-игры понадобились реальные характеристики оружия, таблицы лута и тексты локализации из оригинального клиента без лишних гигабайтов мобильных шейдеров.',
    valueProp:
      'Позволяет разработчикам и исследователям извлечь чистые таблицы предметов, характеристики оружия и тексты локализации из огромного Android-дампа игры без многогигабайтного мусора.',
    description:
      'Реверс-инжиниринг Android-клиента Arena Breakout (Unreal Engine 4). Из 2 814 файлов общим весом 4.25 ГБ отсеяны мобильные шейдеры и зашифрованные бинарные архивы, написан парсер локализаций и сформирована чистая база игровых данных (~63.8 МБ) для использования в 2D-движке Godot.',
    features: [
      { title: 'Аудит 2 814 файлов UE4', detail: 'Полная инвентаризация структуры Android-сборки, архивов .pak/.sig и кэшей видеодрайверов Adreno/Mali.' },
      { title: 'Парсер текстов search_locres.py', detail: 'Поиск и извлечение игровых названий, описаний и таблиц прямо из бинарных файлов локализации.' },
      { title: 'Оптимизация веса в 66 раз', detail: 'Удалены 4.18 ГБ нерелевантного кэша, оставлены только полезные таблицы, иконки и спецификации.' },
    ],
    stack: ['Reverse Engineering', 'UE4 .pak / .locres', 'Binary Analysis', 'Python', 'Ghidra / IDA', 'Game Assets'],
    metrics: [
      { label: 'Сжатие дампа', value: '4.25 ГБ → 63.8 МБ' },
      { label: 'Очищено кэша', value: '~4.18 ГБ' },
      { label: 'Файлов изучено', value: '2 814 файлов' },
    ],
    architecture: [
      { stage: '01. Client Dump Audit', detail: 'Инвентаризация 2 814 файлов мобильного Android-клиента Unreal Engine 4.' },
      { stage: '02. Cache Pruning', detail: 'Отделение shader-кэшей (binarycache.sqlite, Adreno/Mali) и dlc-паков.' },
      { stage: '03. Locres Parsing', detail: 'Скрипт search_locres.py для индексации и извлечения таблиц предметов из .locres.' },
      { stage: '04. Asset Export', detail: 'Каталог из ~63.8 МБ чистых данных и спецификаций для Godot 4.' },
    ],
    challenges: [
      {
        problem: 'Исходный дамп клиента весил 4.25 ГБ и содержал тысячи ненужных мобильных шейдеров.',
        solution: 'Системно отделены GPU-кэши и cooked-блоки, оставлено ~63.8 МБ структурированных игровых ресурсов.',
      },
    ],
    highlights: [
      'Собственный скрипт search_locres.py для разбора бинарной локализации UE4',
      'Освобождено 4.18 ГБ лишних бинарных данных с сохранением всей полезной базы предметов',
    ],
    modules: ['search_locres.py', 'DOCUMENTATION.md', 'extracted/', 'данные из арены/'],
    bentoSpan: 'bento-span-6',
    accent: '#a78bfa',
    pattern: 'hex',
    previewMode: 'binary',
    repoPath: '../reverse arena breakout',
  }),

  defineProject({
    id: 'skillspace-crm',
    index: '05',
    title: 'SkillSpace CRM',
    hubs: ['web', 'backend'],
    categoryLabel: 'Web / CRM System',
    year: '2026',
    status: 'Active',
    role: 'Full-Stack Architect',
    tagline: 'CRM для учебного центра: канбан заявок, запись на пробные уроки, группы и журнал посещаемости.',
    originReason:
      'В учебном центре заявки с сайта и из Telegram терялись в таблицах Excel и личных переписках — потребовалась единая CRM под три рабочие роли без лишнего перегруза.',
    valueProp:
      'Заменяет хаос в Excel и мессенджерах на единую систему управления учебным центром: менеджеры ведут клиентов до оплаты, администратор собирает группы, а преподаватель отмечает посещаемость.',
    description:
      'Веб-платформа для skillspace.uz на Next.js 14 и TypeScript с разделением под 3 рабочие роли. Каждый сотрудник видит только нужные ему инструменты без лишнего информационного мусора.',
    features: [
      { title: 'Канбан-доска менеджера продаж', detail: 'Ведение заявки по 5 этапам: Новый → Связались → Пробный урок → Готов оплатить → Оплачено.' },
      { title: 'Быстрый контакт в 1 клик', detail: 'Мгновенный переход к звонку или в Telegram-чат клиента и фиксация причины отказа.' },
      { title: 'Управление группами и оплатами', detail: 'Администратор подтверждает поступление средств и зачисляет студента в учебный поток.' },
      { title: 'Журнал преподавателя', detail: 'Отметка посещаемости занятий и прозрачная картина вовлечённости группы.' },
    ],
    stack: ['Next.js 14', 'React 18', 'TypeScript', 'Zod', 'Tailwind CSS', 'Node.js', 'Docker'],
    metrics: [
      { label: 'Ролевой контур', value: '3 роли доступа' },
      { label: 'Воронка лидов', value: '5 этапов Kanban' },
      { label: 'Валидация', value: 'Strict TS + Zod' },
    ],
    architecture: [
      { stage: '01. Lead Engine', detail: 'Приём заявок с сайта skillspace.uz и Telegram в единую входящую очередь.' },
      { stage: '02. Sales Kanban', detail: 'Воронка статусов с назначением даты и времени пробного урока.' },
      { stage: '03. Admin & Groups', detail: 'Подтверждение оплаты и формирование расписания групп.' },
      { stage: '04. Teacher Journal', detail: 'Журнал посещаемости и контроль успеваемости.' },
    ],
    challenges: [
      {
        problem: 'Смешанные таблицы заявок, расписаний и оплат тормозили работу команды.',
        solution: 'Спроектирован ролевой интерфейс на Next.js 14 + Zod с изолированными сценариями для каждой роли.',
      },
    ],
    highlights: [
      'Чёткая ролевая модель Sales, Admin и Teacher без лишних экранов',
      'Интеграция воронки заявок с сайта и Telegram в единый канбан',
    ],
    modules: ['src/', 'data/', 'scripts/', 'PROJECT_ROADMAP_AND_SPECS.md'],
    bentoSpan: 'bento-span-6',
    accent: '#60a5fa',
    pattern: 'grid',
    previewMode: 'telemetry',
    repoPath: '../SkillSpaceCRM',
  }),

  defineProject({
    id: 'visual-controller',
    index: '06',
    title: 'VisualController',
    hubs: ['ai', 'cybersec'],
    categoryLabel: 'AI / Rust Native',
    year: '2026',
    status: 'Core Engine',
    role: 'Systems & CV Engineer',
    tagline: 'Управление Windows без мыши: трекинг рук на 120+ FPS (Rust + MediaPipe) и голосовые команды Whisper.',
    originReason:
      'Хотелось управлять компьютером на расстоянии без мыши и клавиатуры, но обычные решения на веб-камере страдали от сильного дрожания курсора и задержек.',
    valueProp:
      'Позволяет управлять компьютером на расстоянии жестами и голосом — как сенсорным тачпадом в воздухе: двигать курсор без дрожания, кликать, листать окна и надиктовывать текст.',
    description:
      'Гибридная система компьютерного зрения и нативного ввода. Камера через MediaPipe отслеживает 21 точку ладони, быстрое ядро на Rust сглаживает микротремор фильтром Калмана и управляет курсором Windows с задержкой меньше 30 мс, а голосовой движок Whisper распознаёт команды и диктовку.',
    features: [
      { title: 'Курсор без дрожания рук', detail: '2D фильтр Калмана на Rust + Stationary Jitter Lock фиксируют курсор при клике по мелким кнопкам.' },
      { title: 'Полный набор жестов руки', detail: 'ЛКМ и ПКМ щипком, Drag&Drop, плавный 2D скроллинг двумя пальцами и свайпы рабочих столов Win+Tab/Win+D.' },
      { title: 'Краевое скольжение (Edge Motion)', detail: 'Позволяет дотянуться до любого края экрана без усталости кисти.' },
      { title: 'Голосовой ассистент (VAD + Whisper)', detail: 'Распознавание речи, голосовые команды и озвучивание ответов (TTS).' },
      { title: 'Пресеты чувствительности и автозапуск', detail: 'Удобный дашборд CustomTkinter с режимами «Плавный», «Быстрый», «Точный» и иконкой в трее.' },
    ],
    stack: ['Rust', '2D Kalman Filter', 'Python 3.10+', 'MediaPipe Tasks', 'OpenCV', 'Whisper + VAD', 'CustomTkinter', 'SendInput'],
    metrics: [
      { label: 'Частота ядра', value: '120+ FPS (Rust)' },
      { label: 'Задержка кадра', value: '< 30 мс' },
      { label: 'Фильтрация', value: 'Kalman + Schmitt' },
    ],
    architecture: [
      { stage: '01. Vision Tracker', detail: 'MediaPipe Tasks + OpenCV захватывает 21 ключевую точку кисти с веб-камеры.' },
      { stage: '02. Rust Native Core', detail: '2D Kalman-фильтр, Stationary Jitter Lock и триггер Шмитта.' },
      { stage: '03. OS Input Layer', detail: 'Windows SendInput с суб-миллисекундной задержкой и Edge Motion.' },
      { stage: '04. Voice & Tray UI', detail: 'VAD + Whisper + TTS и интерфейс управления в системном трее Windows.' },
    ],
    challenges: [
      {
        problem: 'При чтении или попытке попасть в маленькую кнопку курсор от камеры постоянно вибрировал.',
        solution: 'Внедрены Stationary Jitter Lock и двухпороговый триггер Шмитта на уровне ядра Rust.',
      },
    ],
    highlights: [
      '120+ FPS нативное ядро на Rust с нулевым оверхедом по памяти',
      'Жесты мыши, 2D-скролл, системные хоткеи и голосовой ввод Whisper в одном приложении',
    ],
    modules: ['native/', 'python/', 'models/hand_landmarker.task', 'tests/'],
    bentoSpan: 'bento-span-6',
    accent: '#34d399',
    pattern: 'matrix',
    previewMode: 'vision',
    repoPath: '../VisualController',
  }),

  defineProject({
    id: 'moodle-data-tools',
    index: '07',
    title: 'UniMoodle Data Tools',
    hubs: ['backend', 'bots', 'cybersec', 'extra'],
    categoryLabel: 'Backend / Parsing',
    year: '2025',
    status: 'Active Tool',
    role: 'Automation & Security Developer',
    tagline: 'Автовыгрузка всех лекций, презентаций и Excel-заданий с университетского портала Moodle в 1 запуск.',
    originReason:
      'Надоело вручную открывать десятки вложенных вкладок на учебном портале и по одной скачивать презентации и Excel-файлы — автоматизировал сбор всего семестра одной командой.',
    valueProp:
      'Экономит студентам часы ручного прокликивания сотен вкладок Moodle: скрипт сам заходит в личный кабинет, отделяет актуальный 2-й курс от старого архива и аккуратно раскладывает презентации, PDF и таблицы по папкам.',
    description:
      'Парсер портала e-university.space на Python (Requests + BeautifulSoup4). Автоматически обходит вложенную иерархию модулей, кэширует структуру курсов в JSON и выгружает материалы в структурированный локальный архив.',
    features: [
      { title: 'Автосортировка по годам обучения', detail: 'Сам отличает актуальные предметы 2-го курса от архивных дисциплин Foundation.' },
      { title: 'Пакетное скачивание всех форматов', detail: 'Выгружает презентации PPTX, документы DOCX, учебники и решения задач в XLSX.' },
      { title: 'Кэш каталога курсов', detail: 'Сохраняет индекс материалов в courses.json без повторного обхода всего портала.' },
    ],
    stack: ['Python 3.10+', 'Requests', 'BeautifulSoup4', 'python-docx', 'python-pptx', 'openpyxl', 'Мультипарсинг'],
    metrics: [
      { label: 'Портал', value: 'e-university.space' },
      { label: 'Форматы', value: 'DOCX · PPTX · XLSX' },
      { label: 'Сортировка', value: 'По курсам и годам' },
    ],
    architecture: [
      { stage: '01. Session Auth', detail: 'Поддержание авторизованной сессии с учебным порталом.' },
      { stage: '02. DOM Crawler', detail: 'Парсинг модулей и ссылок через BeautifulSoup4.' },
      { stage: '03. Year Classifier', detail: 'Отделение актуальных дисциплин от архива 1-го курса.' },
      { stage: '04. Archive Packaging', detail: 'Разложение файлов по папкам предметов и упаковка в ZIP.' },
    ],
    challenges: [
      {
        problem: 'В личном кабинете вперемешку лежат десятки завершённых и текущих курсов с глубокой вложенностью.',
        solution: 'Написан классификатор курсов и асинхронная выгрузка ресурсов по единой структуре.',
      },
    ],
    highlights: [
      'Сборка всей базы учебных материалов семестра одной командой',
      'Поддержка парсинга и генерации DOCX, PPTX и XLSX',
    ],
    modules: ['moodle_downloader.py', 'scripts/', 'courses.json', 'requirements.txt'],
    bentoSpan: 'bento-span-6',
    accent: '#22d3ee',
    pattern: 'hex',
    previewMode: 'binary',
    repoPath: '../uniMoodleData',
  }),

  defineProject({
    id: 'secondpage',
    index: '08',
    title: 'BMU SecondPage Translator',
    hubs: ['backend', 'ai', 'extra'],
    categoryLabel: 'Backend / Offline ML',
    year: '2026',
    status: 'Release .EXE',
    role: 'Backend & Desktop Engineer',
    tagline: 'Локальный переводчик Word-документов: после каждой английской страницы вставляет русскую с сохранением формул.',
    originReason:
      'Онлайн-переводчики ломали таблицы и формулы в англоязычных учебниках, а экзаменационные файлы нельзя было отправлять в облако — сделал полностью офлайн-переводчик с сохранением вёрстки.',
    valueProp:
      'Идеально для студентов и преподавателей: загружаешь англоязычный учебник или экзаменационный буклет .docx и получаешь готовый билингвальный файл «EN Стр. 1 → RU Стр. 1», не теряя ни таблиц, ни формул, ни приватности (без интернета).',
    description:
      'Сервис на FastAPI + ArgosTranslate, который работает полностью локально на ПК пользователя (без облачных ключей и утечек данных). Упакован в автономный BMU_SecondPage.exe: запускается в 1 клик и открывает удобный веб-интерфейс в стиле Dropbox.',
    features: [
      { title: 'Билингвальный формат «Стр. EN → Стр. RU»', detail: 'Вставляет переведённую страницу сразу за оригиналом — удобно сверять термины и формулы.' },
      { title: 'Сохранение сложной вёрстки Word', detail: 'Точечно переводит текст в таблицах, формулах, картинках и колонтитулах без поломки стилей.' },
      { title: '100% офлайн на вашем ПК', detail: 'Машинный перевод ArgosTranslate выполняется локально — работает без интернета и API-лимитов.' },
      { title: 'Запуск из .EXE в 1 клик', detail: 'Преподавателю не нужно ставить Python: BMU_SecondPage.exe сам разворачивает окружение и открывает браузер.' },
    ],
    stack: ['FastAPI', 'Uvicorn', 'ArgosTranslate', 'python-docx', 'lxml', 'pywin32', 'Pytest'],
    metrics: [
      { label: 'Приватность', value: '100% Offline ML' },
      { label: 'Структура', value: 'EN → RU построчно' },
      { label: 'Сборка', value: 'BMU_SecondPage.exe' },
    ],
    architecture: [
      { stage: '01. Web UI & API', detail: 'FastAPI + Uvicorn (127.0.0.1:8000) с drag-and-drop загрузкой .docx.' },
      { stage: '02. XML/DOCX Parser', detail: 'Разбор и точечная подмена XML-узлов через python-docx, lxml и pywin32.' },
      { stage: '03. Local Neural Engine', detail: 'Офлайн-пакеты ArgosTranslate (EN → RU) внутри процесса.' },
      { stage: '04. Page Interleaver', detail: 'Постраничная сборка чередующегося документа.' },
    ],
    challenges: [
      {
        problem: 'Онлайн-переводчики ломают формулы, сдвигают таблицы и отправляют закрытые экзаменационные файлы в облако.',
        solution: 'Собран локальный конвейер на XML-уровне и ArgosTranslate, упакованный в единый EXE.',
      },
    ],
    highlights: [
      'Точное сохранение таблиц, формул и колонтитулов Word (.docx)',
      'Автономный BMU_SecondPage.exe без необходимости настройки Python',
    ],
    modules: ['app/main.py', 'app/services/docx_translator.py', 'app/services/pipeline.py', 'package_project.py'],
    screenshots: [
      { src: 'assets/screenshots/secondpage-1.webp', caption: 'Веб-интерфейс загрузки и перевода .docx (BMU SecondPage)' },
      { src: 'assets/screenshots/secondpage-2.webp', caption: 'Пример переведённой русской страницы (Page 2) с сохранённым логотипом и вёрсткой' },
    ],
    bentoSpan: 'bento-span-6',
    accent: '#38bdf8',
    pattern: 'waves',
    previewMode: 'network',
    repoPath: '../SecondPage',
  }),

  defineProject({
    id: 'skillspace-test',
    index: '09',
    title: 'Skill Space Assessment',
    hubs: ['web', 'backend', 'cybersec'],
    categoryLabel: 'Web / Serverless',
    year: '2026',
    status: 'Production',
    role: 'Full-Stack & Serverless Engineer',
    tagline: 'Онлайн-платформа психометрического тестирования (360°, MBTI, кейсы SJT) с защитой от накрутки.',
    originReason:
      'Обычные тесты кандидатов легко обмануть «правильными» социально желаемыми ответами — нужен был инструмент, который отсекает неискренность и проверяет реакции на реальных кейсах.',
    valueProp:
      'Помогает HR-специалистам и учебным центрам объективно оценить софт-скиллы, стиль мышления и поведение кандидата в рабочих кейсах — с автоматическим отсечением «социально желательных» нечестных ответов.',
    description:
      'Веб-платформа оценки компетенций на Netlify Functions и @netlify/blobs. Содержит 200+ психометрических вопросов (70% прямых и 30% инвертированных для проверки искренности), 15 ситуационных кейсов (SJT) и профиль новичка/ветерана.',
    features: [
      { title: 'Радар навыков и экспресс-скрининг 360°', detail: 'Оценка сразу 10 тематических модулей компетенций в одном профиле.' },
      { title: 'Детектор искренности (30% обратных вопросов)', detail: 'Инвертированные шкалы и сбалансированная рандомизация отсекают социально одобряемую ложь.' },
      { title: 'Ситуационные кейсы (SJT)', detail: '15 практических сценариев с проверкой реальных реакций кандидата на собеседовании.' },
      { title: 'Защищённый Serverless-контур', detail: 'Netlify Functions + @netlify/blobs, жёсткие HTTP Security Headers и хэшированный бандл esbuild.' },
    ],
    stack: ['Netlify Functions', '@netlify/blobs', 'esbuild', 'JavaScript', 'Node Test Runner', 'Security Headers'],
    metrics: [
      { label: 'Банк заданий', value: '200 вопр. + 15 SJT' },
      { label: 'Бэкенд', value: 'Netlify Functions' },
      { label: 'Сборка', value: 'esbuild (hashed)' },
    ],
    architecture: [
      { stage: '01. Build Pipeline', detail: 'esbuild формирует контент-хэшированные бандлы JS/CSS с immutable кэшем.' },
      { stage: '02. Edge Security', detail: 'netlify.toml задаёт X-Frame-Options, nosniff, Referrer-Policy.' },
      { stage: '03. Serverless API', detail: 'Netlify Functions + @netlify/blobs для сессий и подсчёта профиля.' },
      { stage: '04. Test Runner', detail: 'node --test проверяет базу вопросов и авторизацию.' },
    ],
    challenges: [
      {
        problem: 'Браузеры пользователей кэшировали старые JS-скрипты и базу вопросов после обновлений.',
        solution: 'Внедрена раздельная политика кэширования: HTML (must-revalidate) + контент-хэшированные ассеты.',
      },
    ],
    highlights: [
      '200 вопросов по 10 модулям компетенций и 15 ситуационных кейсов',
      'Бессерверная архитектура на Netlify Functions + @netlify/blobs',
    ],
    modules: ['build.js', 'netlify/functions/', 'netlify.toml', 'tests/', 'data_questions.json'],
    screenshots: [
      { src: 'assets/screenshots/skillspace-test-1.webp', caption: 'Платформа оценки компетенций и психометрического скрининга 360°' },
    ],
    bentoSpan: 'bento-span-6',
    accent: '#818cf8',
    pattern: 'matrix',
    previewMode: 'telemetry',
    repoPath: '../skill space test',
  }),

  defineProject({
    id: 'cosmo-inersion',
    index: '10',
    title: 'Cosmo Inertia',
    hubs: ['gamedev'],
    categoryLabel: 'GameDev / Android',
    year: '2026',
    status: 'Android Release Ready',
    role: 'Godot 4 Developer',
    tagline: 'Мобильная космическая аркада с честной ньютоновской гравитацией, 24 секторами и апгрейдами корабля.',
    originReason:
      'Хотелось сделать мобильную игру для Android с настоящей орбитальной физикой и гравитационными манёврами вместо примитивного управления по рельсам.',
    valueProp:
      'Захватывающая физическая игра под Android: выключай двигатели, лови гравитационные манёвры вокруг планет и двойных звёзд, экономь топливо и мягко садись на посадочную площадку.',
    description:
      'Полноценная мобильная игра на Godot 4, подготовленная к релизу в Google Play (com.cosmoinertia.game). Включает 24 уникальных сектора кампании, бесконечный режим волн, магазин апгрейдов (топливо, тяга, щиты, кастомизация корабля) и интуитивное тач-управление.',
    features: [
      { title: '24 сектора кампании + Endless Waves', detail: 'Двойные звёзды, астероидные коридоры, орбитальные станции дозаправки и доставка грузов.' },
      { title: 'Честная гравитация и инерция', detail: 'Траектория корабля реально искривляется полями тяготения Сатурна, Титана и соседних тел.' },
      { title: 'Магазин апгрейдов и скинов', detail: 'Прокачка бака (Fuel), тяги (Thrust), управляемости (Handling), щита (Shield) и аэродинамики.' },
      { title: 'Готовность к Google Play', detail: 'Экран safe-area под вырезы смартфонов, haptic-отклик, AdMob-интеграция и материалы Store Listing.' },
    ],
    stack: ['Godot 4', 'GDScript 2.0', 'Shaders', 'Custom Resources', 'Android SDK'],
    metrics: [
      { label: 'Кампания', value: '24 сектора' },
      { label: 'Режимы', value: 'Campaign + Wave Mode' },
      { label: 'Платформа', value: 'Android (Google Play)' },
    ],
    architecture: [
      { stage: '01. Orbital Physics', detail: 'Расчёт гравитационных колодцев, импульса и безопасной скорости касания.' },
      { stage: '02. Progression', detail: '24 сектора кампании и процедурные волны Endless Wave Mode.' },
      { stage: '03. Hangar Economy', detail: 'Система улучшений и кастомизации за игровые кредиты.' },
    ],
    challenges: [
      {
        problem: 'Сложность точной посадки на сенсорном экране при сильном гравитационном притяжении.',
        solution: 'Добавлены визуальная дуга прогноза траектории, HUD скорости (VEL m/s) и двухсторонний тач-контроль.',
      },
    ],
    highlights: [
      '24 авторских сектора и бесконечный режим волн',
      'Реальные скриншоты магазина улучшений, орбиты Сатурна и Титана',
    ],
    modules: ['project.godot', 'resources/', 'assets/store/', 'android/', 'STORE_LISTING.md'],
    screenshots: [
      { src: 'assets/screenshots/cosmo-2.webp', caption: 'Sector 19: Saturn & Titan — гравитационный манёвр и телеметрия топлива' },
      { src: 'assets/screenshots/cosmo-3.webp', caption: 'Shop & Upgrades — прокачка топливного бака, тяги, щита и корпуса' },
      { src: 'assets/screenshots/cosmo-4.webp', caption: 'Sector 12: Event Horizon — траектория спуска между гравитационными полями' },
    ],
    bentoSpan: 'bento-span-7',
    accent: '#c8ff32',
    pattern: 'orbital',
    previewMode: 'orbital',
    repoPath: '../cosmo inersion',
  }),

  defineProject({
    id: 'drone-inersion',
    index: '11',
    title: 'Drone Inertia',
    hubs: ['gamedev'],
    categoryLabel: 'GameDev / Physics',
    year: '2026',
    status: 'Mobile Build',
    role: 'Godot 4 Developer',
    tagline: 'Физический симулятор дрона на Godot 4.7 с реалистичной аэродинамикой, сменой биомов и сохранениями.',
    originReason:
      'Было интересно перенести честную инерцию, ветровой снос и балансировку тяги дрона в лёгкую мобильную игру, стабильно работающую даже на бюджетных смартфонах.',
    valueProp:
      'Даёт прочувствовать реальную физику и инерцию полёта дрона над разными локациями (лес, зима, пустыня) с наземной бронетехникой и плавным мобильным управлением.',
    description:
      'Мобильный проект в Full HD (1920×1080) на Godot 4.7 (GL Compatibility для максимального охвата Android-устройств). Построен на чистых сервисах автозагрузки SoundManager, SaveManager и MonetizationManager.',
    features: [
      { title: 'Физика инерции роторов', detail: 'Реалистичный снос ветром, вес груза и балансировка тяги по осям.' },
      { title: 'Три тематических биома', detail: 'Готовые наборы спрайтов техники и окружения для пустыни, леса и зимы.' },
      { title: 'Независимый HUD на сигналах', detail: 'Аудио, сохранения прогресса и рекламный менеджер вынесены в модульные Autoload-сервисы.' },
    ],
    stack: ['Godot 4.7', 'GDScript 2.0', 'GL Compatibility', 'Android SDK'],
    metrics: [
      { label: 'Движок', value: 'Godot 4.7 (GL)' },
      { label: 'Разрешение', value: '1920 x 1080' },
      { label: 'Биомы', value: 'Forest · Winter · Desert' },
    ],
    architecture: [
      { stage: '01. Rotor Dynamics', detail: 'Физическая модель тяги, массы и сноса.' },
      { stage: '02. Autoload Services', detail: 'SoundManager, SaveManager, MonetizationManager.' },
      { stage: '03. Signal UI', detail: 'Реактивное обновление HUD без прямой связки со сценой физики.' },
    ],
    challenges: [
      {
        problem: 'Стабильный FPS на бюджетных Android-смартфонах.',
        solution: 'Использован рендерер GL Compatibility и оптимизированные 2D-атласы.',
      },
    ],
    highlights: [
      'Модульная архитектура Autoload и строгая статическая типизация GDScript 2.0',
      'Три биома с проработанным транспортом (BMP, Tank, Truck, BMPT)',
    ],
    modules: ['project.godot', 'scripts/managers/', 'scenes/', 'assets/sprites/', 'android/'],
    bentoSpan: 'bento-span-5',
    accent: '#f59e0b',
    pattern: 'waves',
    previewMode: 'drone',
    repoPath: '../drone-inersion',
  }),

  defineProject({
    id: 'hell-runner-2d',
    index: '12',
    title: 'HellRunner 2D',
    hubs: ['gamedev'],
    categoryLabel: 'GameDev',
    year: '2025',
    status: 'Prototype',
    role: 'Gameplay Engineer',
    tagline: 'Скоростной платформер на Godot 4.6 (Jolt Physics / D3D12) с точными таймингами и грид-инвентарём.',
    originReason:
      'В 2D-платформерах часто раздражают несработавшие прыжки на краю платформы — захотелось отработать максимально отзывчивое управление с input-буфером и coyote-time.',
    valueProp:
      'Динамичная игра на реакцию с чётким управлением (прыжок срабатывает без раздражающих задержек даже на долю секунды до касания платформы) и продуманной системой лута.',
    description:
      'Прототип экшен-платформера на базе Godot 4.6 с физическим движком Jolt Physics и рендером Forward Plus (Direct3D 12). Архитектура сцен и баллистических моделей стандартизирована в документах GamesDocs.',
    features: [
      { title: 'Отзывчивый Input-буфер и Coyote-Time', detail: 'Персонаж прощает миллисекунды на краю платформы — управление ощущается максимально чётким.' },
      { title: 'Физика Jolt Physics', detail: 'Стабильные столкновения и предсказуемое поведение объектов на высокой скорости.' },
      { title: 'Спецификации баллистики и лута', detail: 'Интеграция моделей данных из R&D Arena Breakout для сеточного инвентаря и урона.' },
    ],
    stack: ['Godot 4.6', 'GDScript 2.0', 'Jolt Physics', 'Forward Plus / D3D12'],
    metrics: [
      { label: 'Движок', value: 'Godot 4.6' },
      { label: 'Физика', value: 'Jolt Physics' },
      { label: 'Рендер', value: 'Forward Plus (D3D12)' },
    ],
    architecture: [
      { stage: '01. Movement Controller', detail: 'Input-буфер и точный контроль импульса прыжка.' },
      { stage: '02. Jolt Physics', detail: 'Надёжная обработка коллизий на высокой скорости.' },
      { stage: '03. Game Specs', detail: 'Стандартизированные шаблоны инвентаря и боя в GamesDocs.' },
    ],
    challenges: [
      {
        problem: 'Потеря отзывчивости управления в быстрых прыжках у края препятствий.',
        solution: 'Настроен входной буфер и фиксированный шаг физики Jolt.',
      },
    ],
    highlights: [
      'Jolt Physics + Forward Plus D3D12 в Godot 4.6',
      'Ресурсная совместимость со структурой данных Arena Breakout R&D',
    ],
    modules: ['project.godot', 'AGENTS.md', '../GamesDocs/'],
    bentoSpan: 'bento-span-6',
    accent: '#fb7185',
    pattern: 'diagonal',
    previewMode: 'runner',
    repoPath: '../hell-runner-2d',
  }),

  defineProject({
    id: 'timetable',
    index: '13',
    title: 'BMU TimeTable',
    hubs: ['extra', 'web'],
    categoryLabel: 'Tools / Education',
    year: '2025',
    status: 'Live Web',
    role: 'Web & Automation Developer',
    tagline: 'Навигатор расписания BMU: за 2 секунды находит свободный кабинет на 2–5 этажах или пары группы.',
    originReason:
      'Надоело вручную искать пустые кабинеты в унике между парами через неудобный на телефоне официальный EduPage — автоматизировал поиск свободных аудиторий за 2 секунды.',
    valueProp:
      'Решает ежедневную боль студентов и преподавателей университета: больше не нужно гадать, свободна ли лекционная или компьютерная аудитория — сайт сам показывает занятость в реальном времени и каждое утро обновляется с EduPage.',
    description:
      'Лёгкий веб-навигатор British Management University (Ташкент) без тяжёлых фреймворков. Показывает сетку всех пар недели, загрузку конкретных кабинетов (в процентах) и мгновенный список свободных комнат с фильтром по этажам.',
    features: [
      { title: 'Поиск свободной аудитории сейчас', detail: 'Моментально делит все кабинеты на свободные и занятые по текущему дню и паре (или выбранному слоту).' },
      { title: 'Фильтры по этажам и типам', detail: 'Выбор этажа (2–5 эт.) и типа комнаты: Лекционные, Компьютерные, Семинарские.' },
      { title: 'Расписание по учебным группам', detail: 'Цветная сетка дисциплин (2MIS1 и др.) с указанием преподавателя и аудитории.' },
      { title: 'Автообновление каждое утро', detail: 'GitHub Actions каждое буднее утро в 08:00 запускает Python-парсер EduPage и обновляет базу.' },
    ],
    stack: ['Vanilla JS', 'Python', 'GitHub Actions', 'EduPage Sync', 'JSON Data', 'CSS3'],
    metrics: [
      { label: 'Автосинк', value: 'Пн–Пт 08:00 CI' },
      { label: 'Охват', value: '2–5 этажи BMU' },
      { label: 'Старт', value: 'Zero runtime deps' },
    ],
    architecture: [
      { stage: '01. EduPage Scraper', detail: 'update_timetable.py выгружает свежие слоты расписания.' },
      { stage: '02. CI Cron', detail: 'GitHub Actions автоматически пересобирает timetable_data.js в 08:00.' },
      { stage: '03. Instant Filter UI', detail: 'Клиент моментально фильтрует аудитории и группы без запросов к БД.' },
    ],
    challenges: [
      {
        problem: 'Официальный портал EduPage неудобен на телефоне, когда нужно срочно найти пустой кабинет между парами.',
        solution: 'Собран статический SPA-навигатор с кнопкой «Свободные аудитории» и процентом загрузки кабинета.',
      },
    ],
    highlights: [
      'Ежедневная автосинхронизация с EduPage через GitHub Actions',
      'Реальный рабочий интерфейс для студентов университета',
    ],
    modules: ['update_timetable.py', 'timetable_data.js', 'app.js', '.github/workflows/'],
    screenshots: [
      { src: 'assets/screenshots/timetable-1.webp', caption: 'Расписание аудиторий и поиск свободных комнат (BMU TimeTable)' },
    ],
    bentoSpan: 'bento-span-6',
    accent: '#94a3b8',
    pattern: 'bars',
    previewMode: 'schedule',
    repoPath: '../TimeTable',
  }),

  defineProject({
    id: 'payment-portal',
    index: '14',
    title: 'Payment Portal & Gateway',
    hubs: ['web', 'extra'],
    categoryLabel: 'Web / FinTech UI',
    year: '2026',
    status: 'Live Static',
    role: 'Frontend Engineer',
    tagline: 'Универсальная страница оплаты и донатов (СБП, карты РФ/зарубежные, PayPal, TON) без бэкенда.',
    originReason:
      'Из-за ограничений разных платёжных систем нельзя было принимать оплату и поддержку из любой страны через один виджет — объединил РФ-карты, СБП, Telegram TON и зарубежные карты на одном экране.',
    valueProp:
      'Позволяет принимать оплату и поддержку из любой страны мира на одной красивой странице: пользователь сам выбирает удобный способ — СБП по QR, Tribute в Telegram или Boosty для зарубежных карт.',
    description:
      'Лёгкий статический платёжный портал, готовый к публикации на GitHub Pages за 1 минуту. Объединяет встроенный виджет DonatePay (МИР, Visa, СБП, ЮMoney), переход в Tribute Telegram WebApp (TON и СБП без комиссии) и Boosty со встроенным QR-кодом.',
    features: [
      { title: 'СБП, карты РФ и зарубежные карты', detail: 'Тройная маршрутизация платежей через DonatePay, Tribute и Boosty охватывает любые банки и PayPal.' },
      { title: 'Оплата в 1 тап через Telegram (Tribute)', detail: 'Прямая ссылка в WebApp для быстрых переводов и TON прямо внутри мессенджера.' },
      { title: 'QR-код для смартфона', detail: 'Встроенный QR на Boosty позволяет моментально отсканировать и оплатить с экрана ПК.' },
      { title: 'Нулевые затраты на сервер', detail: 'Чистый HTML/CSS/JS хостится бесплатно на GitHub Pages с моментальной загрузкой.' },
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'DonatePay Widget', 'Tribute WebApp', 'GitHub Pages'],
    metrics: [
      { label: 'Шлюзы', value: 'DonatePay · Tribute · Boosty' },
      { label: 'Способы', value: 'СБП · МИР · PayPal · TON' },
      { label: 'Хостинг', value: 'GitHub Pages' },
    ],
    architecture: [
      { stage: '01. Channel Router', detail: 'Выбор между локальными (СБП/МИР) и зарубежными (PayPal/Boosty) шлюзами.' },
      { stage: '02. Checkout UI', detail: 'Встроенный виджет DonatePay с пресетами сумм и QR Boosty.' },
    ],
    challenges: [
      {
        problem: 'Ограничения отдельных платёжных систем не позволяют принимать оплату со всех стран на одном виджете.',
        solution: 'Объединены три взаимодополняющих шлюза на минималистичном статическом экране.',
      },
    ],
    highlights: [
      'Приём платежей из РФ, СНГ и зарубежья (PayPal / TON / СБП)',
      'Мгновенный деплой на GitHub Pages без серверной инфраструктуры',
    ],
    modules: ['index.html', 'app.js', 'style.css', 'assets/boosty_qr.png'],
    uiPreview: {
      title: 'Маршруты оплаты Payment Gateway',
      header: 'Поддержка открытых продуктов · 256-bit SSL',
      body: 'Три способа оплаты из любой точки мира на одном экране:',
      buttons: [
        ['DonatePay · СБП QR / МИР / ЮMoney'],
        ['Tribute · Telegram Pay / TON', 'Boosty · Зарубежные карты / PayPal'],
      ],
    },
    bentoSpan: 'bento-span-6',
    accent: '#10b981',
    pattern: 'grid',
    previewMode: 'telemetry',
    repoPath: '../payment',
  }),

  defineProject({
    id: 'ai-series-studio',
    index: '15',
    title: 'AI Series Studio («Нулевой Сбой» & «Последний Навык»)',
    hubs: ['ai', 'web', 'extra'],
    categoryLabel: 'AI Video / Remotion Engine',
    year: '2026',
    status: '7 Episodes Rendered',
    role: 'Technical Director & Systems Architect',
    tagline:
      'Автономная 2.5D/2D-студия кодовой анимации на Remotion и React: два sci-fi сериала с покадровой физикой, Whisper-таймингами и 60 FPS рендером.',
    originReason:
      'Обычная нейрогенерация видео страдала от искажений персонажей и потери контроля над сценой — решил собирать целые вертикальные сериалы кодом на Remotion с точной покадровой синхронизацией.',
    valueProp:
      'Позволяет собирать целые вертикальные sci-fi сериалы для Shorts, Reels и TikTok на чистом коде — без нейросетевых видео-артефактов: каждый жест персонажа, наезд камеры, вспышка света и субтитр синхронизированы по кадрам с речью и звуком.',
    description:
      'Производственный видео-движок на базе Remotion (React 19 + TypeScript + SVG + Canvas 2.5D), объединяющий два авторских сериала: «Нулевой Сбой» (Zero Fault — 7 готовых серий о блэкауте и ИИ Коре в Бункере-7) и спин-офф «Последний Навык» (The Last Skill — техно-триллер 2049 года о выживании с оффлайн-базой Skill Space). Каждая сцена изолирована в модули, валидируется Pre-Render Gate (gate.mjs) и рендерится в 1080×1920 @ 60 FPS.',
    features: [
      {
        title: 'Сериал «Нулевой Сбой» (Zero Fault — 7 серий)',
        detail: 'Законченный цикл эпизодов Episode01_Final–Episode07_Final.mp4: детективный sci-fi про блэкаут, криптографические улики, Бункер-7 и диалоги с ИИ Кором.',
      },
      {
        title: 'Сериал «Последний Навык» (The Last Skill)',
        detail: 'Кинематографический вертикальный спин-офф 9:16: герой Марк перепрограммирует дронов Омни-Сети (Hunter-4 / Unit H-04) с помощью наручного терминала Skill Space.',
      },
      {
        title: 'Whisper-синхронизация и караоке-триггеры',
        detail: 'Тайминги речи пересчитываются в целочисленные кадры (60 FPS); теги keyword и punch автоматически запускают поп-ин иконки, микро-зум и смену эмоций рига.',
      },
      {
        title: 'Модульный SVG-риг и живой город',
        detail: '8–10 фиксированных эмоций героя, контровой свет (backlight halo), параллакс слоёв 0.2 / 1.0 / 1.6, мерцающие окна, прожекторы дронов и частицы дождя/пыли.',
      },
      {
        title: '4-слойный звук и Pre-Render Gate',
        detail: 'Процедурная генерация SFX/BGM на Python (build_sfx.py, build_bgm.py), ElevenLabs-озвучка, дакинг до −3 dB и автопроверка детерминизма (scripts/gate.mjs) перед рендером.',
      },
    ],
    metrics: [
      { label: 'Готовые серии', value: '7+ MP4 (1080×1920)' },
      { label: 'Частота кадров', value: '60 FPS (Frame-locked)' },
      { label: 'Pre-Render Gate', value: '8 автопроверок' },
    ],
    architecture: [
      {
        stage: '1. Storyboard & Timing',
        detail: 'Сценарии и раскадровки из STORY_BIBLE.md / storyboard/, квантование слов из whisperTiming.json в точные кадры.',
      },
      {
        stage: '2. SceneStage & Rig',
        detail: 'Параллакс-сцены <SceneStage> с палитрой lightingWorld.ts, 3px контурами и модульным персонажем <ModularCharacter>.',
      },
      {
        stage: '3. Audio & Gate Check',
        detail: 'Сборка 3–4 дорожек звука (BGM, SFX, Ambience, Voice) через <Sequence> и прогон детерминизм-гейта scripts/gate.mjs.',
      },
      {
        stage: '4. Remotion Render',
        detail: 'Финальный рендер композиций в 1080×1920 MP4 без случайных Math.random() и CSS transitions.',
      },
    ],
    challenges: [
      {
        problem: 'Обычный CSS transition и Math.random() при headless-рендере Remotion вызывали рассинхрон и дёрганые кадры.',
        solution: 'Введён строгий Pre-Render Gate (scripts/gate.mjs), разрешающий только детерминированные spring()/interpolate() и remotion.random(seed).',
      },
      {
        problem: 'Примитивный палочный стикмен и тёмный фон убивали читаемость сцен на экранах смартфонов.',
        solution: 'Создана система 3px контуров, контрового ореола героя, 8–10 эмоций рига и стандарта детальной архитектуры окон/дронов.',
      },
    ],
    highlights: [
      'Два полноценных авторских sci-fi сериала с единой кодовой архитектурой',
      'Детерминированный рендер 1080×1920 @ 60 FPS на React 19 + Remotion 4',
      'Интеграция Whisper JSON таймингов, ElevenLabs голосов и процедурного SFX-дизайна',
    ],
    modules: [
      'src/episodes/episode-01..07/',
      'src/episodes/last-skill/',
      'src/components/stage/SceneStage.tsx',
      'src/components/character/ModularCharacter.tsx',
      'scripts/gate.mjs',
      'scripts/audio/build_sfx.py',
    ],
    screenshots: [
      { src: 'assets/screenshots/ai-series-cover.webp', caption: 'Раскадровка двух ИИ-сериалов: Последний Навык (9:16) и Нулевой Сбой (Ep07)' },
      { src: 'assets/screenshots/ai-series-last-skill.webp', caption: 'Сериал «Последний Навык»: захват цели боевым дроном Hunter-4 на выпускном (9:16)', portrait: true },
      { src: 'assets/screenshots/ai-series-drone-lock.webp', caption: 'Сериал «Последний Навык»: патрульный дрон Unit H-04 и субтитры по Whisper (9:16)', portrait: true },
      { src: 'assets/screenshots/ai-series-zero-fault.webp', caption: 'Сериал «Нулевой Сбой» (Ep07): сцена с Claude Code и критическим патчем (9:16)', portrait: true },
    ],
    bentoSpan: 'bento-span-6',
    accent: '#f59e0b',
    pattern: 'matrix',
    previewMode: 'vision',
    repoPath: '../../Videos/ии сериалы',
  }),

  defineProject({
    id: 'decay-zone-2d',
    index: '16',
    title: 'Decay Zone (Arena Breakout 2D)',
    hubs: ['gamedev'],
    categoryLabel: 'GameDev / Extraction',
    year: '2026',
    status: 'Active Alpha',
    role: 'Lead Game & Systems Developer',
    tagline:
      'Тактический 2D top-down extraction-шутер в духе Arena Breakout на Godot 4.7.2: мультиплеер, баллистика, 7-зонная модель урона и убежище.',
    originReason:
      'Захотелось перенести напряжённый тактический extraction-геймплей в духе Arena Breakout в лёгкий 2D top-down формат с выделенным мультиплеерным сервером и убежищем.',
    valueProp:
      'Полноценная 2D-реализация хардкорного extraction-геймплея с выделенным headless-сервером, сетевой синхронизацией лута/рейдов, 7-зонным здоровьем и крафтом в убежище.',
    description:
      'Самостоятельный игровой проект на Godot 4.7.2 Stable (Forward Plus, Jolt Physics 2D) с модульной архитектурой из 21 Autoload-синглтона. Поддерживает клиент-серверный мультиплеер через CLI-флаги (--server --port=7777 --map=factory) и Docker, CCD-баллистику пуль через пулы, grid-инвентарь, экономику (Market & Insurance) и редактор мобильного управления.',
    features: [
      {
        title: '7-зонная модель урона и CCD-баллистика',
        detail: 'Раздельный расчёт попаданий по 7 частям тела, бронепробитие, кровотечения и оптимизированный BulletPool / ObjectPool.',
      },
      {
        title: 'Выделенный мультиплеерный сервер',
        detail: 'Авторитетная серверная логика на Godot (--server --port=7777 --map=factory) и контейнеризация через Dockerfile.',
      },
      {
        title: 'Grid-инвентарь, лутинг и эвакуация',
        detail: 'Сеточный инвентарь, тактический обзор FOV/наклон (lean), интерактивная карта Factory и точки выхода из рейда.',
      },
      {
        title: 'Убежище (Hideout), рынок и квесты',
        detail: 'Системы HideoutManager, MarketManager, InsuranceManager и QuestManager для прогрессии между вылазками.',
      },
      {
        title: 'Тестовое покрытие 56 сьютов',
        detail: 'Автотесты боевой физики, сетевых менеджеров, экономики и инвентаря (423 кейса в 56 тестовых наборах).',
      },
    ],
    stack: ['Godot 4.7.2', 'GDScript 2.0', 'Jolt Physics 2D', 'Multiplayer Server', 'Docker', 'TouchLayoutEditor'],
    metrics: [
      { label: 'Архитектура', value: '21 Autoload' },
      { label: 'Тесты', value: '56 suites · 423 кейса' },
      { label: 'Рендер / Физика', value: 'Forward+ · Jolt 2D' },
    ],
    architecture: [
      {
        stage: '01. Core & Pooled Combat',
        detail: 'GameManager, InputRouter, BulletPool и ObjectPool для стабильного FPS при перестрелках и спавне лута.',
      },
      {
        stage: '02. Server & Sync',
        detail: 'NetworkManager и CLI-сервер (--server --map=factory) с авторитетной валидацией урона и эвакуации.',
      },
      {
        stage: '03. Meta Progression',
        detail: 'HideoutManager, ItemDatabase, MarketManager, InsuranceManager и QuestManager.',
      },
    ],
    challenges: [
      {
        problem: 'Сложная синхронизация десятков интерактивных предметов, пулевых трасс и видимости игроков (FOV) в 2D-рейде.',
        solution: 'Использованы пулы объектов (BulletPool/ObjectPool), выделенный InputRouter и строгая авторитетная валидация на стороне сервера.',
      },
    ],
    highlights: [
      '21 модульный Autoload-синглтон: от MapDatabase до InsuranceManager и QuestManager',
      'Полноценный headless multiplayer-сервер в Docker с запуском по карте (--map=factory)',
      'Кастомный TouchLayoutEditor для адаптации тактического HUD под сенсорные экраны',
    ],
    modules: [
      'autoloads/ (21)',
      'scenes/raid/',
      'scenes/hideout/',
      'scripts/TouchLayoutEditor.gd',
      'tests/ (56 suites)',
      'Dockerfile',
    ],
    screenshots: [
      { src: 'assets/screenshots/decay-zone-1.webp', caption: 'Тактический рейд в Decay Zone: FOV, наклон из-за укрытий и прицеливание' },
      { src: 'assets/screenshots/decay-zone-2.webp', caption: 'Убежище (Hideout): крафт модулей, верстаки и управление хранилищем' },
      { src: 'assets/screenshots/decay-zone-3.webp', caption: 'Тактическая карта Factory: зоны лута, спавны и точки эвакуации' },
    ],
    bentoSpan: 'bento-span-6',
    accent: '#c8ff32',
    pattern: 'tactical',
    previewMode: 'physics',
    repoPath: '../../arena-breakout-2d',
  }),
];
