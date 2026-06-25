import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Button from '../../common/Button/Button'

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const locationState = location.state as { flow?: string; from?: { pathname?: string } } | null
  const isStudentFlow = locationState?.flow === 'student'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const authenticated = await login(username, password)
      const from = locationState?.from?.pathname
      navigate(from ?? `/${authenticated.role}/dashboard`, { replace: true })
    } catch {
      // Error owned by AuthContext
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        borderRadius: 'var(--m-r-2xl)',
        border: '1px solid var(--m-border)',
        background: 'var(--m-surface-card)',
        padding: '2rem',
        boxShadow: 'var(--m-shadow-lg)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: 800, color: 'var(--m-text-strong)', letterSpacing: '-0.025em', margin: 0 }}>
          {isStudentFlow ? 'Student Login' : 'Welcome back'}
        </h2>
        <p style={{ marginTop: '0.625rem', color: 'var(--m-text-muted)', fontSize: '0.9375rem', margin: '0.625rem 0 0' }}>
          {isStudentFlow
            ? 'Enter the credentials your teacher provided.'
            : 'Sign in to access your Mentoro workspace.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--m-text)', letterSpacing: '0.01em' }}>
          Username
          <input
            type="text"
            value={username}
            autoComplete="username"
            onChange={(e) => { clearError(); setUsername(e.target.value) }}
            style={{ marginTop: '0.5rem' }}
            required
          />
        </label>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--m-text)', letterSpacing: '0.01em' }}>
          Password
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => { clearError(); setPassword(e.target.value) }}
            style={{ marginTop: '0.5rem' }}
            required
          />
        </label>
      </div>

      {error && (
        <p style={{
          borderRadius: 'var(--m-r-md)',
          border: '1px solid var(--m-danger)',
          background: 'var(--m-danger-soft)',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          color: 'var(--m-danger-text)',
          margin: 0,
        }}>
          {error}
        </p>
      )}

      <Button label={loading ? 'Signing in...' : 'Sign in'} type="submit" disabled={loading} />

      {!isStudentFlow && (
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--m-text-muted)', margin: 0 }}>
          New teacher?{' '}
          <Link to="/register" state={{ flow: 'teacher' }} style={{ color: 'var(--m-accent-text)', fontWeight: 600, transition: 'color var(--m-duration)' }}>
            Create an account
          </Link>
        </p>
      )}

      {isStudentFlow && (
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--m-text-faint)', margin: 0 }}>
          Student accounts are created by your teacher. Contact them if you need credentials.
        </p>
      )}
    </form>
  )
}

export default LoginForm
