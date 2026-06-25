import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../../services/authService'
import { useAuth } from '../../../hooks/useAuth'
import Button from '../../common/Button/Button'

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)
    setSubmitting(true)
    try {
      await authService.registerTeacher(name, username, password)
      await login(username, password)
      navigate('/teacher/dashboard', { replace: true })
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Unable to create account.')
    } finally {
      setSubmitting(false)
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
        <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--m-accent-text)', opacity: 0.80, margin: 0 }}>For educators</p>
        <h2 style={{ marginTop: '0.875rem', fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: 800, color: 'var(--m-text-strong)', letterSpacing: '-0.025em', margin: '0.875rem 0 0' }}>
          Create Teacher Account
        </h2>
        <p style={{ marginTop: '0.625rem', color: 'var(--m-text-muted)', fontSize: '0.9375rem', margin: '0.625rem 0 0' }}>
          Set up your Mentoro teaching workspace.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--m-text)', letterSpacing: '0.01em' }}>
          Full name
          <input
            type="text"
            value={name}
            onChange={(e) => { setLocalError(null); setName(e.target.value) }}
            style={{ marginTop: '0.5rem' }}
            required
          />
        </label>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--m-text)', letterSpacing: '0.01em' }}>
          Username
          <input
            type="text"
            value={username}
            autoComplete="username"
            onChange={(e) => { setLocalError(null); setUsername(e.target.value) }}
            style={{ marginTop: '0.5rem' }}
            required
          />
        </label>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--m-text)', letterSpacing: '0.01em' }}>
          Password
          <input
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => { setLocalError(null); setPassword(e.target.value) }}
            minLength={6}
            style={{ marginTop: '0.5rem' }}
            required
          />
        </label>
      </div>

      {localError && (
        <p style={{
          borderRadius: 'var(--m-r-md)',
          border: '1px solid var(--m-danger)',
          background: 'var(--m-danger-soft)',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          color: 'var(--m-danger-text)',
          margin: 0,
        }}>
          {localError}
        </p>
      )}

      <Button label={submitting ? 'Creating account...' : 'Create account'} type="submit" disabled={submitting} />

      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--m-text-muted)', margin: 0 }}>
        Already have an account?{' '}
        <Link to="/login" state={{ flow: 'teacher' }} style={{ color: 'var(--m-accent-text)', fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm
