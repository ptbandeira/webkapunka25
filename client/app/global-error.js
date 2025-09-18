'use client';

export default function GlobalError({ error, reset }) {
  const message = error?.message ? String(error.message) : null;
  return (
    <html lang="en">
      <body>
        <section className="padding-xlarge">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8 text-center">
                <p className="text-uppercase text-muted mb-3">500</p>
                <h1 className="display-5 mb-3">Something went wrong.</h1>
                <p className="text-muted mb-4">
                  {message || 'We ran into an unexpected issue. Try again or return home.'}
                </p>
                <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                  <button type="button" className="btn btn-primary" onClick={() => reset?.()}>
                    Retry
                  </button>
                  <a href="/en" className="btn btn-outline-secondary">
                    Go to homepage
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
