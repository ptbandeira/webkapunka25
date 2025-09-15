'use client';

export default function Error({ error, reset }) {
  return (
    <main className="container padding-large">
      <h1>Something went wrong</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error?.message || error)}</pre>
      <button className="btn" onClick={() => reset?.()}>Retry</button>
    </main>
  );
}
