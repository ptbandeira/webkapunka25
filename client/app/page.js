import { loadSiteFragment } from '../src/lib/loadSiteFragment';
import { isFeatureEnabled } from '../src/lib/config';
import { readPageSections, extractPageMeta, readReviews } from '../src/lib/cms/decap';
import SectionRenderer from '../src/components/SectionRenderer';
import { buildAlternateLinks } from '../src/lib/seo/locale';
import ReviewsGrid from '../src/components/reviews/ReviewsGrid';

function findHeroImage(sections) {
  return Array.isArray(sections)
    ? sections.find(section => section.type === 'hero' && section.background_image)?.background_image
    : undefined;
}

export async function generateMetadata() {
  const lang = 'en';
  const alternates = buildAlternateLinks(lang, []);
  if (isFeatureEnabled('decapPages')) {
    try {
      const sections = readPageSections(lang, 'home');
      if (sections.length) {
        const heroImage = findHeroImage(sections);
        const meta = extractPageMeta(sections, { autoOg: { image: heroImage, title: 'Kapunka — Calm, Repair, Protect' } });
        if (meta) {
          return {
            ...meta,
            alternates: { canonical: alternates.canonical, languages: alternates.languages },
          };
        }
      }
    } catch (e) {
      // ignore and fall back
    }
  }
  return {
    title: 'Kapunka — Calm, Repair, Protect',
    description: 'Clinic-minded argan oil to calm irritation, support healing, and protect the skin barrier.',
    alternates: { canonical: alternates.canonical, languages: alternates.languages },
  };
}

export default async function Page() {
  const lang = 'en';
  const reviewsEnabled = isFeatureEnabled('reviews');
  const reviews = reviewsEnabled ? readReviews(lang) : [];
  const reviewsSection = reviewsEnabled && reviews.length ? (
    <ReviewsGrid id="testimonials" heading="What our customers say" reviews={reviews} />
  ) : null;
  if (isFeatureEnabled('decapPages')) {
    try {
      const sections = readPageSections(lang, 'home');
      if (Array.isArray(sections) && sections.length > 0) {
        return (
          <>
            <SectionRenderer sections={sections} lang={lang} />
            {reviewsSection}
          </>
        );
      }
    } catch (e) {
      // fall through to legacy
    }
  }
  const html = await loadSiteFragment('index');
  return (
    <>
      <main dangerouslySetInnerHTML={{ __html: html }} />
      {reviewsSection}
    </>
  );
}
