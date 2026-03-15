const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:1122/api';

export async function shortenUrl(originalUrl, expiresIn = null) {
    const res = await fetch(`${BASE}/urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, expiresIn }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? 'Failed to shorten URL');
    return data;
}

export async function fetchStats(shortId) {
    const res = await fetch(`${BASE}/urls/${shortId}/stats`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? 'Failed to fetch stats');
    return data;
}

export function buildShortUrl(shortId) {
    const base = import.meta.env.VITE_SHORT_BASE ?? 'http://localhost:1122/api';
    return `${base}/${shortId}`;
}
