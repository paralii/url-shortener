import { useState } from 'react';
import { fetchStats } from '../api/urlApi';

function fmt(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

const inputBase = [
    'w-full bg-bg border rounded px-3.5 py-2.5',
    'font-mono text-[0.85rem] text-ink placeholder:text-ink-dim',
    'outline-none transition-all duration-[180ms]',
    'border-border-hi focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-glow)]',
].join(' ');

export default function StatsLookup() {
    const [input, setInput]     = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');
    const [stats, setStats]     = useState(null);

    function extractId(value) {
        const trimmed = value.trim();
        try {
            const url = new URL(trimmed);
            const parts = url.pathname.replace(/^\/api/, '').split('/').filter(Boolean);
            return parts[0] ?? trimmed;
        } catch {
            return trimmed;
        }
    }

    async function handleLookup(e) {
        e.preventDefault();
        const shortId = extractId(input);

        if (!/^[a-zA-Z0-9_-]{8}$/.test(shortId)) {
            setError('Enter a valid 8-character short ID or short URL');
            return;
        }

        setLoading(true);
        setError('');
        setStats(null);

        try {
            const data = await fetchStats(shortId);
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const isActive = stats && stats.isActive && !stats.isExpired;

    return (
        <>
            {/* ── Lookup card ── */}
            <div className="w-full max-w-[640px] bg-surface border border-border rounded p-8 animate-fade-up">
                <p className="font-display text-[1.5rem] tracking-[0.06em] text-ink mb-1">Link Stats</p>
                <p className="text-[0.82rem] text-ink-dim mb-7 leading-relaxed">
                    Enter a short ID or full short URL to see click analytics.
                </p>

                <form onSubmit={handleLookup} noValidate>
                    <div className="flex flex-col gap-1.5 mb-4">
                        <label
                            htmlFor="stats-input"
                            className="text-[0.72rem] font-medium tracking-[0.1em] uppercase text-ink-dim"
                        >
                            Short ID or URL
                        </label>
                        <input
                            id="stats-input"
                            type="text"
                            className={inputBase}
                            placeholder="xK9mP2qR  or  http://localhost:1122/api/xK9mP2qR"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={[
                            'w-full mt-2 py-3 px-6 rounded font-semibold text-[0.82rem]',
                            'tracking-[0.08em] uppercase bg-accent text-black',
                            'flex items-center justify-center gap-2 cursor-pointer',
                            'transition-all duration-[180ms]',
                            'hover:not-disabled:brightness-110 hover:not-disabled:-translate-y-px',
                            'hover:not-disabled:shadow-[0_4px_20px_var(--color-accent-glow)]',
                            'disabled:opacity-45 disabled:cursor-not-allowed',
                        ].join(' ')}
                    >
                        {loading
                            ? <>
                                <span className="w-4 h-4 border-2 border-transparent border-t-black rounded-full animate-spin-fast inline-block" />
                                Looking up…
                              </>
                            : '→ Look up'
                        }
                    </button>
                </form>

                {error && (
                    <div className="mt-3 px-3.5 py-2.5 rounded bg-danger-dim border border-danger/25 text-danger text-[0.82rem]">
                        {error}
                    </div>
                )}
            </div>

            {/* ── Stats result ── */}
            {stats && (
                <div className="w-full max-w-[640px] bg-surface border border-border border-t-2 border-t-accent rounded px-8 py-6 mt-4 animate-fade-up">

                    {/* Header row */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[0.7rem] tracking-[0.12em] uppercase text-ink-dim">
                            /{stats.shortId}
                        </p>
                        <span className={[
                            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full',
                            'text-[0.7rem] tracking-[0.08em] uppercase font-medium border',
                            isActive
                                ? 'bg-ok-dim text-ok border-ok/30'
                                : 'bg-danger-dim text-danger border-danger/30',
                        ].join(' ')}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-ok' : 'bg-danger'}`} />
                            {isActive ? 'Active' : stats.isExpired ? 'Expired' : 'Inactive'}
                        </span>
                    </div>

                    {/* Stat boxes */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-bg border border-border-hi rounded p-4">
                            <div className="font-display text-[2rem] tracking-[0.04em] text-accent leading-none mb-1">
                                {stats.clicks.toLocaleString()}
                            </div>
                            <div className="text-[0.7rem] tracking-[0.1em] uppercase text-ink-dim">
                                Total Clicks
                            </div>
                        </div>
                        <div className="bg-bg border border-border-hi rounded p-4">
                            <div className="text-[0.9rem] text-ink-subtle font-mono leading-none mb-1 pt-1">
                                {fmt(stats.createdAt)}
                            </div>
                            <div className="text-[0.7rem] tracking-[0.1em] uppercase text-ink-dim">
                                Created
                            </div>
                        </div>
                    </div>

                    {/* Destination URL */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.72rem] font-medium tracking-[0.1em] uppercase text-ink-dim">
                            Destination URL
                        </label>
                        <div className="bg-bg border border-border-hi rounded px-3.5 py-3 font-mono text-[0.78rem] text-ink-subtle break-all leading-relaxed">
                            <a href={stats.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                                {stats.originalUrl}
                            </a>
                        </div>
                    </div>

                    {/* Expiry */}
                    {stats.expiresAt && (
                        <>
                            <hr className="border-none border-t border-border my-5" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[0.68rem] tracking-[0.1em] uppercase text-ink-dim">Expires</span>
                                <span className="font-mono text-[0.8rem] text-ink-subtle">{fmt(stats.expiresAt)}</span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
