// Generate sitemap index, locale sitemaps, and learn RSS feeds
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const repoRoot = path.resolve(__dirname, '..');
const publicDir = path.join(repoRoot, 'public');
const contentDir = path.join(publicDir, 'content');
const sitemapDir = path.join(publicDir, 'sitemaps');
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kapunkargan.com').replace(/\/+$/, '');
const LOCALES = ['en', 'pt', 'es'];
const MAX_FEED_ITEMS = 20;

function readJSON(file, fallback = null) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

function readText(file, fallback = '') {
  try {
    return fs.readFileSync(file, 'utf8').trim();
  } catch (err) {
    return fallback;
  }
}

function toISO(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function toUtcString(value) {
  const iso = toISO(value);
  if (!iso) return null;
  return new Date(iso).toUTCString();
}

function getRevTimestamp() {
  const revFile = path.join(contentDir, '.rev');
  return toISO(readText(revFile));
}

function buildLocalePath(locale, segments = []) {
  const cleaned = segments.filter(Boolean).map(seg => String(seg).replace(/^\/+|\/+$/g, '')).filter(Boolean);
  const suffix = cleaned.length ? `/${cleaned.join('/')}` : '';
  return `/${locale}${suffix}`;
}

function buildUrl(locale, segments = []) {
  return `${siteUrl}${buildLocalePath(locale, segments)}`;
}

function writeUrlset(filePath, urls) {
  if (!urls.length) return null;
  const body = urls
    .map(({ loc, lastmod }) => {
      const parts = [`    <loc>${loc}</loc>`];
      if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  fs.writeFileSync(filePath, xml, 'utf8');
  return xml;
}

function writeSitemapIndex(filePath, entries) {
  const body = entries
    .map(({ loc, lastmod }) => {
      const parts = [`  <sitemap>`, `    <loc>${loc}</loc>`];
      if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
      parts.push('  </sitemap>');
      return parts.join('\n');
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
  fs.writeFileSync(filePath, xml, 'utf8');
}

function maxLastmod(urls, fallback) {
  const times = urls
    .map(u => (u.lastmod ? new Date(u.lastmod).getTime() : Number.NaN))
    .filter(t => !Number.isNaN(t));
  if (!times.length) return fallback || null;
  return new Date(Math.max(...times)).toISOString();
}

function getPageUpdatedAt(locale, slug) {
  const localized = path.join(contentDir, locale, 'pages', `${slug}.json`);
  const fallback = path.join(contentDir, 'pages', `${slug}.json`);
  if (fs.existsSync(localized)) {
    const data = readJSON(localized);
    if (data && data.updatedAt) return toISO(data.updatedAt);
  }
  if (fs.existsSync(fallback)) {
    const data = readJSON(fallback);
    if (data && data.updatedAt) return toISO(data.updatedAt);
  }
  return null;
}

function collectPageUrls(locale, defaultLastmod) {
  const slugs = [
    { slug: 'home', segments: [] },
    { slug: 'about', segments: ['about'] },
    { slug: 'shop', segments: ['shop'] },
    { slug: 'contact', segments: ['contact'] },
    { slug: 'clinics', segments: ['clinics'] },
    { slug: 'training', segments: ['training'] },
    { slug: 'checkout', segments: ['checkout'] },
    { slug: 'policies-privacy', segments: ['policies', 'privacy'] },
    { slug: 'policies-terms', segments: ['policies', 'terms'] },
    { slug: 'policies-shipping', segments: ['policies', 'shipping'] },
    { slug: 'policies-returns', segments: ['policies', 'returns'] },
  ];

  return slugs.map(({ slug, segments }) => {
    const lastmod = getPageUpdatedAt(locale, slug) || defaultLastmod;
    return {
      loc: buildUrl(locale, segments),
      lastmod,
    };
  });
}

function collectProductData(defaultLastmod) {
  const file = path.join(contentDir, 'products.json');
  const legacy = readJSON(file, {});
  let slugs = [];
  let lastmod = toISO(legacy.updatedAt) || defaultLastmod;

  if (Array.isArray(legacy.products) && legacy.products.length) {
    slugs = legacy.products.map(p => p.slug).filter(Boolean);
  }

  if (!slugs.length) {
    try {
      const productsModule = require(path.join(repoRoot, 'src', 'data', 'products.js'));
      if (Array.isArray(productsModule.products)) {
        slugs = productsModule.products.map(p => p.slug).filter(Boolean);
      }
    } catch (err) {
      // ignore
    }
  }

  return { slugs: Array.from(new Set(slugs)), lastmod };
}

function collectProductUrls(locale, productData, defaultLastmod) {
  const lastmod = productData.lastmod || defaultLastmod;
  return productData.slugs.map(slug => ({
    loc: buildUrl(locale, ['shop', slug]),
    lastmod,
  }));
}

function collectArticles() {
  try {
    const mod = require(path.join(repoRoot, 'src', 'data', 'articles.js'));
    if (Array.isArray(mod.articles)) return mod.articles;
  } catch (err) {
    // ignore
  }
  return [];
}

function collectLearnUrls(locale, articles, defaultLastmod) {
  const sorted = [...articles]
    .map(a => ({ ...a, dateIso: toISO(a.date) }))
    .sort((a, b) => {
      const aTime = a.dateIso ? new Date(a.dateIso).getTime() : 0;
      const bTime = b.dateIso ? new Date(b.dateIso).getTime() : 0;
      return bTime - aTime;
    });

  const urls = [];
  const latest = sorted.length ? sorted[0].dateIso || defaultLastmod : defaultLastmod;
  urls.push({ loc: buildUrl(locale, ['learn']), lastmod: latest });

  sorted.forEach(article => {
    if (!article.slug) return;
    urls.push({
      loc: buildUrl(locale, ['learn', article.slug]),
      lastmod: article.dateIso || defaultLastmod,
    });
  });

  return urls;
}

function writeRssFeed(locale, articles, defaultLastmod) {
  const sorted = [...articles]
    .map(a => ({ ...a, dateIso: toISO(a.date) }))
    .sort((a, b) => {
      const aTime = a.dateIso ? new Date(a.dateIso).getTime() : 0;
      const bTime = b.dateIso ? new Date(b.dateIso).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, MAX_FEED_ITEMS);

  const channelLink = buildUrl(locale, ['learn']);
  const lastBuildDate = sorted.length ? toUtcString(sorted[0].dateIso) : toUtcString(defaultLastmod) || new Date().toUTCString();

  const items = sorted
    .map(article => {
      const link = buildUrl(locale, ['learn', article.slug]);
      const pubDate = toUtcString(article.dateIso) || lastBuildDate;
      const description = article.excerpt || '';
      return [
        '    <item>',
        `      <title><![CDATA[${article.title || article.slug}]]></title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        description ? `      <description><![CDATA[${description}]]></description>` : null,
        '    </item>',
      ].filter(Boolean).join('\n');
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Kapunka Learn (${locale.toUpperCase()})</title>\n    <link>${channelLink}</link>\n    <description>Clinic-minded education from Kapunka</description>\n    <language>${locale}</language>\n    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n${items}\n  </channel>\n</rss>\n`;

  const feedDir = path.join(publicDir, locale, 'learn');
  fs.mkdirSync(feedDir, { recursive: true });
  fs.writeFileSync(path.join(feedDir, 'rss.xml'), rss, 'utf8');
}

async function main() {
  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(sitemapDir, { recursive: true });

  const defaultLastmod = getRevTimestamp() || new Date().toISOString();
  const productData = collectProductData(defaultLastmod);
  const articles = collectArticles();

  const sitemapEntries = [];

  LOCALES.forEach(locale => {
    const pageUrls = collectPageUrls(locale, defaultLastmod);
    const productUrls = collectProductUrls(locale, productData, defaultLastmod);
    const learnUrls = collectLearnUrls(locale, articles, defaultLastmod);

    const pageFile = path.join(sitemapDir, `${locale}-pages.xml`);
    const productFile = path.join(sitemapDir, `${locale}-products.xml`);
    const learnFile = path.join(sitemapDir, `${locale}-learn.xml`);

    if (writeUrlset(pageFile, pageUrls)) {
      sitemapEntries.push({
        loc: `${siteUrl}/sitemaps/${locale}-pages.xml`,
        lastmod: maxLastmod(pageUrls, defaultLastmod),
      });
    }

    if (writeUrlset(productFile, productUrls)) {
      sitemapEntries.push({
        loc: `${siteUrl}/sitemaps/${locale}-products.xml`,
        lastmod: maxLastmod(productUrls, productData.lastmod || defaultLastmod),
      });
    }

    if (writeUrlset(learnFile, learnUrls)) {
      sitemapEntries.push({
        loc: `${siteUrl}/sitemaps/${locale}-learn.xml`,
        lastmod: maxLastmod(learnUrls, defaultLastmod),
      });
    }

    writeRssFeed(locale, articles, defaultLastmod);
  });

  // Provide x-default RSS (alias English feed) at /learn/rss.xml
  const englishFeed = path.join(publicDir, 'en', 'learn', 'rss.xml');
  if (fs.existsSync(englishFeed)) {
    const defaultFeedDir = path.join(publicDir, 'learn');
    fs.mkdirSync(defaultFeedDir, { recursive: true });
    fs.copyFileSync(englishFeed, path.join(defaultFeedDir, 'rss.xml'));
  }

  if (sitemapEntries.length) {
    writeSitemapIndex(path.join(publicDir, 'sitemap.xml'), sitemapEntries.sort((a, b) => a.loc.localeCompare(b.loc)));
  }

  const robots = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');

  console.log('Generated sitemap index, locale sitemaps, robots.txt, and RSS feeds');
}

main().catch((err) => {
  console.error('sitemap generation failed', err);
  process.exit(1);
});
