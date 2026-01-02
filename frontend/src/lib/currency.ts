// Lightweight currency utilities with real-time USD↔INR rate fetching
// Uses public exchangerate.host and caches in localStorage for quick refreshes

export type FxRate = {
  base: 'USD' | 'INR';
  target: 'USD' | 'INR';
  rate: number; // INR per USD when base=USD,target=INR
  fetchedAt: string; // ISO timestamp
  source: string;
};

const CACHE_KEY = 'fx:USD_INR';
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes

function nowIso() {
  return new Date().toISOString();
}

function readCache(): FxRate | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: FxRate & { ttl?: number } = JSON.parse(raw);
    // Ensure shape
    if (!parsed || typeof parsed.rate !== 'number') return null;
    // TTL check: embed fetch time and compare
    const fetched = new Date(parsed.fetchedAt).getTime();
    const age = Date.now() - fetched;
    const ttl = DEFAULT_TTL_MS;
    return age < ttl ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(rate: FxRate) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(rate));
  } catch {
    // ignore storage issues
  }
}

export async function fetchUsdInrRate(): Promise<FxRate> {
  // Try cache first
  const cached = readCache();
  if (cached) return cached;

  // Fallback fetch
  try {
    const url = 'https://api.exchangerate.host/latest?base=USD&symbols=INR';
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error('fx fetch failed');
    const json = await res.json();
    const rate = json?.rates?.INR;
    if (typeof rate !== 'number') throw new Error('fx parse failed');
    const fx: FxRate = {
      base: 'USD',
      target: 'INR',
      rate,
      fetchedAt: nowIso(),
      source: 'exchangerate.host',
    };
    writeCache(fx);
    return fx;
  } catch {
    // Conservative fallback: typical recent range ~ 80-90 INR per USD; pick 84.0
    const fx: FxRate = {
      base: 'USD',
      target: 'INR',
      rate: 84.0,
      fetchedAt: nowIso(),
      source: 'fallback',
    };
    writeCache(fx);
    return fx;
  }
}

export function convert(
  amount: number,
  from: 'USD' | 'INR',
  to: 'USD' | 'INR',
  usdInrRate: number,
): number {
  if (from === to) return amount;
  return from === 'USD' && to === 'INR'
    ? amount * usdInrRate
    : amount / usdInrRate;
}

export function formatCurrency(
  amount: number,
  currency: 'USD' | 'INR',
): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDual(
  amount: number,
  base: 'USD' | 'INR',
  usdInrRate: number,
): { usd: string; inr: string } {
  const usdAmount =
    base === 'USD' ? amount : convert(amount, 'INR', 'USD', usdInrRate);
  const inrAmount =
    base === 'INR' ? amount : convert(amount, 'USD', 'INR', usdInrRate);
  return {
    usd: formatCurrency(usdAmount, 'USD'),
    inr: formatCurrency(inrAmount, 'INR'),
  };
}

// Simple React hook to provide live USD→INR rate with periodic refresh
import { useEffect, useState } from 'react';

export function useUsdInrRate(refreshMs: number = DEFAULT_TTL_MS) {
  const [fx, setFx] = useState<FxRate | null>(null);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const rate = await fetchUsdInrRate();
      if (mounted) setFx(rate);
    };
    load();
    const id = window.setInterval(load, Math.max(60_000, refreshMs));
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, [refreshMs]);
  return fx;
}
