import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <p className="text-uppercase text-muted mb-3">404</p>
            <h1 className="display-5 mb-3">We couldn’t find that page.</h1>
            <p className="text-muted mb-4">
              The link you followed may be broken or the page may have been moved.
            </p>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <Link href="/en" className="btn btn-primary">
                Go to homepage
              </Link>
              <Link href="/en/shop" className="btn btn-outline-secondary">
                Browse the shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
