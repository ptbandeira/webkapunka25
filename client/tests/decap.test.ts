import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import path from 'path';
import { readPageSections, readFaqs, extractPageMeta } from '../src/lib/cms/decap';

const fixtureRoot = path.join(__dirname, 'fixtures', 'app');
let cwdSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(fixtureRoot);
});

afterAll(() => {
  cwdSpy.mockRestore();
});

describe('decap loaders', () => {
  it('loads localized sections and extracts meta', () => {
    const sections = readPageSections('en', 'home');
    expect(sections.length).toBeGreaterThan(0);
    const meta = extractPageMeta(sections, { autoOg: { image: '/images/banner-image.jpg', title: 'Fixture Home' } });
    expect(meta).toBeTruthy();
    expect(meta?.title).toBe('Fixture Home');
    expect(meta?.description).toContain('Localized home');
    expect(meta?.openGraph?.images?.[0]?.url).toContain('/api/og?');
  });

  it('falls back to default locale when localized page missing', () => {
    const sections = readPageSections('pt', 'home');
    expect(sections).toEqual([
      {
        type: 'text',
        heading: 'Fallback Heading',
        body: 'This is fallback content.',
      },
    ]);
  });

  it('ignores pages marked as draft', () => {
    const sections = readPageSections('en', 'draft');
    expect(sections).toEqual([]);
  });

  it('builds og image url when meta requests auto', () => {
    const sections = [
      { type: 'meta', title: 'Auto Title', ogImage: 'auto' },
      { type: 'hero', title: 'Hero', subtitle: 'Sub', align: 'left', background_image: '/images/banner-image.jpg' },
    ] as any;
    const meta = extractPageMeta(sections, { autoOg: { title: 'Auto Title', image: '/images/banner-image.jpg', category: 'Hero' } });
    expect(meta?.openGraph?.images?.[0]?.url).toContain('/api/og');
  });

  it('normalizes FAQs with ordering', () => {
    const faqs = readFaqs('en');
    expect(faqs).toEqual([
      {
        question: 'Localized Q1',
        answer: 'Localized A1',
        order: 5,
      },
      {
        question: 'Localized Q2',
        answer: 'Localized A2',
        category: 'General',
        order: 10,
      },
    ]);
  });

  it('falls back to default FAQs when locale missing', () => {
    const faqs = readFaqs('de');
    expect(faqs[0]?.question).toBe('Default Q0');
    expect(faqs[0]?.order).toBe(10);
  });
});
