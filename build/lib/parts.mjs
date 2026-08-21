/**
 * 生成ページで共有する HTML パーツ（head・ヘッダー・フッター）。
 */
import { SUBJECTS, ORIGIN, esc } from './extract.mjs';

/**
 * <head> の共通部分。
 * @param {object} o title/desc/url/ogImage/subject(色用)/noindex/jsonLd
 */
export function head(o) {
  const img = o.ogImage || `${ORIGIN}/assets/ogp.png`;
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<meta name="robots" content="${o.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1'}">
<meta name="theme-color" content="#F6F4EF">
<meta name="format-detection" content="telephone=no">
<link rel="canonical" href="${o.url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="ルート大全">
<meta property="og:locale" content="ja_JP">
<meta property="og:title" content="${esc(o.ogTitle || o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${o.url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.ogTitle || o.title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${img}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images-fe.ssl-images-amazon.com">
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Shippori+Mincho+B1:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">`;
}

/** アフィリエイト表示バー + 科目切り替えバー */
export function topBars(curDir) {
  const links = SUBJECTS.map(s =>
    `      <a class="xl" href="/${s.dir}/"${s.dir === curDir ? ' aria-current="page"' : ''}>${s.ja}</a>`
  ).join('\n');
  return `<div class="pr-bar">当サイトは<b>アフィリエイト広告</b>を利用しています。参考書の紹介リンクから購入された場合、当サイトに紹介料が発生することがあります。</div>

<nav class="xbar" aria-label="科目切り替え">
  <div class="xbar__in">
    <a class="xbar__brand" href="/">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ルート大全
    </a>
${links}
  </div>
</nav>`;
}

/** 科目色を帯びたヘッダー */
export function header(sub) {
  return `<header class="app-header">
  <div class="app-header__in">
    <a class="logo" href="/${sub.dir}/">
      <div class="logo__mark">${sub.mark}</div>
      <div class="logo__txt"><b>${sub.full}</b><span>${sub.en} ROUTE</span></div>
    </a>
    <div class="hdr-cta">
      <a href="/${sub.dir}/">参考書図鑑</a>
      <a href="/">全科目</a>
      <a class="primary" href="/${sub.dir}/">ルートを作る</a>
    </div>
  </div>
</header>`;
}

/** パンくず（表示用）。JSON-LD 側は各ページで別に組む */
export function crumbs(items) {
  const parts = items.map((it, i) => {
    const last = i === items.length - 1;
    const node = last ? `<b>${esc(it.name)}</b>` : `<a href="${it.url}">${esc(it.name)}</a>`;
    return (i ? '<span class="sep">/</span>' : '') + node;
  }).join('\n    ');
  return `<nav class="crumbs" aria-label="パンくずリスト">\n    ${parts}\n  </nav>`;
}

/** フッター。counts は {dir: 冊数} */
export function footer(curDir, counts) {
  const items = SUBJECTS.map(s =>
    `      <a href="/${s.dir}/" style="--fsc:${s.color}"${s.dir === curDir ? ' aria-current="page"' : ''}>
        <span class="fs-mark">${s.mark}</span>
        <span class="fs-txt"><b>${s.full}</b><span>${counts[s.dir]} BOOKS</span></span>
      </a>`
  ).join('\n');
  return `<footer class="site-foot">
  <div class="site-foot__in">
    <div class="foot-subjects__t">Other subjects — 他の科目もあります</div>
    <div class="foot-subjects__list">
${items}
    </div>
    <div class="foot-links">
      <a href="/">ルート大全 トップ</a>
${curDir ? `      <a href="/${curDir}/">参考書図鑑</a>
      <a href="/${curDir}/books/">参考書一覧</a>
      <a href="/${curDir}/routes/">志望校別ルート</a>
      <a href="/${curDir}/guides/">参考書の選び方</a>` : `      <a href="/#subjects">科目から選ぶ</a>
      <a href="/#catalog">参考書から探す</a>
      <a href="/guides/">参考書の選び方</a>`}
      <a href="/#faq">よくある質問</a>
    </div>
    <div class="foot-legal">
      <b>ルート大全</b> — 大学受験 参考書ルート&amp;図鑑<br>
      当サイトはアフィリエイト広告を利用しています。掲載している難易度・到達偏差値・想定学習時間は公開情報にもとづく目安であり、学習成果を保証するものではありません。書影は Amazon 等が提供する商品画像 URL を参照して表示しています。<br>
      &copy; ${new Date().getFullYear()} ルート大全 編集部
    </div>
  </div>
</footer>`;
}

/** JSON-LD の script タグ（終了タグは分割して埋め込み事故を防ぐ） */
export function jsonLd(data) {
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 1)}\n</` + `script>`;
}

/** パンくずの JSON-LD */
export function breadcrumbLd(items, id) {
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: it.absUrl,
    })),
  };
}
