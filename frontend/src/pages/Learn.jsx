import TopicCard from '../components/TopicCard'
import { topics } from '../data/articles'

function Learn() {
  return (
    <main className="min-h-screen bg-fin-mist">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-10 grid gap-8 rounded-3xl border border-fin-line bg-white/75 p-6 shadow-soft sm:p-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Materi pembelajaran</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-fin-ink sm:text-5xl">
              Pilih topik finansial yang ingin kamu kuasai.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-fin-text sm:text-lg">
              Setiap materi dibuat ringkas, kontekstual untuk pelajar Indonesia, dan dilengkapi contoh yang dekat dengan keputusan uang sehari-hari.
            </p>
          </div>

          <div className="grid content-end gap-3">
            <div className="rounded-2xl border border-fin-sage bg-fin-sageSoft p-5">
              <p className="text-sm font-extrabold text-fin-ink">Alur belajar</p>
              <p className="mt-2 text-sm leading-6 text-fin-body">
                Baca materi, catat poin penting, lalu lanjutkan ke kuis untuk menguji pemahamanmu.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} to={`/learn/${topic.slug}`} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Learn
