import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDashboardPath, useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await register(form)
      navigate(user.status === 'approved' ? getDashboardPath(user.role) : '/pending-approval', { replace: true })
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-fin-mist px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl border border-fin-line bg-white p-6 shadow-panel sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Daftar akun</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fin-ink">Buat akun FinLearn</h1>
        <p className="mt-4 text-base font-medium leading-8 text-fin-text">
          Akun baru akan masuk ke daftar pending dan perlu disetujui admin sebelum dapat mengakses dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label className="block">
            <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Nama lengkap</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3.5 text-base font-semibold text-fin-ink outline-none transition focus:border-fin-forest focus:bg-white focus:ring-2 focus:ring-fin-sage"
              autoComplete="name"
              required
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3.5 text-base font-semibold text-fin-ink outline-none transition focus:border-fin-forest focus:bg-white focus:ring-2 focus:ring-fin-sage"
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Role</span>
              <select
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3.5 text-base font-semibold text-fin-ink outline-none transition focus:border-fin-forest focus:bg-white focus:ring-2 focus:ring-fin-sage"
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3.5 text-base font-semibold text-fin-ink outline-none transition focus:border-fin-forest focus:bg-white focus:ring-2 focus:ring-fin-sage"
              autoComplete="new-password"
              required
            />
          </label>

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-800" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-fin-forest px-6 py-3.5 text-base font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-fin-forestDark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar dan tunggu approval'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm font-semibold text-fin-text">
          Sudah punya akun? <Link to="/login" className="font-extrabold text-fin-forest hover:text-fin-ink">Masuk</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
