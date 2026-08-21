/**
 * sitemap.xml を実ファイルから組み立て直す。
 *
 * 生成済みページを走査して作るので、ページを増やしたあとに毎回実行すれば
 * 記載漏れが起きない。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUBJECTS, ORIGIN } from './lib/extract.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${ORIGIN}/`, priority: '1.0', changefreq: 'weekly' },
];

for (const s of SUBJECTS) {
  urls.push({ loc: `${ORIGIN}/${s.dir}/`, priority: '0.9', changefreq: 'weekly' });

  const listing = path.join(ROOT, s.dir, 'books', 'index.html');
  if (fs.existsSync(listing)) {
    urls.push({ loc: `${ORIGIN}/${s.dir}/books/`, priority: '0.8', changefreq: 'weekly' });
  }

  const booksDir = path.join(ROOT, s.dir, 'books');
  if (!fs.existsSync(booksDir)) continue;
  const ids = fs.readdirSync(booksDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && fs.existsSync(path.join(booksDir, d.name, 'index.html')))
    .map(d => d.name)
    .sort();
  for (const id of ids) {
    urls.push({ loc: `${ORIGIN}/${s.dir}/books/${id}/`, priority: '0.6', changefreq: 'monthly' });
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`  ✓ sitemap.xml — ${urls.length} URL`);
