import ClinicInquiryForm from '../../../src/components/clinics/ClinicInquiryForm';

export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export default function ClinicsPage(){
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row g-5">
          <div className="col-12">
            <h1>For Clinics</h1>
            <p className="text-muted mb-4">Clinic‑minded supply, training, and support for post‑procedure care.</p>
          </div>

          {/* Use Cases */}
          <div className="col-md-6">
            <h3 className="mb-3">Use Cases</h3>
            <ul className="list-unstyled">
              <li className="mb-2">• Post‑laser calming and occlusion</li>
              <li className="mb-2">• Scar massage and hydration routines</li>
              <li className="mb-2">• Barrier‑support add‑on for sensitive cases</li>
            </ul>
          </div>

          {/* Wholesale Packs */}
          <div className="col-md-6">
            <h3 className="mb-3">Wholesale Packs</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr><th>Pack</th><th>Units</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  <tr><td>Starter</td><td>24</td><td>Mixed sizes; training deck</td></tr>
                  <tr><td>Core</td><td>48</td><td>Best value; clinic inserts</td></tr>
                  <tr><td>Custom</td><td>—</td><td>Tailored to volume</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Training */}
          <div className="col-12">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <h3 className="card-title mb-2">Training & Support</h3>
                <p className="card-text text-muted mb-0">Staff modules on post‑procedure protocols, scar massage, and barrier support. Materials provided for patient handouts.</p>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="col-md-8">
            <h3 className="mb-3">Inquiry</h3>
            <ClinicInquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

