import { useEffect, useState } from 'react'
import ScoreTable from '../components/ScoreTable'
import { topics } from '../data/articles'
import { getLeaderboard } from '../services/api'

const tabs = [{ slug: 'all', title: 'Semua' }, ...topics]

function Leaderboard() {
  const [activeTopic, setActiveTopic] = useState('all')
  const [scores, setScores] = useState([])
  const [source, setSource] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadLeaderboard() {
      try {
        setLoading(true)
        setError('')

        const result = await getLeaderboard(activeTopic)

        if (!active) return

        setScores(Array.isArray(result.data) ? result.data : [])
        setSource(result.source)
      } catch (err) {
        if (active) {
          setError(err.message || 'Gagal memuat leaderboard.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()

    return () => {
      active = false
    }
  }, [activeTopic])

  const bestScore = scores.length ? Math.max(...scores.map((score) => Number(score.score) || 0)) : 0
  const activeLabel = tabs.find((tab) => tab.slug === activeTopic)?.title || 'Semua'

  return (
    <main className="min-h-screen bg-fin-mist">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-8 grid gap-6 rounded-3xl border border-fin-line bg-white/75 p-6 shadow-soft sm:p-8 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Peringkat kuis</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fin-ink sm:text-5xl">Top 10 skor kuis</h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-fin-text sm:text-lg">
              Leaderboard menampilkan skor tertinggi dari backend, atau fallback lokal di browser saat backend belum aktif.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-2xl bg-fin-ink p-5 text-white">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-sage">Topik aktif</p>
              <p className="mt-2 text-xl font-extrabold">{activeLabel}</p>
            </div>
            <div className="rounded-2xl border border-fin-sage bg-fin-sageSoft p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-forest">Skor terbaik</p>
              <p className="mt-2 text-3xl font-extrabold text-fin-ink">{bestScore}</p>
            </div>
          </div>
        </section>

        <div className="mb-6 overflow-x-auto">
          <div className="flex w-fit gap-2 rounded-2xl border border-fin-line bg-white p-2 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActiveTopic(tab.slug)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-extrabold transition-all ${
                  activeTopic === tab.slug
                    ? 'bg-fin-forest text-white shadow-lift'
                    : 'text-fin-text hover:bg-fin-mist hover:text-fin-ink'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        {source && (
          <div className="mb-6 inline-flex rounded-full border border-fin-sage bg-fin-sageSoft px-4 py-2">
            <p className="text-xs font-extrabold text-fin-body">Sumber: {source === 'backend' ? 'Database Backend' : 'Browser Demo'}</p>
          </div>
        )}

        {loading && (
          <div className="rounded-3xl border border-fin-line bg-white p-10 text-center shadow-soft" aria-live="polite">
            <div className="mx-auto h-3 w-28 animate-pulse rounded-full bg-fin-line" />
            <div className="mx-auto mt-4 h-8 w-64 max-w-full animate-pulse rounded-full bg-fin-mist" />
            <p className="mt-5 text-base font-extrabold text-fin-text">Memuat leaderboard...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8" role="alert">
            <p className="text-lg font-extrabold text-red-900">Leaderboard belum bisa dimuat</p>
            <p className="mt-3 text-base leading-7 text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && <ScoreTable scores={scores} />}
      </div>
    </main>
  )
}

export default Leaderboard
