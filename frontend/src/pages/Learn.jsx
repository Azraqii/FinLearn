import { useEffect, useState } from 'react'
import TopicCard from '../components/TopicCard'
import { topics } from '../data/articles'
import { getMaterials } from '../services/api'

function Learn() {
  const [backendMaterials, setBackendMaterials] = useState([])

  useEffect(() => {
    let active = true
    getMaterials()
      .then((result) => {
        if (active) setBackendMaterials(result.data)
      })
      .catch(() => {
        if (active) setBackendMaterials([])
      })
    return () => {
      active = false
    }
  }, [])

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

        {backendMaterials.length > 0 && (
          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Materi dari mentor</p>
                <h2 className="mt-2 text-3xl font-extrabold text-fin-ink">Materi backend</h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {backendMaterials.map((material) => (
                <TopicCard
                  key={material.id}
                  topic={{
                    slug: material.slug || material.id,
                    title: material.title,
                    description: material.summary || material.content,
                    shortLabel: material.title,
                  }}
                  to={`/learn/${material.slug || material.id}`}
                  cta="Buka Materi"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default Learn
