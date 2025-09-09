import fs from 'fs/promises';
import path from 'path';

function stripBetween(html) {
  let out = html;
  // Extract <body> contents if present
  const bodyMatch = out.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) out = bodyMatch[1];
  // Remove custom header/footer placeholders from legacy site
  out = out.replace(/<\/?site-header[^>]*>/gi, '');
  out = out.replace(/<\/?site-footer[^>]*>/gi, '');
  // Remove any inline script tags from fragment to avoid double-loading
  out = out.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  // Optional: remove preloader wrapper if present (keeps inner content)
  // out = out.replace(/<div id=["']preloader["'][^>]*>[\s\S]*?<\/div>/i, '');
  return out;
}

export async function loadSiteFragment(page) {
  const file = path.join(process.cwd(), 'public', 'site', `${page}.html`);
  const raw = await fs.readFile(file, 'utf8');
  return stripBetween(raw);
}
