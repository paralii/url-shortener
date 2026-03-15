import { useState } from 'react';
import './index.css';
import ShortenForm from './components/ShortenForm';
import StatsLookup from './components/StatsLookup';

const TABS = [
  { id: 'shorten', label: 'Shorten' },
  { id: 'stats',   label: 'Stats'   },
];

export default function App() {
  const [tab, setTab] = useState('shorten');

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span
            className="font-display text-[1.8rem] tracking-[0.08em] text-accent leading-none select-none"
          >
            SHR<span className="text-ink-dim">.</span>T
          </span>

          <nav className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'text-[0.78rem] font-medium tracking-[0.08em] uppercase px-3.5 py-1.5 rounded',
                  'border transition-all duration-[180ms] cursor-pointer',
                  tab === t.id
                    ? 'text-accent border-accent bg-accent-dim'
                    : 'text-ink-dim border-transparent hover:text-ink hover:border-border-hi',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center px-4 pt-12 pb-20">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="font-display text-[clamp(2.4rem,6vw,3.6rem)] tracking-[0.08em] text-ink leading-[1.05] mb-2.5">
            Long URLs,<br />
            <span className="text-accent">cut short.</span>
          </h1>
          <p className="text-[0.88rem] text-ink-dim leading-relaxed">
            Fast, clean link shortening with click tracking and expiry control.
          </p>
        </div>

        {tab === 'shorten' && <ShortenForm />}
        {tab === 'stats'   && <StatsLookup />}
      </main>
    </div>
  );
}
