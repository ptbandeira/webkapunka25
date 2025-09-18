'use client';

import React from 'react';
import Link from 'next/link';
import { captureError, ensureMonitoring } from '../lib/monitoring';

export default class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    captureError(error, { extra: info });
  }

  componentDidMount() {
    ensureMonitoring();
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message ? String(this.state.error.message) : null;
      return (
        <section className="padding-xlarge">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8 text-center">
                <p className="text-uppercase text-muted mb-3">500</p>
                <h1 className="display-5 mb-3">Something went wrong.</h1>
                <p className="text-muted mb-4">
                  {message || 'We ran into an unexpected issue. Try refreshing the page or return home.'}
                </p>
                <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                  <button type="button" className="btn btn-primary" onClick={this.handleRetry}>
                    Refresh
                  </button>
                  <Link href="/en" className="btn btn-outline-secondary">
                    Go to homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
