export const metadata = {
  title: 'Contact – Kapunka',
  description: 'Questions or wholesale? We’ll reply within 1 business day.',
};

export default function ContactPage() {
  return (
    <main style={{ padding: '6rem 8vw 4rem 8vw' }}>
      <section style={{ maxWidth: 840, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 1rem 0' }}>Contact</h1>
        <p style={{ margin: '0 0 1rem 0' }}>Questions or wholesale? We’ll reply within 1 business day.</p>
        <p style={{ margin: 0 }}>
          Email us at <a href="mailto:hello@kapunka.com" className="link">hello@kapunka.com</a>
        </p>
      </section>
    </main>
  );
}

