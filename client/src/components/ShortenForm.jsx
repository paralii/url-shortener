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

// Preset durations — value is seconds, null = never expires
const EXPIRY_PRESETS = [
    { label: 'Never',   value: null },
    { label: '1 hour',  value: 60 * 60 },
    { label: '24 hrs',  value: 60 * 60 * 24 },
    { label: '7 days',  value: 60 * 60 * 24 * 7 },
    { label: '30 days', value: 60 * 60 * 24 * 30 },
];

const inputCls = [
    'w-full bg-bg border rounded px-3.5 py-2.5',
    'font-mono text-[0.85rem] text-ink placeholder:text-ink-dim',
    'outline-none transition-all duration-[180ms]',
    'border-border-hi focus:border-accent',
    'focus:shadow-[0_0_0_3px_var(--color-accent-glow)]',
].join(' ');

const inputErrCls = inputCls + ' !border-danger !shadow-[0_0_0_3px_var(--color-danger-dim)]';

export default function ShortenForm() {
    const [url, setUrl]             = useState('');
    const [expiryIdx, setExpiryIdx] = useState(0); // default: Never
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');
    const [result, setResult]       = useState(null);
    const [touched, setTouched]     = useState(false);

    const urlError = touched && url && !isValidUrl(url) ? 'Enter a valid URL' : '';

    async function handleSubmit(e) {
        e.preventDefault();
        setTouched(true);
        if (!url || !isValidUrl(url)) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const expiresIn = EXPIRY_PRESETS[expiryIdx].value; // seconds or null
            const data = await shortenUrl(url, expiresIn);
            setResult(data);
            setUrl('');
            setExpiryIdx(0);
            setTouched(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="w-full max-w-[640px] bg-surface border border-border rounded p-8 animate-fade-up">
                <p className="font-display text-[1.5rem] tracking-[0.06em] text-ink mb-1">
                    Shorten a URL
                </p>
                <p className="text-[0.82rem] text-ink-dim mb-7 leading-relaxed">
                    Paste any long link — get a clean short one back.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    {/* URL field */}
                    <div className="flex flex-col gap-1.5 mb-5">
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
                        <span className="text-[0.73rem] text-danger min-h-[16px]">{urlError}</span>
                    </div>

                    {/* Expiry presets */}
                    <div className="flex flex-col gap-2 mb-6">
                        <span className="text-[0.72rem] font-medium tracking-[0.1em] uppercase text-ink-dim">
                            Link expires in
                        </span>
                        <div className="flex gap-2 flex-wrap">
                            {EXPIRY_PRESETS.map((p, i) => (
                                <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => setExpiryIdx(i)}
                                    className={[
                                        'px-3.5 py-1.5 rounded border text-[0.75rem] font-medium',
                                        'tracking-[0.04em] transition-all duration-[180ms] cursor-pointer',
                                        expiryIdx === i
                                            ? 'bg-accent-dim border-accent text-accent'
                                            : 'bg-bg border-border-hi text-ink-dim hover:border-accent hover:text-accent',
                                    ].join(' ')}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={[
                            'w-full py-3 px-6 rounded font-semibold text-[0.82rem]',
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
