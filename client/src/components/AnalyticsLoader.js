'use client';

import { useEffect } from 'react';
import { loadExternal } from '../lib/analytics';

export default function AnalyticsLoader(){
  useEffect(() => { loadExternal(); }, []);
  return null;
}

