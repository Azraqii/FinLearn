import { NavLink, Link } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Beranda' },
  { to: '/learn', label: 'Materi' },
  { to: '/quiz', label: 'Kuis' },
  { to: '/calculator', label: 'Kalkulator' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-fin-line bg-fin-mist/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3 transition hover:opacity-90">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fin-ink text-sm font-extrabold text-white shadow-soft ring-1 ring-white/50">
            FL
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

        <Link
          to="/quiz"
          className="hidden rounded-xl bg-fin-ink px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-fin-inkSoft focus:outline-none focus:ring-2 focus:ring-fin-forest focus:ring-offset-2 focus:ring-offset-fin-mist sm:inline-flex"
        >
          Ikut Kuis
        </Link>
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
      </nav>
    </header>
  )
}

export default Navbar
