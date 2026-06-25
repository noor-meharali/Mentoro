import React from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const AuthLayout: React.FC = () => {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return (
    <div
      className="min-h-screen overflow-x-clip px-4 py-5 sm:px-6 sm:py-8"
      style={{ background: 'var(--m-bg)', color: 'var(--m-text-strong)' }}
    >
      <div className="mx-auto mb-5 flex w-full max-w-5xl items-center justify-between gap-4 sm:mb-6">
        <Link
          to="/"
          style={{
            fontSize: '1.0625rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #c4a8ff 0%, #9b6dff 50%, #e8c76a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
          }}
        >
          Mentoro Studio
        </Link>
        <Link
          to="/"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            border: '1px solid var(--m-border)',
            background: 'var(--m-surface-hover)',
            color: 'var(--m-text-muted)',
            borderRadius: 'var(--m-r-pill)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'all var(--m-duration)',
          }}
        >
          Back home
        </Link>
      </div>
      <div
        className="mx-auto w-full max-w-5xl p-3 sm:p-6 lg:p-8"
        style={{
          border: '1px solid var(--m-border)',
          background: 'var(--m-surface-card)',
          borderRadius: 'var(--m-r-2xl)',
          boxShadow: 'var(--m-shadow-lg)',
          backdropFilter: 'blur(32px)',
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
