import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import path from 'path';
import { readProducts } from '../src/lib/products';

const fixtureRoot = path.join(__dirname, 'fixtures', 'app');
let cwdSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(fixtureRoot);
});

afterAll(() => {
  cwdSpy.mockRestore();
});

describe('products loader', () => {
  it('reads normalized products list', () => {
    const products = readProducts();
    expect(products).toEqual([
      {
        id: 'p1',
        slug: 'fixture-product',
        name: 'Fixture Product',
        prices: [12],
        images: ['/images/prod.jpg'],
      },
    ]);
  });
});
