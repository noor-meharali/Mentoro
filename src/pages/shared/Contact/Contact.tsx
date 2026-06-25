import React, { useState } from 'react'

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would POST to an API endpoint
    setSubmitted(true)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
      <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:rounded-[2rem] sm:p-8 lg:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70 sm:text-sm sm:tracking-[0.35em]">Contact</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">Talk to our team</h1>
        <p className="mt-5 text-base leading-7 text-slate-300 sm:mt-6">Reach out for enterprise deployment, partner onboarding, or product demos.</p>
        <div className="mt-8 space-y-4 text-slate-300">
          <p>
            <a href="mailto:hello@mentoro.app" className="transition hover:text-white">
              hello@mentoro.app
            </a>
          </p>
          <p>+92-3295-482080</p>
          <p>Ghauri VIP, Islamabad</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:rounded-[2rem] sm:p-8 lg:p-10">
        {submitted ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl">
              ✓
            </div>
            <h2 className="text-xl font-semibold text-white">Message sent!</h2>
            <p className="text-slate-400">We'll get back to you within 24 hours.</p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }) }}
              className="mt-2 rounded-full border border-white/10 px-5 py-2 text-sm text-slate-300 transition hover:bg-white/5"
            >
              Send another
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <label className="block text-sm text-slate-300">
              Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                autoComplete="name"
                className="mt-2 min-h-11 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400 sm:rounded-3xl"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
                className="mt-2 min-h-11 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400 sm:rounded-3xl"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Message
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
                rows={5}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400 sm:rounded-3xl"
              />
            </label>
            <button
              type="submit"
              className="min-h-11 w-full rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Contact
