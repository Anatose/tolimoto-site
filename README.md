# tolimoto.com

Brand site for Tolimoto and the Tolimoto Log app. Static, no cookies, no trackers.

- Texts: `src/i18n/<lang>.json` (en, ru, uk, et, lv, lt, pl); privacy policy bodies: `src/privacy/<lang>.html`
- Templates: `src/base.html`, `src/index.html`, `src/privacy.html`
- Build: `pip install jinja2 && python3 build.py` → writes `docs/` (served by GitHub Pages)
- Assets: `docs/assets/` (fonts are self-hosted, SIL OFL)
