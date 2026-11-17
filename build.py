#!/usr/bin/env python3
"""Builds tolimoto.com into docs/: one folder per language, English at the root.

    python3 build.py

Texts live in src/i18n/<lang>.json (keys missing there fall back to English),
privacy policy bodies in src/privacy/<lang>.html.
"""
import json
import pathlib

from jinja2 import Environment, FileSystemLoader, StrictUndefined
from markupsafe import Markup

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / 'src'
OUT = ROOT / 'docs'
SITE = 'https://tolimoto.com/'

LANGS = [
    {'code': 'en', 'name': 'English', 'og': 'en_GB'},
    {'code': 'ru', 'name': 'Русский', 'og': 'ru_RU'},
    {'code': 'uk', 'name': 'Українська', 'og': 'uk_UA'},
    {'code': 'et', 'name': 'Eesti', 'og': 'et_EE'},
    {'code': 'lv', 'name': 'Latviešu', 'og': 'lv_LV'},
    {'code': 'lt', 'name': 'Lietuvių', 'og': 'lt_LT'},
    {'code': 'pl', 'name': 'Polski', 'og': 'pl_PL'},
]
PAGES = ['index.html', 'privacy.html']
# free "Таблица ТО" templates on Google Drive (shared: anyone with the link can view and copy)
SHEETS = {
    'ru': '1vLzkDTCo8svfaQh1OFcyItb7-uFBU4DDBavEcUBHORM',
    'en': '1N_7td_xjhrhNCM4Fejr9RKJ0LtwrDHeLPK0VAWpPvxI',
    'uk': '15IrY4IZZR_cIdLQ-rHKxUmOOFppUJAZKpwgVqxcO5yY',
    'et': '1BjA5yK4oM8WUFzaFbe4qejj1hRdIHpVnZpjkI02lk1c',
    'lv': '1710mBytMHqzRVZQqLM_lzlGM_3II1aoxXLIhhnvoRY8',
    'lt': '1q3f6ZT8eqh1f759MH_ifIfGtPYa6qZ6jimb3JCjr4dQ',
    'pl': '1lYPzGOHZ_evwnoyYOqa3Yb7vnqTWwhtu_ORm-asZeKU',
}


def texts(code):
    en = json.loads((SRC / 'i18n' / 'en.json').read_text('utf-8'))
    if code == 'en':
        return en
    own = json.loads((SRC / 'i18n' / f'{code}.json').read_text('utf-8'))
    missing = [k for k in en if k not in own]
    if missing:
        print(f'  {code}: {len(missing)} keys fall back to English: {", ".join(missing[:8])}')
    return {**en, **own}


def main():
    env = Environment(loader=FileSystemLoader(SRC), undefined=StrictUndefined, autoescape=True)
    codes = [l['code'] for l in LANGS]
    for L in LANGS:
        code = L['code']
        R = '' if code == 'en' else '../'
        t = {k: Markup(v) if isinstance(v, str) and '<' in v else v for k, v in texts(code).items()}

        def link(to, page, _R=R):
            path = ('' if to == 'en' else to + '/') + ('' if page == 'index.html' else page)
            return _R + path if (_R + path) else './'

        def abs_url(to, page):
            return SITE + ('' if to == 'en' else to + '/') + ('' if page == 'index.html' else page)

        for page in PAGES:
            ctx = dict(lang=code, L=L, langs=LANGS, lang_codes=codes, t=t, R=R, page=page, link=link, abs=abs_url,
                       shots='ru' if code == 'ru' else 'en', sheets=SHEETS, sheet_lang=code if code in SHEETS else 'en')
            if page == 'privacy.html':
                ctx['body'] = Markup((SRC / 'privacy' / f'{code}.html').read_text('utf-8'))
            html = env.get_template(page).render(**ctx)
            dest = OUT / ('' if code == 'en' else code) / page
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(html, 'utf-8')
    # sitemap for search engines
    urls = ''.join(f'<url><loc>{SITE}{"" if c == "en" else c + "/"}{"" if p == "index.html" else p}</loc></url>' for c in codes for p in PAGES)
    (OUT / 'sitemap.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n', 'utf-8')
    (OUT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {SITE}sitemap.xml\n', 'utf-8')
    print('built', len(LANGS) * len(PAGES), 'pages')


if __name__ == '__main__':
    main()
