import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Beranda' },
  { to: '/learn', label: 'Materi' },
  { to: '/quiz', label: 'Kuis' },
  { to: '/calculator', label: 'Kalkulator' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

function Navbar() {
  const { isAuthenticated, user, dashboardPath, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-fin-line bg-fin-mist/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3 transition hover:opacity-90">
          <div
            className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-soft"
            style={{ background: 'linear-gradient(140deg, #34653B 10%, #142D3D 88%)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }}>
              <polyline points="3,17 8,11 13,14 21,5" stroke="#A9C6AB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="17,5 21,5 21,9" stroke="#A9C6AB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="19.5" x2="21" y2="19.5" stroke="#6FA874" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold tracking-tight text-fin-ink">FinLearn</p>
            <p className="hidden text-xs font-medium text-fin-text sm:block">Literasi finansial pelajar</p>
          </div>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 rounded-xl border border-fin-line bg-white/75 p-1 text-sm font-semibold text-fin-text shadow-sm md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-fin-forest text-white shadow-lift'
                    : 'text-fin-text hover:bg-fin-mist hover:text-fin-ink'
                }`
              }
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="rounded-xl bg-fin-ink px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-fin-inkSoft focus:outline-none focus:ring-2 focus:ring-fin-forest focus:ring-offset-2 focus:ring-offset-fin-mist"
              >
                {user.role}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-fin-sage bg-white px-4 py-2.5 text-sm font-bold text-fin-ink transition hover:bg-fin-shell"
              >
                Keluar
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-fin-ink px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-fin-inkSoft focus:outline-none focus:ring-2 focus:ring-fin-forest focus:ring-offset-2 focus:ring-offset-fin-mist"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>

      <nav aria-label="Navigasi mobile" className="flex gap-2 overflow-x-auto border-t border-fin-line bg-white/80 px-4 py-3 text-sm font-semibold text-fin-text md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-2 transition-colors ${
                isActive ? 'bg-fin-forest text-white' : 'hover:bg-fin-mist hover:text-fin-ink'
              }`
            }
            end={item.to === '/'}
          >
            {item.label}
          </NavLink>
        ))}
        {isAuthenticated ? (
          <NavLink to={dashboardPath} className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-fin-mist hover:text-fin-ink">
            Dashboard
          </NavLink>
        ) : (
          <NavLink to="/login" className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-fin-mist hover:text-fin-ink">
            Masuk
          </NavLink>
        )}
      </nav>
    </header>
  )
}

export default Navbar
