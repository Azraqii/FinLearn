import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { topics } from '../data/articles'
import { getMaterials } from '../services/api'

function sameTopic(materialTopic, selectedTopic) {
  return materialTopic === selectedTopic
}

function MaterialLinkCard({ title, description, to, cta, shortLabel, badge }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-fin-line bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-fin-sage hover:bg-fin-shell hover:shadow-panel focus:outline-none focus:ring-2 focus:ring-fin-forest focus:ring-offset-2 focus:ring-offset-fin-mist"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-fin-mist text-sm font-extrabold text-fin-forest ring-1 ring-fin-line transition group-hover:scale-105 group-hover:bg-fin-sageSoft">
          {shortLabel?.slice(0, 2).toUpperCase() || 'FL'}
        </div>
        {badge && (
          <span className="rounded-full border border-fin-sage bg-fin-sageSoft px-3 py-1 text-xs font-extrabold text-fin-forest">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-lg font-extrabold text-fin-ink transition group-hover:text-fin-forest">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-fin-text">{description}</p>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-fin-forest transition group-hover:gap-3 group-hover:text-fin-ink">
        {cta} <span aria-hidden="true" className="transition group-hover:translate-x-1">-&gt;</span>
      </div>
    </Link>
  )
}

function Learn() {
  const [mentorMaterials, setMentorMaterials] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(topics[0]?.slug || 'budgeting')

  useEffect(() => {
    let active = true
    getMaterials()
      .then((result) => {
        if (active) setMentorMaterials(result.data)
      })
      .catch(() => {
        if (active) setMentorMaterials([])
      })
    return () => {
      active = false
    }
  }, [])

  const activeTopic = topics.find((topic) => topic.slug === selectedTopic) || topics[0]
  const filteredMentorMaterials = useMemo(
    () => mentorMaterials.filter((material) => sameTopic(material.topic, selectedTopic)),
    [mentorMaterials, selectedTopic]
  )

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
              Mulai dari materi utama FinLearn, lalu tambah pemahamanmu lewat materi dari mentor.
            </p>
          </div>

          <div className="grid content-end gap-3">
            <div className="rounded-2xl border border-fin-sage bg-fin-sageSoft p-5">
              <p className="text-sm font-extrabold text-fin-ink">Alur belajar</p>
              <p className="mt-2 text-sm leading-6 text-fin-body">
                Pilih topik, baca materi utama, ikuti kuis, lalu jelajahi materi tambahan dari mentor.
              </p>
            </div>
          </div>
        </section>

        <section>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Pilih kategori</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {topics.map((topic) => (
              <button
                key={topic.slug}
                type="button"
                onClick={() => setSelectedTopic(topic.slug)}
                className={`rounded-2xl border p-6 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-panel ${
                  selectedTopic === topic.slug
                    ? 'border-fin-forest bg-fin-sageSoft ring-2 ring-fin-sage'
                    : 'border-fin-line bg-white hover:border-fin-sage hover:bg-fin-shell'
                }`}
              >
                <p className="text-lg font-extrabold text-fin-ink">{topic.title}</p>
                <p className="mt-3 text-sm leading-6 text-fin-text">{topic.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Topik terpilih</p>
            <h2 className="mt-2 text-3xl font-extrabold text-fin-ink">{activeTopic.title}</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <MaterialLinkCard
              title={`${activeTopic.title}: materi utama`}
              description={`${activeTopic.description} Materi ini dilengkapi kuis untuk menguji pemahamanmu.`}
              to={`/learn/${activeTopic.slug}`}
              cta="Baca & ikut kuis"
              shortLabel={activeTopic.title}
              badge="Ada kuis"
            />

            <div className="rounded-2xl border border-fin-line bg-white/75 p-6 shadow-soft">
              <div className="mb-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Materi dari mentor</p>
                <h3 className="mt-2 text-2xl font-extrabold text-fin-ink">Pilihan tambahan</h3>
              </div>

              {filteredMentorMaterials.length > 0 ? (
                <div className="grid gap-4">
                  {filteredMentorMaterials.map((material) => (
                    <MaterialLinkCard
                      key={material.id}
                      title={material.title}
                      description={material.summary || material.content}
                      to={`/learn/${material.slug || material.id}`}
                      cta="Buka materi"
                      shortLabel={material.title}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-fin-line bg-fin-shell p-5">
                  <p className="text-sm font-bold leading-6 text-fin-text">
                    Belum ada materi mentor untuk topik ini. Kamu tetap bisa mulai dari materi utama dan kuis FinLearn.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Learn
