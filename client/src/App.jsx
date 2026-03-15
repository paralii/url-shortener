import { useState } from 'react';
import './index.css';
import './App.css';
import ShortenForm from './components/ShortenForm';
import StatsLookup from './components/StatsLookup';

const TABS = [
  { id: 'shorten', label: 'Shorten' },
  { id: 'stats',   label: 'Stats'   },
];

export default function App() {
  const [tab, setTab] = useState('shorten');

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <span className="logo">SHR<span>.</span>T</span>
          <nav className="nav">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`nav-btn${tab === t.id ? ' active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="app-main">
        <div className="hero">
          <h1 className="hero-title">
            Long URLs,<br /><span className="accent">cut short.</span>
          </h1>
          <p className="hero-sub">
            Fast, clean link shortening with click tracking and expiry control.
          </p>
        </div>

        {tab === 'shorten' && <ShortenForm />}
        {tab === 'stats'   && <StatsLookup />}
      </main>
    </div>
  );
}
