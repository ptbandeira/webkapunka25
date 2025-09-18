'use client';

import RootErrorBoundary from './RootErrorBoundary';

export default function RootShell({ children }) {
  return <RootErrorBoundary>{children}</RootErrorBoundary>;
}
