# tolimoto.com — заметки для Claude Code

Сайт бренда Tolimoto: мото-канал на YouTube, приложение Tolimoto Log
(репозиторий Anatose/tolimoto-log, app.tolimoto.com), бесплатная «Таблица ТО», контакты.
GitHub Pages из папки `/docs`, домен tolimoto.com в Cloudflare (DNS only, HTTPS включён).
Владелец общается по-русски; отвечать по-русски.

## Сборка

    pip install jinja2 markupsafe
    python3 build.py        # src/ → docs/

- Править только `src/` и `docs/assets/`; HTML в `docs/` генерируется и перезаписывается.
- 7 языков: en (в корне), ru, uk, et, lv, lt, pl (папки /xx/). Тексты — `src/i18n/<lang>.json`,
  недостающие ключи берутся из en (build.py пишет, каких не хватает). Новый ключ — сразу во все 7.
- Страницы: `index.html`, `guide.html` (тело — `src/guide/<lang>.html`, оглавление по
  `<section id><h2>`), `privacy.html` (тело — `src/privacy/<lang>.html`).
- `build.py` добавляет `?v=<hash>` к style.css и site.js — иначе браузеры показывают старую версию.
- Также пишутся sitemap.xml и robots.txt. `docs/email/signature.html` — страница подписи
  для почты (noindex), собирается вручную.
- Проверять вид: `python3 -m http.server` в `docs/` + скриншот Playwright (десктоп и 390px).

## Форма «Стать тестировщиком» (#beta)

- Блок в `src/index.html`, стили в `style.css` (.beta), отправка в `site.js`.
- Принимает Google Apps Script «Tolimoto signup» в Google-аккаунте владельца (адрес — `SIGNUP`
  в build.py). Скрипт пишет адрес в таблицу «Tolimoto — тестировщики», шлёт приветствие
  с contact@tolimoto.com на 7 языках и уведомление владельцу. Код скрипта в этом репозитории
  НЕ хранится (в нём личный адрес); меняется в редакторе Apps Script, после правки —
  новая версия в Deploy → Manage deployments (URL сохраняется).
- Ответы скрипта: new / exists / invalid / consent / limit / error (лимит 40 писем в день).

## Дизайн

- Тёмная тема, оранжевый #ff6c22, синий акцент приложения #4c9aff; шрифты Dela Gothic One,
  Onest, JetBrains Mono — локально в `docs/assets/fonts`.
- Иконка сайта — T с нижней полудугой (favicon.svg); у приложения своя — T в круге.
- Разметка дороги в hero — белая. Без огромных иконок: кнопки с маленькими иконками.
  Скриншоты увеличиваются по клику, без значков лупы.
- На iPhone (iOS 26) Safari: сначала ≡ в адресной строке, потом «Поделиться» — 6 шагов.
- Эстонский: «oma kätega», не «omade».

## Правила

- Политика конфиденциальности должна совпадать с тем, что реально делают приложение и сайт.
  Новый сбор данных → сначала раздел в политике на всех языках.
- Без аналитики и cookies (обещано в политике).
- Репозиторий публичный: никаких личных данных, паролей, ключей.
- Коммиты: понятные сообщения на английском.
