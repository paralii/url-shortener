import { useState } from 'react';
import { fetchStats, buildShortUrl } from '../api/urlApi';

function fmt(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

export default function StatsLookup() {
    const [input, setInput]   = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]   = useState('');
    const [stats, setStats]   = useState(null);

    function extractId(value) {
        const trimmed = value.trim();
        // Accept full URL or just the short ID
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
            <div className="card">
                <p className="card-title">Link Stats</p>
                <p className="card-sub">Enter a short ID or full short URL to see click analytics.</p>

                <form onSubmit={handleLookup} noValidate>
                    <div className="field">
                        <label htmlFor="stats-input">Short ID or URL</label>
                        <input
                            id="stats-input"
                            className="input"
                            type="text"
                            placeholder="xK9mP2qR  or  http://localhost:1122/api/xK9mP2qR"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={loading || !input.trim()}
                    >
                        {loading
                            ? <><span className="spinner" /> Looking up…</>
                            : '→ Look up'
                        }
                    </button>
                </form>

                {error && <div className="error-msg">{error}</div>}
            </div>

            {stats && (
                <div className="result-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <p className="result-label" style={{ marginBottom: 0 }}>
                            /{stats.shortId}
                        </p>
                        <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                            <span className="status-dot" />
                            {isActive ? 'Active' : stats.isExpired ? 'Expired' : 'Inactive'}
                        </span>
                    </div>

                    <div className="stat-grid">
                        <div className="stat-box">
                            <div className="stat-val">{stats.clicks.toLocaleString()}</div>
                            <div className="stat-key">Total Clicks</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-val" style={{ fontSize: '1rem', paddingTop: 6 }}>
                                {fmt(stats.createdAt)}
                            </div>
                            <div className="stat-key">Created</div>
                        </div>
                    </div>

                    <div className="field" style={{ marginBottom: 0 }}>
                        <label>Destination URL</label>
                        <div className="original-url-box">
                            <a href={stats.originalUrl} target="_blank" rel="noopener noreferrer">
                                {stats.originalUrl}
                            </a>
                        </div>
                    </div>

                    {stats.expiresAt && (
                        <>
                            <hr className="divider" />
                            <div className="meta-item">
                                <span className="meta-key">Expires</span>
                                <span className="meta-val">{fmt(stats.expiresAt)}</span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
