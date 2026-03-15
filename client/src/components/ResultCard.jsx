import { useState } from 'react';
import { buildShortUrl } from '../api/urlApi';

function fmt(dateStr) {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

export default function ResultCard({ result }) {
    const [copied, setCopied] = useState(false);
    const shortUrl = buildShortUrl(result.shortId);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(shortUrl);
        } catch {
            const el = document.createElement('textarea');
            el.value = shortUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
    }

    return (
        <div className="w-full max-w-[640px] bg-surface border border-border border-t-2 border-t-accent rounded px-8 py-6 mt-4 animate-fade-up">
            <p className="text-[0.7rem] tracking-[0.12em] uppercase text-ink-dim mb-2.5">
                Your short link is ready
            </p>

            {/* URL + copy row */}
            <div className="flex items-center gap-2 mb-4">
                <a
                    className="font-mono text-[1.05rem] text-accent flex-1 overflow-hidden text-ellipsis whitespace-nowrap tracking-[0.02em] hover:underline"
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={shortUrl}
                >
                    {shortUrl}
                </a>
                <button
                    onClick={handleCopy}
                    title="Copy to clipboard"
                    className={[
                        'shrink-0 px-3 py-2 rounded border text-[0.75rem] font-medium',
                        'tracking-[0.06em] uppercase transition-all duration-[180ms] cursor-pointer',
                        copied
                            ? 'border-ok text-ok bg-ok-dim'
                            : 'border-border-hi text-ink-subtle bg-surface-2 hover:border-accent hover:text-accent',
                    ].join(' ')}
                >
                    {copied ? '✓ Copied' : '⎘ Copy'}
                </button>
            </div>

            {/* Meta row */}
            <div className="flex gap-5 flex-wrap pt-3.5 border-t border-border">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[0.68rem] tracking-[0.1em] uppercase text-ink-dim">Short ID</span>
                    <span className="font-mono text-[0.8rem] text-ink-subtle">{result.shortId}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-[0.68rem] tracking-[0.1em] uppercase text-ink-dim">Expires</span>
                    <span className="font-mono text-[0.8rem] text-ink-subtle">{fmt(result.expiresAt)}</span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[0.68rem] tracking-[0.1em] uppercase text-ink-dim">Destination</span>
                    <span className="font-mono text-[0.8rem] text-ink-subtle max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap block">
                        {result.originalUrl}
                    </span>
                </div>
            </div>
        </div>
    );
}
