'use client';

import { useRef, useState } from 'react';
import { track } from '../../lib/analytics';

function Field({ id, label, type='text', required=false, error='', onBlur, ...props }){
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}{required ? ' *' : ''}</label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          className="form-control"
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          onBlur={onBlur}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          className="form-control"
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          onBlur={onBlur}
          {...props}
        />
      )}
      {error ? (
        <div id={`${id}-error`} className="text-danger small mt-1" role="alert" aria-live="polite">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default function ClinicInquiryForm(){
  const [data, setData] = useState({ name:'', clinic:'', email:'', phone:'', message:'', consent:false });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const startedAtRef = useRef(Date.now());

  const onChange = (e) => {
    const { id, value, type, checked } = e.target;
    setData((d) => ({ ...d, [id]: type === 'checkbox' ? checked : value }));
    setServerErrors(errors => ({ ...errors, [id]: '' }));
  };

  const onBlur = (e) => {
    setTouched(t => ({ ...t, [e.target.id]: true }));
  };

  const isValidEmail = (v) => /.+@.+\..+/.test(v);
  const clientErrors = {
    name: data.name ? '' : 'Please enter your name.',
    clinic: data.clinic ? '' : 'Please enter your clinic name.',
    email: data.email ? (isValidEmail(data.email) ? '' : 'Please enter a valid email.') : 'Please enter your email.',
    phone: data.phone ? '' : 'Please enter a phone number.',
    message: data.message ? '' : 'Please enter a message.',
    consent: data.consent ? '' : 'Please confirm consent.',
  };

  const mergedErrors = {
    name: clientErrors.name || serverErrors.name,
    clinic: clientErrors.clinic || serverErrors.clinic,
    email: clientErrors.email || serverErrors.email,
    phone: clientErrors.phone || serverErrors.phone,
    message: clientErrors.message || serverErrors.message,
    consent: clientErrors.consent || serverErrors.consent,
  };

  const allValid = Object.values(clientErrors).every(val => !val);

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name:true, clinic:true, email:true, phone:true, message:true, consent:true });
    if (!allValid || busy) return;
    setBusy(true);
    setGlobalError('');
    setServerErrors({});
    try {
      const res = await fetch('/api/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          startedAt: startedAtRef.current,
          honeypot,
          captchaToken: captchaToken || undefined,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.ok) {
        setServerErrors(payload?.errors || {});
        setGlobalError(payload?.message || 'Something went wrong. Please try again.');
        setSent(false);
        startedAtRef.current = Date.now();
        return;
      }
      try{ track('clinics_inquiry_submitted', { name: data.name, clinic: data.clinic }); }catch(e){}
      setSent(true);
      setData({ name:'', clinic:'', email:'', phone:'', message:'', consent:false });
      setTouched({});
      setHoneypot('');
      setCaptchaToken('');
      startedAtRef.current = Date.now();
    } catch (e2) {
      console.warn('Submit failed:', e2);
      setGlobalError('Unable to send your inquiry right now. Please try again later.');
      startedAtRef.current = Date.now();
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
      <input
        type="text"
        name="role"
        className="d-none"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        aria-hidden="true"
      />
      <input type="hidden" name="startedAt" value={startedAtRef.current} />
      <input type="hidden" name="captchaToken" value={captchaToken} />

      {globalError ? (
        <div className="alert alert-danger" role="alert">
          {globalError}
        </div>
      ) : null}

      <Field id="name" label="Your name" value={data.name} onChange={onChange} onBlur={onBlur} required error={touched.name ? mergedErrors.name : serverErrors.name} />
      <Field id="clinic" label="Clinic or organization" value={data.clinic} onChange={onChange} onBlur={onBlur} required error={touched.clinic ? mergedErrors.clinic : serverErrors.clinic} />
      <Field id="email" label="Email" type="email" value={data.email} onChange={onChange} onBlur={onBlur} required error={touched.email ? mergedErrors.email : serverErrors.email} />
      <Field id="phone" label="Phone" type="tel" value={data.phone} onChange={onChange} onBlur={onBlur} required error={touched.phone ? mergedErrors.phone : serverErrors.phone} />
      <Field id="message" label="Message" type="textarea" rows={5} value={data.message} onChange={onChange} onBlur={onBlur} required error={touched.message ? mergedErrors.message : serverErrors.message} />

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="consent"
          checked={data.consent}
          onChange={onChange}
          onBlur={() => setTouched(t => ({ ...t, consent: true }))}
          aria-invalid={!!(touched.consent ? mergedErrors.consent : serverErrors.consent)}
          aria-describedby="consent-error"
        />
        <label className="form-check-label" htmlFor="consent">
          I agree to the processing of my data for this inquiry.
        </label>
        {(touched.consent ? mergedErrors.consent : serverErrors.consent) ? (
          <div id="consent-error" className="text-danger small mt-1" role="alert" aria-live="polite">
            {touched.consent ? mergedErrors.consent : serverErrors.consent}
          </div>
        ) : null}
      </div>

      <button type="submit" className="btn btn-primary" disabled={!allValid || busy}>
        {busy ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  );
}
