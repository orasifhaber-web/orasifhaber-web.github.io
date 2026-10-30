// Hebrew is the default language (served at /), English lives under /en/.
// The interface texts themselves live in content/ui.json — editable in Pages CMS (see .pages.yml).
import uiText from './content/ui.json';

export type Lang = 'he' | 'en';
export type T = { he: string; en: string };
export const langs: Lang[] = ['he', 'en'];

export const dir = (l: Lang) => (l === 'he' ? 'rtl' : 'ltr');

/** Build a localized path: url('he', '/about/') → '/about/', url('en', '/about/') → '/en/about/' */
export const url = (l: Lang, p = '/') => (l === 'he' ? p : `/en${p === '/' ? '/' : p}`);

/** Strip the language prefix from a pathname. */
export const basePath = (pathname: string) => pathname.replace(/^\/en(?=\/|$)/, '') || '/';

export const ui = uiText;

/** Arrow pointing "forward" in reading direction. */
export const fwd = (l: Lang) => (l === 'he' ? '←' : '→');
export const back = (l: Lang) => (l === 'he' ? '→' : '←');
