import { topics } from '../data/articles'

function getTopicLabel(slug) {
  return topics.find((topic) => topic.slug === slug)?.title || slug
}

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function ScoreTable({ scores }) {
  const sortedScores = [...scores]
    .sort((a, b) => {
      if (Number(b.score) !== Number(a.score)) return Number(b.score) - Number(a.score)
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    })
    .slice(0, 10)

  if (sortedScores.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-fin-sage bg-white/75 p-10 text-center">
        <p className="text-xl font-extrabold text-fin-ink">Belum ada skor</p>
        <p className="mt-2 text-base leading-7 text-fin-text">Mulai kuis sekarang dan tampilkan namamu di leaderboard.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-fin-line bg-white shadow-panel">
      <div className="grid gap-3 border-b border-fin-line bg-fin-shell p-5 sm:grid-cols-3">
        {sortedScores.slice(0, 3).map((score, index) => (
          <div key={score.id || `${score.name}-${score.created_at}-podium`} className="rounded-2xl border border-fin-line bg-white p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-forest">Peringkat {index + 1}</p>
            <p className="mt-2 truncate text-lg font-extrabold text-fin-ink">{score.name}</p>
            <p className="mt-1 text-sm font-bold text-fin-text">{getTopicLabel(score.topic)} - {score.score}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-fin-line text-sm">
          <thead className="bg-fin-mist text-left text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">
            <tr>
              <th className="w-16 px-5 py-4">Rank</th>
              <th className="px-5 py-4">Nama</th>
              <th className="px-5 py-4">Topik</th>
              <th className="px-5 py-4 text-right">Skor</th>
              <th className="px-5 py-4 text-right">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fin-line">
            {sortedScores.map((score, index) => {
              const rank = index + 1

              return (
                <tr
                  key={score.id || `${score.name}-${score.created_at}`}
                  className={rank <= 3 ? 'bg-fin-shell hover:bg-fin-mist' : 'hover:bg-fin-shell'}
                >
                  <td className="px-5 py-4">
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold ${
                      rank <= 3 ? 'bg-fin-ink text-white' : 'bg-fin-mist text-fin-text'
                    }`}>
                      {rank}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-extrabold text-fin-ink">{score.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-fin-text">{getTopicLabel(score.topic)}</p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex min-w-14 items-center justify-center rounded-xl border border-fin-sage bg-fin-sageSoft px-3 py-1.5 font-extrabold text-fin-forest">
                      {score.score}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs font-semibold text-fin-muted">
                    {formatDate(score.created_at)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ScoreTable
