import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import TopicCard from '../components/TopicCard'
import { getArticleBySlug, topics } from '../data/articles'

function Quiz() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const selectedTopic = searchParams.get('topic')

    if (selectedTopic && getArticleBySlug(selectedTopic)) {
      navigate(`/quiz/${selectedTopic}`, { replace: true })
    }
  }, [navigate, searchParams])

  return (
    <main className="min-h-screen bg-fin-mist">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-10 rounded-3xl border border-fin-line bg-white/75 p-6 shadow-soft sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Uji pemahaman</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fin-ink sm:text-5xl">
              Pilih topik kuis dan ukur progres belajarmu.
            </h1>
            <p className="mt-5 text-base font-medium leading-8 text-fin-text sm:text-lg">
              Setiap kuis berisi 5 soal pilihan ganda. Masukkan nama, jawab semua soal, lalu skor akan tersimpan untuk leaderboard.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['5 soal', 'Tanpa feedback langsung', 'Skor tersimpan'].map((item) => (
              <div key={item} className="rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-extrabold text-fin-text">
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} to={`/quiz/${topic.slug}`} cta="Mulai Kuis" />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Quiz
