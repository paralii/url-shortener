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
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        } catch {
            // fallback for older browsers
            const el = document.createElement('textarea');
            el.value = shortUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        }
    }

    return (
        <div className="result-card">
            <p className="result-label">Your short link is ready</p>

            <div className="result-url-row">
                <a
                    className="result-url"
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={shortUrl}
                >
                    {shortUrl}
                </a>
                <button
                    className={`btn btn-icon${copied ? ' copied' : ''}`}
                    onClick={handleCopy}
                    title="Copy to clipboard"
                >
                    {copied ? '✓ Copied' : '⎘ Copy'}
                </button>
            </div>

            <div className="result-meta">
                <div className="meta-item">
                    <span className="meta-key">Short ID</span>
                    <span className="meta-val">{result.shortId}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-key">Expires</span>
                    <span className="meta-val">{fmt(result.expiresAt)}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-key">Destination</span>
                    <span className="meta-val" style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {result.originalUrl}
                    </span>
                </div>
            </div>
        </div>
    );
}
