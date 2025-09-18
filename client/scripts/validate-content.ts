import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { PageSchema } from '../src/types/sections';

const repoRoot = path.resolve(__dirname, '..', '..');
const contentRoot = path.join(repoRoot, 'client', 'public', 'content');
const siteContentRoot = path.join(repoRoot, 'site', 'content');
const LOCALES = ['en', 'pt', 'es'] as const;

const ReviewSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  quote: z.string().min(1),
  role: z.string().optional(),
  source: z.string().optional(),
  rating: z.number().optional(),
  productSlug: z.string().optional(),
});
const ReviewsFileSchema = z.object({
  items: z.array(ReviewSchema),
  generatedAt: z.string().optional(),
});
const SourceReviewSchema = ReviewSchema.partial({ id: true });

function readJSON(file: string) {
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
}

function validateLocalePages(locale: string) {
  const dir = path.join(contentRoot, locale, 'pages');
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(name => name.endsWith('.json'));
  files.forEach(file => {
    const full = path.join(dir, file);
    const data = readJSON(full);
    const res = PageSchema.safeParse(data);
    if (!res.success) {
      const details = res.error.issues.map(issue => `${issue.path.join('.')} ${issue.message}`).join('; ');
      throw new Error(`Invalid page schema: ${path.relative(repoRoot, full)} -> ${details}`);
    }
  });
}

function validateReviewsFiles() {
  const targets = [
    path.join(contentRoot, 'reviews.json'),
    ...LOCALES.map(locale => path.join(contentRoot, locale, 'reviews.json')),
  ];
  targets.forEach(file => {
    if (!fs.existsSync(file)) return;
    const data = readJSON(file);
    const res = ReviewsFileSchema.safeParse(data);
    if (!res.success) {
      const details = res.error.issues.map(issue => `${issue.path.join('.')} ${issue.message}`).join('; ');
      throw new Error(`Invalid reviews file: ${path.relative(repoRoot, file)} -> ${details}`);
    }
  });
}

function validateSourceReviews() {
  const dir = path.join(siteContentRoot, 'reviews');
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(name => name.endsWith('.json'));
  files.forEach(file => {
    const full = path.join(dir, file);
    const data = readJSON(full);
    const res = SourceReviewSchema.safeParse(data);
    if (!res.success) {
      const details = res.error.issues.map(issue => `${issue.path.join('.')} ${issue.message}`).join('; ');
      throw new Error(`Invalid source review: ${path.relative(repoRoot, full)} -> ${details}`);
    }
  });
}

function validateContent() {
  LOCALES.forEach(locale => validateLocalePages(locale));
  validateReviewsFiles();
  validateSourceReviews();
}

try {
  validateContent();
  // eslint-disable-next-line no-console
  console.log('Decap content validation passed.');
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
