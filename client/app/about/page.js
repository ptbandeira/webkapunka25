export const metadata = {
  title: 'About – Kapunka',
  description: 'Our story — 100% pure, cold-pressed argan oil.',
};

export default function AboutPage() {
  return (
    <main style={{ padding: '6rem 8vw 4rem 8vw' }}>
      <section style={{ maxWidth: 840, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 1rem 0' }}>Our story</h1>
        <p style={{ margin: '0 0 1rem 0' }}>
          We bottle 100% pure, cold-pressed argan oil from Moroccan co-ops. No fillers, no perfume—just the good stuff.
        </p>
        <p style={{ margin: 0 }}>
          Every batch is small-run and lab-tested. Skin, hair, nails—one bottle that does it all.
        </p>
      </section>
    </main>
  );
}

