import Link from 'next/link';

export default function Custom500() {
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <p className="text-uppercase text-muted mb-3">500</p>
            <h1 className="display-5 mb-3">Something went wrong.</h1>
            <p className="text-muted mb-4">
              We ran into an unexpected issue. Refresh the page or head back to safety while we fix it.
            </p>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <Link href="/en" className="btn btn-primary">
                Return home
              </Link>
              <Link href="/en/contact" className="btn btn-outline-secondary">
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
