'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

function ErrorText({ id, message }){
  if (!message) return null;
  return (
    <div id={id} className="text-danger small mt-1" role="alert" aria-live="polite">
      {message}
    </div>
  );
}

export default function ContactForm({ privacyHref = '/en/policies/privacy' }){
  const [data, setData] = useState({ name: '', email: '', message: '', consent: false });
  const [touched, setTouched] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const startedAtRef = useRef(Date.now());

  const setField = useCallback((id, value) => {
    setData(d => ({ ...d, [id]: value }));
    setServerErrors(errors => ({ ...errors, [id]: '' }));
  }, []);

  const onBlur = (e) => setTouched(t => ({ ...t, [e.target.id]: true }));

  const emailValid = useMemo(() => /.+@.+\..+/.test(data.email), [data.email]);

  const errors = useMemo(() => ({
    name: data.name ? '' : 'Please enter your name.',
    email: data.email ? (emailValid ? '' : 'Please enter a valid email.') : 'Please enter your email.',
    message: data.message ? '' : 'Please enter a message.',
    consent: data.consent ? '' : 'Please accept the privacy policy.',
  }), [data, emailValid]);

  const mergedErrors = {
    name: errors.name || serverErrors.name,
    email: errors.email || serverErrors.email,
    message: errors.message || serverErrors.message,
    consent: errors.consent || serverErrors.consent,
  };

  const allValid = !errors.name && !errors.email && !errors.message && !errors.consent;

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name:true, email:true, message:true, consent:true });
    if (!allValid) return;
    setBusy(true);
    setGlobalError('');
    setServerErrors({});
    try {
      const res = await fetch('/api/contact', {
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
        const fieldErrors = payload?.errors || {};
        setServerErrors(fieldErrors);
        setGlobalError(payload?.message || 'Something went wrong. Please try again.');
        setSent(false);
        startedAtRef.current = Date.now();
        return;
      }
      setSent(true);
      setData({ name: '', email: '', message: '', consent: false });
      setTouched({});
      setHoneypot('');
      setCaptchaToken('');
      startedAtRef.current = Date.now();
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="alert alert-success" role="status" aria-live="polite">
        Thanks — your message has been sent.
      </div>
    );
  }

  return (
    <form name="contact" method="POST" data-netlify="true" onSubmit={onSubmit} noValidate>
      <input type="hidden" name="form-name" value="contact" />
      <input
        type="text"
        name="company"
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

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          id="name"
          name="name"
          className="form-control"
          value={data.name}
          onChange={(e) => setField('name', e.target.value)}
          onBlur={onBlur}
          aria-invalid={touched.name && !!mergedErrors.name}
          aria-describedby="name-error"
          required
        />
        <ErrorText id="name-error" message={touched.name ? mergedErrors.name : serverErrors.name} />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          className="form-control"
          value={data.email}
          onChange={(e) => setField('email', e.target.value)}
          onBlur={onBlur}
          aria-invalid={touched.email && !!mergedErrors.email}
          aria-describedby="email-error"
          required
        />
        <ErrorText id="email-error" message={touched.email ? mergedErrors.email : serverErrors.email} />
      </div>

      <div className="mb-3">
        <label htmlFor="message" className="form-label">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="form-control"
          value={data.message}
          onChange={(e) => setField('message', e.target.value)}
          onBlur={onBlur}
          aria-invalid={touched.message && !!mergedErrors.message}
          aria-describedby="message-error"
          required
        />
        <ErrorText id="message-error" message={touched.message ? mergedErrors.message : serverErrors.message} />
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="consent"
          checked={data.consent}
          onChange={(e) => setField('consent', e.target.checked)}
          onBlur={onBlur}
          aria-invalid={touched.consent && !!mergedErrors.consent}
          aria-describedby="consent-error"
        />
        <label className="form-check-label" htmlFor="consent">
          I agree to the <a href={privacyHref} className="link">Privacy Policy</a>.
        </label>
        <ErrorText id="consent-error" message={touched.consent ? mergedErrors.consent : serverErrors.consent} />
      </div>

      <button type="submit" className="btn btn-primary" disabled={!allValid || busy}>
        {busy ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
