import { useState } from 'react'
import UrlForm from '../components/UrlForm'
import ResultCard from '../components/ResultCard'

const ScissorsIconLg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
)

export default function Home() {
  const [result, setResult] = useState(null)

  const handleResult = (data) => {
    setResult(data)
    // Smooth scroll to result on mobile
    setTimeout(() => {
      document.getElementById('result-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 100)
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="glow-spot" />

      {/* Hero content */}
      <div className="w-full max-w-xl space-y-10 relative z-10">

        {/* Header */}
        <div className="text-center space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 chip delay-100 animate-fade-up">
            <ScissorsIconLg />
            <span>URL Shortener</span>
          </div>

          {/* Title */}
          <h1
            className="text-5xl sm:text-6xl font-display font-bold leading-tight tracking-tight delay-200 animate-fade-up"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Snip it{' '}
            <span style={{ color: '#3ddc84' }}>short</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-subtle text-base sm:text-lg max-w-sm mx-auto leading-relaxed delay-300 animate-fade-up"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Paste a long URL and get a clean, shareable short link instantly.
          </p>
        </div>

        {/* Form */}
        <div className="delay-400 animate-fade-up">
          <UrlForm onResult={handleResult} />
        </div>

        {/* Result */}
        {result && (
          <div id="result-anchor" className="animate-fade-up">
            <ResultCard
              shortId={result.shortId}
              expiresAt={result.expiresAt}
              originalUrl={result.originalUrl}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center">
        <p
          className="text-xs text-muted"
          style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em' }}
        >
          snip · url shortener
        </p>
      </footer>
    </div>
  )
}
