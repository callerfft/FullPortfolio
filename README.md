# Yohanson — Интерактивное портфолио

Интерактивное портфолио и карта инженерных стеков **Kamron Nabiev (Yohanson)**.  
Реализовано как чистое статическое веб-приложение без этапа сборки: граф направлений и проектов на HTML5 Canvas, 3-колоночный Bento-каталог и подробные карточки кейсов.

## Профиль и специализация

- **Role:** Python Full-Stack Developer, GameDeveloper, ServerAdmission
- **Backend Stack:** Docker, Redis, PostgreSQL (Database Design), Python (FastAPI, Asyncio, aiogram v3), Node.js
- **Skills:** Nginx, Kubernetes, мультипарсинг
- **Extra Expertise:** Game Dev (Godot 4), Cybersec, Pentest, Reverse Engineering

## Основные возможности

- **Интерактивный граф (Obsidian-style Canvas):** центральный узел профиля с радиальными хабами (`Backend`, `Web & UI`, `Bots & Parsing`, `CyberSec & Reverse`, `AI & Vision`, `GameDev`, `Другие проекты`), плавный pan/zoom и подсветка связей.
- **Переключатель режимов `Проекты / Стеки`:** граф и нижний Bento-каталог переключаются между просмотром 16 проектов и картой технологий, показывающей, где применяется каждый стек.
- **Детальные карточки проектов:** ценность, ключевые функции, архитектура, инженерные задачи, метрики, модули репозитория и лайтбокс скриншотов.
- **Резюме и контакты:** встроенные модальные окна с резюме (поддержка подключения PDF через `RESUME_DATA.pdfUrl` в `data/projects.js`) и быстрым копированием контактов.

## Структура проекта

```text
.
├── assets/
│   ├── avatar.jpg              # Аватар профиля для интро-карточки и центрального узла
│   └── screenshots/            # WebP-скриншоты проектов
├── data/
│   └── projects.js             # PROFILE_NODE, RESUME_DATA, HUBS и 16 проектов (PROJECTS)
├── scripts/
│   ├── app.js                  # Инициализация UI, маршрутизация кейсов, модалки и фильтры
│   ├── background3d.js         # Лёгкий 2D-фон с предрасчитанными сферами глубины и орбитами
│   ├── bentoGrid.js            # 3-колоночная Bento-сетка для режимов «Проекты» и «Стеки»
│   ├── covers.js               # Генерация SVG-обложек проектов
│   ├── effects.js              # Lenis scroll, GSAP-магнитизм, дешифровка текста [data-scramble]
│   ├── graphCanvas.js          # Холст интерактивного графа
│   └── livePreview.js          # Живое превью в карточке узла
├── styles/
│   ├── tokens.css              # CSS-переменные и палитра
│   ├── main.css                # Основные стили интерфейса
│   └── transitions.css         # View Transitions и анимации переходов
├── test/
│   └── verify.js               # Автоматические проверки (341 тест)
├── index.html                  # Точка входа
└── package.json                # Скрипты dev и test
```

## Локальный запуск и проверка

```bash
# Локальный сервер (вариант 1)
npm run dev

# Локальный сервер (вариант 2)
python -m http.server 4173

# Запуск автотестов целостности
npm test
```

## Деплой на GitHub Pages

Проект полностью статический и использует относительные пути, поэтому работает на GitHub Pages без сервера и сборщика:

1. Откройте **Settings -> Pages** в репозитории `FullPortfolio`.
2. В **Build and deployment** выберите **Source: Deploy from a branch**.
3. Укажите ветку `main` и директорию `/ (root)`, нажмите **Save**.
4. Сайт будет доступен по адресу `https://callerfft.github.io/FullPortfolio/`.

## Контакты

- **GitHub:** https://github.com/callerfft
- **LinkedIn:** https://www.linkedin.com/in/kamron-nabiev-3b59943b7
- **Telegram:** https://t.me/yfnntd
- **Email:** callerff01@gmail.com
