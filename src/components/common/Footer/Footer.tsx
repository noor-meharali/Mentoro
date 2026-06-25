import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer
      className="px-4 py-6 text-sm sm:px-6 lg:px-8"
      style={{
        borderTop: '1px solid var(--m-border)',
        background: 'var(--m-surface-strong)',
        color: 'var(--m-text-muted)',
        letterSpacing: '0.01em',
      }}
    >
      <div className="mx-auto w-full max-w-7xl flex items-center justify-between gap-4 flex-wrap">
        <span>
          <span style={{ background: 'linear-gradient(135deg, #c4a8ff 0%, #9b6dff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 700 }}>Mentoro</span>
          {' '}© 2026. Crafted for modern enterprise learning teams.
        </span>
      </div>
    </footer>
  )
}

export default Footer
