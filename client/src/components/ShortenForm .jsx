import { useState } from 'react';
import { shortenUrl } from '../api/urlApi';
import ResultCard from './ResultCard';

function isValidUrl(str) {
    try {
        const s = /^https?:\/\//i.test(str) ? str : 'https://' + str;
        new URL(s);
        return true;
    } catch {
        return false;
    }
}

function expiryToSeconds(dateStr) {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - Date.now();
    return diff > 0 ? Math.floor(diff / 1000) : null;
}

export default function ShortenForm() {
    const [url, setUrl]           = useState('');
    const [expiry, setExpiry]     = useState('');
    const [showAdv, setShowAdv]   = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    const [result, setResult]     = useState(null);
    const [touched, setTouched]   = useState(false);

    const urlError = touched && url && !isValidUrl(url) ? 'Enter a valid URL' : '';

    const minDate = new Date(Date.now() + 60_000).toISOString().slice(0, 16);

    async function handleSubmit(e) {
        e.preventDefault();
        setTouched(true);
        if (!url || !isValidUrl(url)) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const expiresIn = expiryToSeconds(expiry);
            const data = await shortenUrl(url, expiresIn);
            setResult(data);
            setUrl('');
            setExpiry('');
            setTouched(false);
            setShowAdv(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="card">
                <p className="card-title">Shorten a URL</p>
                <p className="card-sub">Paste any long link — get a clean short one back.</p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="field">
                        <label htmlFor="url-input">Destination URL</label>
                        <input
                            id="url-input"
                            className={`input${urlError ? ' error' : ''}`}
                            type="url"
                            placeholder="https://example.com/very/long/url..."
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            onBlur={() => setTouched(true)}
                            autoComplete="off"
                            spellCheck={false}
                        />
                        <span className="input-hint">{urlError}</span>
                    </div>

                    {/* Advanced toggle */}
                    <div
                        className={`toggle-row${showAdv ? ' open' : ''}`}
                        onClick={() => setShowAdv(v => !v)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setShowAdv(v => !v)}
                    >
                        <span className="chevron">▶</span>
                        <span>Advanced options</span>
                    </div>

                    {showAdv && (
                        <div className="advanced-panel">
                            <div className="field">
                                <label htmlFor="expiry-input">Expires at</label>
                                <input
                                    id="expiry-input"
                                    className="input"
                                    type="datetime-local"
                                    value={expiry}
                                    min={minDate}
                                    onChange={e => setExpiry(e.target.value)}
                                />
                                <span className="input-hint" style={{ color: 'var(--text-dim)' }}>
                                    Leave blank for a permanent link
                                </span>
                            </div>
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? <><span className="spinner" /> Shortening…</>
                            : '→ Shorten'
                        }
                    </button>
                </form>

                {error && <div className="error-msg">{error}</div>}
            </div>

            {result && <ResultCard result={result} />}
        </>
    );
}
