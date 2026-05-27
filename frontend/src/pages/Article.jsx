import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getArticleBySlug } from '../data/articles'
import { getMaterial } from '../services/api'

function formatSourceName(name) {
  return name
}

function Article() {
  const { topic } = useParams()
  const staticArticle = getArticleBySlug(topic)
  const [backendArticle, setBackendArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(!staticArticle)
  const articleRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const article = staticArticle || backendArticle
  const hasQuiz = Boolean(staticArticle)

  useEffect(() => {
    let active = true
    setBackendArticle(null)

    if (staticArticle) {
      setIsLoading(false)
      return () => {
        active = false
      }
    }

    setIsLoading(true)
    getMaterial(topic)
      .then((result) => {
        if (!active) return
        const material = result.data
        setBackendArticle({
          slug: material.slug || String(material.id),
          title: material.title,
          summary: material.summary || `Materi ${material.topic || 'FinLearn'} dari mentor ${material.author || 'FinLearn'}.`,
          readingTime: 'Materi mentor',
          sections: [
            {
              heading: material.topic ? `Topik ${material.topic}` : 'Materi',
              paragraphs: String(material.content || '')
                .split(/\n+/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean),
            },
          ],
          tips: [],
          sources: [],
        })
      })
      .catch(() => {
        if (active) setBackendArticle(null)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [staticArticle, topic])

  useEffect(() => {
    function updateProgress() {
      const element = articleRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const totalScrollable = rect.height - viewportHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(totalScrollable, 1))
      const nextProgress = totalScrollable > 0 ? (scrolled / totalScrollable) * 100 : 100

      setProgress(Math.min(100, Math.max(0, nextProgress)))
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress)
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [topic])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-fin-mist px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-fin-line bg-white p-8 text-center shadow-soft">
          <h1 className="text-3xl font-extrabold text-fin-ink">Memuat materi...</h1>
          <p className="mt-4 text-base leading-7 text-fin-text">FinLearn sedang menyiapkan materi untukmu.</p>
        </div>
      </main>
    )
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-fin-mist px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-fin-line bg-white p-8 text-center shadow-soft">
          <h1 className="text-3xl font-extrabold text-fin-ink">Materi tidak ditemukan</h1>
          <p className="mt-4 text-base leading-7 text-fin-text">Topik yang kamu cari belum tersedia di FinLearn.</p>
          <Link to="/learn" className="mt-8 inline-flex rounded-xl bg-fin-forest px-6 py-3 text-sm font-extrabold text-white shadow-lift">
            Kembali ke Materi
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main ref={articleRef} className="min-h-screen bg-fin-mist">
      <div className="sticky top-[74px] z-40 border-b border-fin-line bg-white/92 py-3 backdrop-blur-md md:top-[72px]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="truncate text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Progress membaca</p>
                <span className="text-xs font-extrabold text-fin-ink">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-fin-line">
                <div className="h-full rounded-full bg-fin-forest transition-all duration-150" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-36 rounded-2xl border border-fin-line bg-white/75 p-5 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Isi materi</p>
              <ol className="mt-4 space-y-3 text-sm font-bold text-fin-text">
                {article.sections.map((section, index) => (
                  <li key={section.heading} className="flex gap-3">
                    <span className="text-fin-forest">{String(index + 1).padStart(2, '0')}</span>
                    <span>{section.heading}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="rounded-3xl border border-fin-line bg-white p-6 shadow-panel sm:p-10">
            <header className="border-b border-fin-line pb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-fin-sage bg-fin-mist px-3 py-1 text-xs font-extrabold text-fin-forest">
                  {article.readingTime}
                </span>
                <span className="rounded-full bg-fin-ink px-3 py-1 text-xs font-extrabold text-white">
                  {hasQuiz ? 'Materi utama' : 'Materi mentor'}
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-fin-ink sm:text-5xl sm:leading-tight">
                {article.title}
              </h1>
              <p className="mt-5 text-base font-medium leading-8 text-fin-text sm:text-lg">{article.summary}</p>
            </header>

            <div className="space-y-11 pt-9">
              {article.sections.map((section, index) => (
                <section key={section.heading} className="scroll-mt-32">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Bagian {index + 1}</p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-fin-ink">{section.heading}</h2>
                  <div className="mt-5 space-y-5 text-base leading-8 text-fin-body sm:text-lg">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-12 rounded-2xl border border-fin-sage bg-fin-sageSoft p-6 sm:p-7">
              <h2 className="text-xl font-extrabold text-fin-ink">Tips praktis</h2>
              {article.tips.length > 0 ? (
              <ul className="mt-5 grid gap-3">
                {article.tips.map((tip) => (
                  <li key={tip} className="flex gap-3 text-sm font-semibold leading-6 text-fin-body sm:text-base">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-fin-forest" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              ) : (
                <p className="mt-4 text-sm font-semibold leading-6 text-fin-body">
                  Catat inti materi ini, lalu coba hubungkan dengan kebiasaan finansial harianmu.
                </p>
              )}
            </section>

            {article.sources.length > 0 && (
            <section className="mt-8 rounded-2xl border border-fin-line bg-fin-shell p-6 sm:p-7">
              <h2 className="text-xl font-extrabold text-fin-ink">Sumber bacaan</h2>
              <div className="mt-5 grid gap-3">
                {article.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-fin-line bg-white px-4 py-3 text-sm font-bold leading-6 text-fin-forest transition hover:border-fin-sage hover:text-fin-ink"
                  >
                    {formatSourceName(source.name)} <span aria-hidden="true">-&gt;</span>
                  </a>
                ))}
              </div>
            </section>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/quiz?topic=${article.slug}`}
                className={`${hasQuiz ? 'inline-flex' : 'hidden'} items-center justify-center rounded-xl bg-fin-forest px-6 py-3.5 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-fin-forestDark`}
              >
                Ikut Kuis Topik Ini
              </Link>
              <Link
                to="/learn"
                className="inline-flex items-center justify-center rounded-xl border border-fin-sage bg-white px-6 py-3.5 text-sm font-extrabold text-fin-ink transition hover:border-fin-forest hover:bg-fin-shell"
              >
                Kembali ke Daftar Materi
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}

export default Article
