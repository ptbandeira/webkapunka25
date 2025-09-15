export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

const modules = [
  {
    title: 'Post‑Procedure Protocols',
    href: 'https://lms.example.com/courses/post-procedure',
    excerpt: 'Calming care steps for common procedures. Placeholder link.',
    image: '/images/banner-img1.jpg',
  },
  {
    title: 'Scar Massage Basics',
    href: 'https://lms.example.com/courses/scar-massage',
    excerpt: 'Timing, pressure, and hydration tips. Placeholder link.',
    image: '/images/product-item5.jpg',
  },
  {
    title: 'Barrier Support 101',
    href: 'https://lms.example.com/courses/barrier-support',
    excerpt: 'Fragrance‑free routines for sensitive skin. Placeholder link.',
    image: '/images/banner-image.jpg',
  },
];

function Card({ m }){
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="image-holder" style={{ aspectRatio: '1 / 1' }}>
        <a href={m.href} target="_blank" rel="noreferrer">
          <img src={m.image} alt={m.title} className="img-fluid" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </a>
      </div>
      <div className="card-body">
        <h5 className="card-title fs-4 text-capitalize"><a href={m.href} target="_blank" rel="noreferrer">{m.title}</a></h5>
        <p className="card-text text-muted">{m.excerpt}</p>
        <a className="btn btn-outline-secondary" href={m.href} target="_blank" rel="noreferrer">Open module</a>
      </div>
    </div>
  );
}

export default function TrainingPage(){
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Training</h1>
            <p className="text-muted mb-4">Academy modules for staff. Links are placeholders.</p>
          </div>
        </div>
        <div className="row g-4">
          {modules.map((m, i) => (
            <div className="col-md-4" key={i}>
              <Card m={m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

