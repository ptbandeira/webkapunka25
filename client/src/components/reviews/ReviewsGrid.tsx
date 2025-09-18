import type { ReviewEntry } from '../../lib/cms/decap';

type Props = {
  reviews: ReviewEntry[];
  heading?: string;
  id?: string;
  className?: string;
};

function renderStars(rating?: number) {
  if (typeof rating !== 'number') return null;
  const safe = Math.min(5, Math.max(1, Math.round(rating)));
  const filled = '\u2605'.repeat(safe);
  const empty = '\u2606'.repeat(5 - safe);
  return (
    <div className="text-warning" aria-label={`${safe} star rating`}>
      <span className="me-1" aria-hidden="true">{filled}</span>
      <span className="text-muted" aria-hidden="true">{empty}</span>
    </div>
  );
}

function joinClasses(...values: (string | undefined)[]) {
  return values.filter(Boolean).join(' ');
}

export default function ReviewsGrid({ reviews, heading, id, className }: Props) {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;
  const sectionClass = joinClasses('padding-large', className);
  return (
    <section id={id} className={sectionClass}>
      <div className="container">
        {heading ? <h3 className="text-center mb-5">{heading}</h3> : null}
        <div className="row g-4">
          {reviews.map((review) => (
            <div className="col-md-4" key={review.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex flex-column gap-3">
                  <blockquote className="mb-0 fs-5 fw-light">
                    "{review.quote}"
                  </blockquote>
                  <div className="mt-auto">
                    {renderStars(review.rating)}
                    <p className="fw-semibold mb-0 mt-2">{review.name}</p>
                    {review.role ? <p className="text-muted mb-0">{review.role}</p> : null}
                    {review.source ? <p className="text-muted mb-0">{review.source}</p> : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

