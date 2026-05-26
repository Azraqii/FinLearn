import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { submitQuizScore } from '../services/api'

function loadFallbackResult(topic) {
  try {
    const stored = JSON.parse(sessionStorage.getItem('finlearn-last-result'))
    return stored?.topic === topic ? stored : null
  } catch {
    return null
  }
}

function QuizResult() {
  const { topic } = useParams()
  const location = useLocation()
  const hasSubmittedRef = useRef(false)
  const result = useMemo(() => location.state || loadFallbackResult(topic), [location.state, topic])
  const [submitStatus, setSubmitStatus] = useState('saving')
  const [offlineSaved, setOfflineSaved] = useState(false)

  useEffect(() => {
    if (!result || hasSubmittedRef.current) return

    hasSubmittedRef.current = true

    async function saveScore() {
      try {
        const response = await submitQuizScore({
          name: result.name,
          email: result.email,
          topic: result.topic,
          score: result.score,
        })

        setOfflineSaved(Boolean(response.offline))
        setSubmitStatus('saved')
      } catch (error) {
        console.error('Failed to submit quiz score:', error)
        setSubmitStatus('failed')
      }
    }

    saveScore()
  }, [result])

  if (!result) {
    return (
      <main className="min-h-screen bg-fin-mist px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-fin-line bg-white p-8 text-center shadow-soft">
          <h1 className="text-3xl font-extrabold text-fin-ink">Hasil kuis tidak tersedia</h1>
          <p className="mt-4 text-base leading-7 text-fin-text">Silakan mulai kuis dari halaman pilihan topik.</p>
          <Link to="/quiz" className="mt-8 inline-flex rounded-xl bg-fin-forest px-6 py-3 text-sm font-extrabold text-white">
            Pilih Kuis
          </Link>
        </div>
      </main>
    )
  }

  const statusMessage = {
    saving: 'Mengirim skor ke backend...',
    saved: offlineSaved
      ? 'Skor disimpan sementara di browser untuk demo. Backend belum aktif.'
      : 'Skor berhasil dikirim ke backend dan leaderboard.',
    failed: 'Skor belum berhasil dikirim. Cek koneksi dan coba lagi.',
  }[submitStatus]

  return (
    <main className="min-h-screen bg-fin-mist">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-fin-line bg-white p-6 shadow-panel sm:p-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Hasil kuis</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_240px]">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-fin-ink sm:text-5xl">Kerja bagus, {result.name}</h1>
              <p className="mt-4 text-base font-medium leading-8 text-fin-text">
                Topik: <span className="font-extrabold text-fin-ink">{result.topicTitle}</span>
              </p>
            </div>
            <div className="rounded-3xl bg-fin-ink p-6 text-center text-white">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-sage">Skor akhir</p>
              <p className="mt-3 text-6xl font-extrabold">{result.score}</p>
              <p className="mt-2 text-sm font-bold text-fin-sageSoft">{result.correctCount}/{result.totalQuestions} benar</p>
            </div>
          </div>

          <div className={`mt-7 rounded-2xl border p-4 ${
            submitStatus === 'saved' ? 'border-fin-sage bg-fin-sageSoft' : submitStatus === 'failed' ? 'border-red-200 bg-red-50' : 'border-fin-line bg-fin-shell'
          }`}>
            <p className={`text-sm font-bold leading-6 ${submitStatus === 'failed' ? 'text-red-800' : 'text-fin-body'}`} aria-live="polite">
              {statusMessage}
            </p>
          </div>

          <div className="mt-10 border-t border-fin-line pt-9">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Review jawaban</p>
                <h2 className="mt-2 text-2xl font-extrabold text-fin-ink">Lihat bagian yang sudah kuat dan yang perlu diulang.</h2>
              </div>
            </div>

            <div className="grid gap-4">
              {result.review.map((item, index) => (
                <div key={item.question} className={`rounded-2xl border p-5 ${
                  item.isCorrect ? 'border-fin-sage bg-fin-shell' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white ${
                      item.isCorrect ? 'bg-fin-forest' : 'bg-red-600'
                    }`}>
                      {item.isCorrect ? 'OK' : 'X'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold leading-7 text-fin-ink">{index + 1}. {item.question}</p>
                      <div className="mt-4 grid gap-2 text-sm">
                        <p className={`rounded-xl bg-white px-4 py-3 font-bold ${item.isCorrect ? 'text-fin-forest' : 'text-red-800'}`}>
                          Jawaban kamu: {item.userAnswer}
                        </p>
                        {!item.isCorrect && (
                          <p className="rounded-xl bg-white px-4 py-3 font-bold text-fin-forest">
                            Jawaban benar: {item.correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/leaderboard"
              className="inline-flex items-center justify-center rounded-xl bg-fin-forest px-6 py-3.5 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-fin-forestDark"
            >
              Lihat Leaderboard
            </Link>
            <Link
              to={`/quiz/${result.topic}`}
              className="inline-flex items-center justify-center rounded-xl border border-fin-sage bg-white px-6 py-3.5 text-sm font-extrabold text-fin-ink transition hover:border-fin-forest hover:bg-fin-shell"
            >
              Coba Lagi
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default QuizResult
