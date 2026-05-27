import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getDashboardPath, useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await login(form)
      const fallbackPath = getDashboardPath(user.role)
      navigate(location.state?.from?.pathname || fallbackPath, { replace: true })
    } catch (err) {
      setError(err.message || 'Login gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-fin-mist px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-fin-line bg-white/80 p-6 shadow-panel sm:p-8 lg:grid-cols-[1fr_420px]">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Masuk akun</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fin-ink sm:text-5xl">
              Lanjutkan belajar sesuai peranmu.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-fin-text">
              Student, mentor, dan superadmin masuk dari satu pintu. Setelah login, dashboard akan menyesuaikan role akun.
            </p>
          </div>

          <div className="grid gap-3 text-sm font-semibold text-fin-text sm:grid-cols-3">
            <div className="rounded-2xl border border-fin-line bg-fin-shell p-4">
              <p className="font-extrabold text-fin-ink">Superadmin</p>
              <p className="mt-1">admin@finlearn.local</p>
            </div>
            <div className="rounded-2xl border border-fin-line bg-fin-shell p-4">
              <p className="font-extrabold text-fin-ink">Mentor</p>
              <p className="mt-1">mentor@finlearn.local</p>
            </div>
            <div className="rounded-2xl border border-fin-line bg-fin-shell p-4">
              <p className="font-extrabold text-fin-ink">Student</p>
              <p className="mt-1">student@finlearn.local</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-fin-line bg-white p-5 shadow-soft sm:p-6">
          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3.5 text-base font-semibold text-fin-ink outline-none transition focus:border-fin-forest focus:bg-white focus:ring-2 focus:ring-fin-sage"
                placeholder="nama@email.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3.5 text-base font-semibold text-fin-ink outline-none transition focus:border-fin-forest focus:bg-white focus:ring-2 focus:ring-fin-sage"
                placeholder="password"
                autoComplete="current-password"
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
              className="w-full rounded-xl bg-fin-forest px-6 py-3.5 text-base font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-fin-forestDark disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>

          <p className="mt-5 text-center text-sm font-semibold text-fin-text">
            Belum punya akun? <Link to="/register" className="font-extrabold text-fin-forest hover:text-fin-ink">Daftar sekarang</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Login
