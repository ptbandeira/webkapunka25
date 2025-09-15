'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <main className="container padding-large">
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error?.message || error)}</pre>
          <button className="btn" onClick={() => reset?.()}>Retry</button>
        </main>
      </body>
    </html>
  );
}

