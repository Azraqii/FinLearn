import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import QuizQuestion from '../components/QuizQuestion'
import { getArticleBySlug } from '../data/articles'
import { getQuestionsByTopic } from '../data/questions'

function QuizPlay() {
  const { topic } = useParams()
  const navigate = useNavigate()
  const article = getArticleBySlug(topic)
  const questions = useMemo(() => getQuestionsByTopic(topic), [topic])

  const [name, setName] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  if (!article || questions.length === 0) {
    return (
      <main className="min-h-screen bg-fin-mist px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-fin-line bg-white p-8 text-center shadow-soft">
          <h1 className="text-3xl font-extrabold text-fin-ink">Kuis tidak ditemukan</h1>
          <p className="mt-4 text-base leading-7 text-fin-text">Topik kuis yang kamu cari belum tersedia.</p>
          <Link to="/quiz" className="mt-8 inline-flex rounded-xl bg-fin-forest px-6 py-3 text-sm font-extrabold text-white">
            Kembali ke Pilihan Kuis
          </Link>
        </div>
      </main>
    )
  }

  const currentQuestion = questions[currentIndex]
  const selectedAnswer = answers[currentQuestion.id]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length
  const trimmedName = name.trim()

  function handleStart(event) {
    event.preventDefault()
    if (!trimmedName) return
    setHasStarted(true)
  }

  function handleNext() {
    if (!selectedAnswer) return

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((value) => value + 1)
      return
    }

    const review = questions.map((question) => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer

      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      }
    })

    const correctCount = review.filter((item) => item.isCorrect).length
    const score = Math.round((correctCount / questions.length) * 100)
    const result = {
      name: trimmedName,
      topic,
      topicTitle: article.title,
      score,
      correctCount,
      totalQuestions: questions.length,
      review,
      submittedAt: new Date().toISOString(),
    }

    sessionStorage.setItem('finlearn-last-result', JSON.stringify(result))
    navigate(`/quiz/${topic}/result`, { state: result })
  }

  if (!hasStarted) {
    return (
      <main className="min-h-screen bg-fin-mist">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-fin-line bg-white p-6 shadow-panel sm:p-9">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Mulai kuis</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-fin-ink sm:text-4xl">{article.title}</h1>
            <p className="mt-5 text-base font-medium leading-8 text-fin-text">
              Masukkan nama kamu terlebih dahulu. Nama ini akan ditampilkan di hasil kuis dan leaderboard.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-fin-mist px-4 py-3 text-sm font-extrabold text-fin-text">5 soal</div>
              <div className="rounded-xl bg-fin-mist px-4 py-3 text-sm font-extrabold text-fin-text">Pilihan ganda</div>
              <div className="rounded-xl bg-fin-mist px-4 py-3 text-sm font-extrabold text-fin-text">Skor 0-100</div>
            </div>

            <form onSubmit={handleStart} className="mt-8 space-y-5">
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Nama lengkap</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Contoh: Stephanie"
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3.5 text-base font-semibold text-fin-ink outline-none transition placeholder:text-fin-muted focus:border-fin-forest focus:bg-white focus:ring-2 focus:ring-fin-sage"
                  autoComplete="name"
                  autoFocus
                />
              </label>

              <button
                type="submit"
                disabled={!trimmedName}
                className="w-full rounded-xl bg-fin-forest px-7 py-3.5 text-base font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-fin-forestDark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                Mulai Kuis
              </button>
            </form>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-fin-mist">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-3xl border border-fin-line bg-white/85 p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Kuis {article.shortLabel || article.title}</p>
              <h1 className="mt-2 text-2xl font-extrabold text-fin-ink">Soal {currentIndex + 1} dari {questions.length}</h1>
            </div>
            <div className="rounded-2xl bg-fin-ink px-4 py-3 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-fin-sage">Terjawab</p>
              <p className="mt-1 text-xl font-extrabold">{answeredCount}/{questions.length}</p>
            </div>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-fin-line">
            <div className="h-full rounded-full bg-fin-forest transition-all" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onSelect={(answer) => {
            setAnswers((currentAnswers) => ({
              ...currentAnswers,
              [currentQuestion.id]: answer,
            }))
          }}
        />

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-fin-line bg-white/75 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold leading-6 text-fin-text">Jawab dengan tenang. Ulasan lengkap muncul setelah kuis selesai.</p>
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="rounded-xl bg-fin-forest px-6 py-3 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-fin-forestDark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:whitespace-nowrap"
          >
            {currentIndex === questions.length - 1 ? 'Lihat Hasil' : 'Lanjut'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default QuizPlay
