'use client';

// Tiny in-memory cart store with pub/sub; no persistence yet
const state = {
  items: [], // { id, name, price, qty, image }
  open: false,
};

const listeners = new Set();
function notify(){ listeners.forEach(fn => { try { fn(state); } catch(_){} }); }

export function subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); }
export function getState(){ return state; }

export function open(){ if (!state.open){ state.open = true; notify(); } }
export function close(){ if (state.open){ state.open = false; notify(); } }
export function toggle(){ state.open = !state.open; notify(); }

export function add(item){
  if (!item || !item.id) return;
  const idx = state.items.findIndex(it => it.id === item.id);
  if (idx >= 0) state.items[idx].qty += item.qty || 1;
  else state.items.push({ id: item.id, name: item.name || 'Item', price: item.price || 0, qty: item.qty || 1, image: item.image || '' });
  notify();
}

export function remove(id){
  const idx = state.items.findIndex(it => it.id === id);
  if (idx === -1) return;
  const it = state.items[idx];
  if (it.qty > 1) it.qty -= 1; else state.items.splice(idx, 1);
  notify();
}

export function removeAll(id){
  const idx = state.items.findIndex(it => it.id === id);
  if (idx === -1) return;
  state.items.splice(idx, 1);
  notify();
}

export function clear(){ state.items.splice(0, state.items.length); notify(); }

export function count(){ return state.items.reduce((a, b) => a + (b.qty || 0), 0); }
export function total(){ return state.items.reduce((a, b) => a + (b.price || 0) * (b.qty || 0), 0); }

// React hooks for convenience
import { useEffect, useState } from 'react';
export function useCart(){
  const [snap, setSnap] = useState({ ...state });
  useEffect(() => subscribe(() => setSnap({ ...state })), []);
  return snap;
}
export function useCartCount(){
  const [c, setC] = useState(count());
  useEffect(() => subscribe(() => setC(count())), []);
  return c;
}
