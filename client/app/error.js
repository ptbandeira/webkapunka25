'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { captureError } from '../src/lib/monitoring';

export default function Error({ error, reset }) {
  const message = error?.message ? String(error.message) : null;
  useEffect(() => {
    if (error) captureError(error, { tags: { source: 'route-error' } });
  }, [error]);
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <p className="text-uppercase text-muted mb-3">500</p>
            <h1 className="display-5 mb-3">Something went wrong.</h1>
            <p className="text-muted mb-4">
              {message || 'We ran into an unexpected issue. You can try again or head back to the homepage.'}
            </p>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <button type="button" className="btn btn-primary" onClick={() => reset?.()}>
                Retry
              </button>
              <Link href="/en" className="btn btn-outline-secondary">
                Go to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
