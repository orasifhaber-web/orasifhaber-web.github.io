import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { langs, url } from '../i18n';

export const GET: APIRoute = ({ site }) => {
  const paths = ['/', '/about/', ...projects.map((p) => `/work/${p.slug}/`)];
  const entry = (p: string) =>
    langs
      .map((l) => `  <url>\n    <loc>${new URL(url(l, p), site)}</loc>\n${langs.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${new URL(url(a, p), site)}"/>`).join('\n')}\n  </url>`)
      .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(entry).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
