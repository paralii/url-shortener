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

const inputCls = [
    'w-full bg-bg border rounded px-3.5 py-2.5',
    'font-mono text-[0.85rem] text-ink placeholder:text-ink-dim',
    'outline-none transition-all duration-[180ms]',
    'border-border-hi focus:border-accent',
    'focus:shadow-[0_0_0_3px_var(--color-accent-glow)]',
].join(' ');

const inputErrCls = inputCls + [
    ' !border-danger',
    ' !shadow-[0_0_0_3px_var(--color-danger-dim)]',
].join('');

export default function ShortenForm() {
    const [url, setUrl]         = useState('');
    const [expiry, setExpiry]   = useState('');
    const [showAdv, setShowAdv] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');
    const [result, setResult]   = useState(null);
    const [touched, setTouched] = useState(false);

    const urlError = touched && url && !isValidUrl(url) ? 'Enter a valid URL' : '';
    const minDate  = new Date(Date.now() + 60_000).toISOString().slice(0, 16);

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
            {/* ── Card ── */}
            <div className="w-full max-w-[640px] bg-surface border border-border rounded p-8 animate-fade-up">
                <p className="font-display text-[1.5rem] tracking-[0.06em] text-ink mb-1">
                    Shorten a URL
                </p>
                <p className="text-[0.82rem] text-ink-dim mb-7 leading-relaxed">
                    Paste any long link — get a clean short one back.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    {/* URL field */}
                    <div className="flex flex-col gap-1.5 mb-4">
                        <label
                            htmlFor="url-input"
                            className="text-[0.72rem] font-medium tracking-[0.1em] uppercase text-ink-dim"
                        >
                            Destination URL
                        </label>
                        <input
                            id="url-input"
                            type="url"
                            className={urlError ? inputErrCls : inputCls}
                            placeholder="https://example.com/very/long/url..."
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            onBlur={() => setTouched(true)}
                            autoComplete="off"
                            spellCheck={false}
                        />
                        <span className="text-[0.73rem] text-danger min-h-[16px]">
                            {urlError}
                        </span>
                    </div>

                    {/* Advanced toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAdv(v => !v)}
                        className="flex items-center gap-2 mb-4 cursor-pointer group"
                    >
                        <span className={`text-[0.65rem] text-ink-dim transition-transform duration-[180ms] ${showAdv ? 'rotate-90' : ''}`}>
                            ▶
                        </span>
                        <span className="text-[0.75rem] tracking-[0.06em] uppercase text-ink-subtle group-hover:text-ink transition-colors">
                            Advanced options
                        </span>
                    </button>

                    {showAdv && (
                        <div className="overflow-hidden animate-slide-down mb-4">
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="expiry-input"
                                    className="text-[0.72rem] font-medium tracking-[0.1em] uppercase text-ink-dim"
                                >
                                    Expires at
                                </label>
                                <input
                                    id="expiry-input"
                                    type="datetime-local"
                                    className={inputCls}
                                    value={expiry}
                                    min={minDate}
                                    onChange={e => setExpiry(e.target.value)}
                                />
                                <span className="text-[0.73rem] text-ink-dim min-h-[16px]">
                                    Leave blank for a permanent link
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={[
                            'w-full mt-2 py-3 px-6 rounded font-semibold text-[0.82rem]',
                            'tracking-[0.08em] uppercase bg-accent text-black',
                            'flex items-center justify-center gap-2 cursor-pointer',
                            'transition-all duration-[180ms]',
                            'hover:brightness-110 hover:-translate-y-px',
                            'hover:shadow-[0_4px_20px_var(--color-accent-glow)]',
                            'active:translate-y-0',
                            'disabled:opacity-45 disabled:cursor-not-allowed',
                            'disabled:hover:brightness-100 disabled:hover:translate-y-0',
                            'disabled:hover:shadow-none',
                        ].join(' ')}
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-transparent border-t-black rounded-full animate-spin-fast inline-block" />
                                Shortening…
                            </>
                        ) : '→ Shorten'}
                    </button>
                </form>

                {error && (
                    <div className="mt-3 px-3.5 py-2.5 rounded bg-danger-dim border border-danger/25 text-danger text-[0.82rem]">
                        {error}
                    </div>
                )}
            </div>

            {result && <ResultCard result={result} />}
        </>
    );
}
