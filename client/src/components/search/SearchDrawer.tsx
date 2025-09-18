'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';

export type SearchEntry = {
  type: 'product' | 'article';
  slug: string;
  title: string;
  summary: string;
  category: string;
  locale: string;
};

type SearchIndex = {
  generatedAt?: string;
  entries: SearchEntry[];
};

type Props = {
  locale: string;
  open: boolean;
  onClose: () => void;
};

const DEFAULT_LOCALE = 'en';
const FUSE_OPTIONS: Fuse.IFuseOptions<SearchEntry> = {
  keys: ['title', 'summary', 'category'],
  threshold: 0.3,
  includeScore: true,
};

export default function SearchDrawer({ locale, open, onClose }: Props) {
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const abort = new AbortController();
    const loadIndex = async () => {
      try {
        setLoading(true);
        const res = await fetch('/content/search-index.json', { signal: abort.signal, cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as SearchIndex;
        setIndex(Array.isArray(data.entries) ? data.entries : []);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.warn('[SearchDrawer] Failed loading search index', err);
        }
      } finally {
        setLoading(false);
      }
    };
    loadIndex();
    return () => abort.abort();
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      el.select();
    }
  }, [open]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
    return undefined;
  }, [open, onClose]);

  const localeEntries = useMemo(() => index.filter(item => item.locale === locale), [index, locale]);
  const defaultEntries = useMemo(
    () => index.filter(item => item.locale === DEFAULT_LOCALE && item.locale !== locale),
    [index, locale]
  );

  const fusePrimary = useMemo(() => new Fuse(localeEntries, FUSE_OPTIONS), [localeEntries]);
  const fuseFallback = useMemo(() => new Fuse(defaultEntries, FUSE_OPTIONS), [defaultEntries]);

  const results = useMemo(() => {
    if (!query) return [] as SearchEntry[];
    const seen = new Set<string>();
    const primary = fusePrimary.search(query).map(res => res.item);
    const out: SearchEntry[] = [];
    primary.forEach(item => {
      const key = `${item.locale}:${item.slug}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(item);
      }
    });
    fuseFallback
      .search(query)
      .map(res => res.item)
      .forEach(item => {
        const key = `${item.locale}:${item.slug}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push(item);
        }
      });
    return out.slice(0, 12);
  }, [query, fusePrimary, fuseFallback]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const handleBackgroundClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleBackgroundClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '10vh',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        style={{
          width: 'min(720px, 92vw)',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 24px 45px rgba(0,0,0,0.25)',
          padding: '32px 36px',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search Kapunka..."
            value={query}
            onChange={handleChange}
            style={{
              flex: 1,
              border: '1px solid #ccc',
              borderRadius: '999px',
              padding: '12px 18px',
              fontSize: '1rem',
            }}
          />
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              cursor: 'pointer',
              color: '#444',
            }}
          >
            Close
          </button>
        </div>

        {loading ? (
          <p>Loading index…</p>
        ) : query && !results.length ? (
          <p>No results.</p>
        ) : (
          <ul className="list-unstyled" style={{ margin: 0 }}>
            {results.map(result => (
              <li key={`${result.locale}:${result.slug}`} style={{ marginBottom: '18px' }}>
                <Link href={result.slug} onClick={onClose} style={{ textDecoration: 'none' }}>
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <span className="badge bg-light text-dark mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {result.type === 'product' ? 'Product' : 'Article'} • {result.category}
                      </span>
                      <h5 className="card-title mb-2" style={{ color: '#1b1a1a' }}>{result.title}</h5>
                      <p className="card-text text-muted mb-0">{result.summary}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
