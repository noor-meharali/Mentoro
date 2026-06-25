import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:gap-10 xl:gap-16">
      <section className="min-w-0 space-y-6 sm:space-y-8">
        {/* Teacher CTA card */}
        <div style={{
          maxWidth: '42rem',
          borderRadius: 'var(--m-r-2xl)',
          border: '1px solid var(--m-border)',
          background: 'var(--m-surface-card)',
          padding: '2rem',
          boxShadow: 'var(--m-shadow-lg)',
          backdropFilter: 'blur(24px)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glow orb */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--m-accent-soft) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <p style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--m-accent-text)',
            opacity: 0.85,
            margin: 0,
          }}>
            For educators
          </p>
          <h1 style={{
            marginTop: '1.125rem',
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--m-text-strong)',
            letterSpacing: '-0.025em',
            margin: '1.125rem 0 0',
          }}>
            Transform learning into a premium campus experience.
          </h1>
          <p style={{
            marginTop: '1rem',
            maxWidth: '36rem',
            fontSize: '1rem',
            lineHeight: 1.75,
            color: 'var(--m-text-muted)',
            margin: '1rem 0 0',
          }}>
            Deliver adaptive courses, manage student access, and track outcomes with a secure platform designed for premium education.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link
              to="/login"
              state={{ flow: 'teacher' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '2.75rem',
                padding: '0.6875rem 1.625rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #9b6dff 0%, #7c3aed 60%, #6d28d9 100%)',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 20px rgba(139,92,246,0.40), inset 0 1px 0 rgba(255,255,255,0.14)',
                transition: 'all var(--m-duration) var(--m-ease)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              Teacher Login
            </Link>
            <Link
              to="/register"
              state={{ flow: 'teacher' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '2.75rem',
                padding: '0.6875rem 1.5rem',
                borderRadius: '9999px',
                border: '1px solid var(--m-border-accent)',
                background: 'var(--m-accent-soft)',
                color: 'var(--m-accent-text)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all var(--m-duration) var(--m-ease)',
              }}
            >
              Teacher Sign Up
            </Link>
          </div>
        </div>

        {/* Student CTA card */}
        <div style={{
          maxWidth: '42rem',
          borderRadius: 'var(--m-r-2xl)',
          border: '1px solid var(--m-success)',
          background: 'var(--m-surface-card)',
          padding: '2rem',
          boxShadow: 'var(--m-shadow-md)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--m-success-soft) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <p style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--m-success-text)',
            opacity: 0.85,
            margin: 0,
          }}>
            For students
          </p>
          <h2 style={{
            marginTop: '1rem',
            fontSize: 'clamp(1.3rem, 3vw, 1.875rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'var(--m-text-strong)',
            letterSpacing: '-0.02em',
            margin: '1rem 0 0',
          }}>
            Access your assigned courses.
          </h2>
          <p style={{
            marginTop: '0.875rem',
            maxWidth: '36rem',
            fontSize: '0.9375rem',
            lineHeight: 1.75,
            color: 'var(--m-text-muted)',
            margin: '0.875rem 0 0',
          }}>
            Sign in with the credentials provided by your teacher to access your personalised learning workspace.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link
              to="/login"
              state={{ flow: 'student' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '2.75rem',
                padding: '0.6875rem 1.625rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
                color: '#022009',
                fontSize: '0.875rem',
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 18px rgba(74,222,128,0.30)',
                transition: 'all var(--m-duration) var(--m-ease)',
              }}
            >
              Student Login
            </Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--m-success-text)', margin: '1rem 0 0' }}>
            Student accounts are created by teachers only. Contact your teacher if you need access.
          </p>
        </div>
      </section>

      <section className="grid min-w-0 gap-5 sm:gap-6">
        {/* Snapshot card */}
        <div style={{
          borderRadius: 'var(--m-r-2xl)',
          border: '1px solid var(--m-border)',
          background: 'var(--m-surface-card)',
          padding: '1.75rem',
          boxShadow: 'var(--m-shadow-md)',
          backdropFilter: 'blur(20px)',
        }}>
          <p style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--m-accent-text)',
            opacity: 0.80,
            margin: 0,
          }}>
            Snapshot
          </p>
          <div style={{ marginTop: '1.375rem', display: 'grid', gap: '0.875rem' }}>
            <div style={{
              borderRadius: 'var(--m-r-lg)',
              background: 'var(--m-surface-hover)',
              border: '1px solid var(--m-border)',
              padding: '1.125rem',
            }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--m-text-muted)', margin: 0 }}>Active students</p>
              <h2 style={{
                marginTop: '0.75rem',
                fontSize: '1.875rem',
                fontWeight: 800,
                color: 'var(--m-text-strong)',
                letterSpacing: '-0.03em',
                margin: '0.75rem 0 0',
              }}>1.2K</h2>
            </div>
            <div style={{
              borderRadius: 'var(--m-r-lg)',
              background: 'var(--m-surface-hover)',
              border: '1px solid var(--m-border)',
              padding: '1.125rem',
            }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--m-text-muted)', margin: 0 }}>Monthly course launches</p>
              <h2 style={{
                marginTop: '0.75rem',
                fontSize: '1.875rem',
                fontWeight: 800,
                color: 'var(--m-text-strong)',
                letterSpacing: '-0.03em',
                margin: '0.75rem 0 0',
              }}>16</h2>
            </div>
          </div>
        </div>

        {/* Why Mentoro card */}
        <div style={{
          borderRadius: 'var(--m-r-2xl)',
          border: '1px solid var(--m-border)',
          background: 'var(--m-surface-card)',
          padding: '1.75rem',
          boxShadow: 'var(--m-shadow-md)',
          backdropFilter: 'blur(20px)',
        }}>
          <p style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--m-accent-text)',
            opacity: 0.80,
            margin: 0,
          }}>
            Why Mentoro
          </p>
          <ul style={{
            marginTop: '1.375rem',
            paddingLeft: '0',
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
            color: 'var(--m-text-muted)',
          }}>
            {[
              'Secure, teacher-controlled student access',
              'Per-student course assignment & isolation',
              'Premium analytics with live progress tracking',
              'Modern course authoring and student pipelines',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <span style={{
                  flexShrink: 0,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--m-accent-soft)',
                  border: '1px solid var(--m-border-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                }}>
                  <svg viewBox="0 0 10 10" fill="none" width="8" height="8">
                    <path d="M2 5l2.5 2.5L8 3" stroke="var(--m-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Home
