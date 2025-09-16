import { describe, it, expect } from 'vitest';
import { SectionSchema, PageSchema } from '../src/types/sections';

describe('SectionSchema', () => {
  it('accepts meta sections', () => {
    const meta = { type: 'meta', title: 'Meta Title', description: 'Meta description', ogImage: '/og.png' };
    expect(() => SectionSchema.parse(meta)).not.toThrow();
  });

  it('rejects unknown section types', () => {
    expect(() => SectionSchema.parse({ type: 'unknown' })).toThrow();
  });
});

describe('PageSchema', () => {
  it('parses sections array with meta entries', () => {
    const data = {
      sections: [
        { type: 'meta', title: 'Meta Title' },
        { type: 'hero', title: 'Heading', subtitle: 'Sub', align: 'left' },
      ],
    };
    const parsed = PageSchema.parse(data);
    expect(parsed.sections.length).toBe(2);
  });
});
