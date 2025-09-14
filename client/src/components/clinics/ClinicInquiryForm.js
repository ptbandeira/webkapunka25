'use client';

import { useState } from 'react';

function Field({ id, label, type='text', required=false, ...props }){
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}{required ? ' *' : ''}</label>
      {type === 'textarea' ? (
        <textarea id={id} className="form-control" required={required} {...props} />
      ) : (
        <input id={id} type={type} className="form-control" required={required} {...props} />
      )}
    </div>
  );
}

export default function ClinicInquiryForm(){
  const [data, setData] = useState({ name:'', clinic:'', email:'', phone:'', message:'', consent:false });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onChange = (e) => {
    const { id, value, type, checked } = e.target;
    setData((d) => ({ ...d, [id]: type === 'checkbox' ? checked : value }));
  };

  const isValidEmail = (v) => /.+@.+\..+/.test(v);
  const allRequired = data.name && data.clinic && isValidEmail(data.email) && data.phone && data.message && data.consent;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!allRequired || busy) return;
    setBusy(true);
    try {
      // Stub: log to console; replace with fetch to endpoint if needed
      // await fetch('/api/clinics-inquiry', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
      console.log('Clinic inquiry submitted:', data);
      setSent(true);
      setData({ name:'', clinic:'', email:'', phone:'', message:'', consent:false });
    } catch (e2) {
      console.warn('Submit failed (stub):', e2);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="alert alert-success" role="alert">
        Thanks — we’ll be in touch within 1 business day.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Field id="name" label="Your name" value={data.name} onChange={onChange} required />
      <Field id="clinic" label="Clinic or organization" value={data.clinic} onChange={onChange} required />
      <Field id="email" label="Email" type="email" value={data.email} onChange={onChange} required />
      <Field id="phone" label="Phone" type="tel" value={data.phone} onChange={onChange} required />
      <Field id="message" label="Message" type="textarea" rows={5} value={data.message} onChange={onChange} required />

      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" id="consent" checked={data.consent} onChange={onChange} />
        <label className="form-check-label" htmlFor="consent">
          I agree to the processing of my data for this inquiry.
        </label>
      </div>

      <button type="submit" className="btn btn-primary" disabled={!allRequired || busy}>
        {busy ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  );
}

