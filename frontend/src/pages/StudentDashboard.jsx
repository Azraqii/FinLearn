import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getChallenges, getLeaderboard, getMaterials, getSubmissions, submitChallenge } from '../services/api'

function StudentDashboard() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState([])
  const [challenges, setChallenges] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [scores, setScores] = useState([])
  const [activeChallenge, setActiveChallenge] = useState('')
  const [submissionText, setSubmissionText] = useState('')
  const [fileName, setFileName] = useState('')
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      const [materialsResult, challengesResult, submissionsResult, scoresResult] = await Promise.all([
        getMaterials(),
        getChallenges(),
        getSubmissions(),
        getLeaderboard('all'),
      ])
      setMaterials(materialsResult.data)
      setChallenges(challengesResult.data)
      setSubmissions(submissionsResult.data.filter((item) => (
        !item.studentEmail || item.studentEmail === user.email
      )))
      setScores(scoresResult.data.filter((score) => score.name === user.name || score.email === user.email))
      setActiveChallenge(challengesResult.data[0]?.id || '')
    }

    loadDashboard()
  }, [user.email, user.name])

  const selectedChallenge = useMemo(
    () => challenges.find((challenge) => challenge.id === activeChallenge),
    [activeChallenge, challenges],
  )

  async function handleSubmit(event) {
    event.preventDefault()
    if (!selectedChallenge || !submissionText.trim()) return

    const result = await submitChallenge({
      challengeId: selectedChallenge.id,
      challengeTitle: selectedChallenge.title,
      studentName: user.name,
      studentEmail: user.email,
      text: submissionText.trim(),
      fileName,
      attachmentFile,
    })

    setSubmissions((current) => [result.data, ...current])
    setSubmissionText('')
    setFileName('')
    setAttachmentFile(null)
    setStatus('Submission berhasil disimpan.')
  }

  return (
    <main className="min-h-screen bg-fin-mist px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-3xl border border-fin-line bg-white/80 p-6 shadow-panel sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Student dashboard</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fin-ink">Halo, {user.name}</h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-fin-text">
            Akses materi dari backend, lanjutkan quiz, kerjakan challenge, dan lihat feedback dari mentor dalam satu tempat.
          </p>
        </section>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-fin-line bg-white p-5 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">Materi tersedia</p>
            <p className="mt-2 text-4xl font-extrabold text-fin-ink">{materials.length}</p>
          </div>
          <div className="rounded-2xl border border-fin-line bg-white p-5 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">Challenge aktif</p>
            <p className="mt-2 text-4xl font-extrabold text-fin-ink">{challenges.length}</p>
          </div>
          <div className="rounded-2xl border border-fin-sage bg-fin-sageSoft p-5 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-forest">Quiz tersimpan</p>
            <p className="mt-2 text-4xl font-extrabold text-fin-ink">{scores.length}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-fin-line bg-white p-6 shadow-panel">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Materi backend</p>
                <h2 className="mt-2 text-2xl font-extrabold text-fin-ink">Materi terbaru</h2>
              </div>
              <Link to="/learn" className="text-sm font-extrabold text-fin-forest hover:text-fin-ink">Materi lokal</Link>
            </div>

            <div className="grid gap-4">
              {materials.map((material) => (
                <article key={material.id} className="rounded-2xl border border-fin-line bg-fin-shell p-5">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-fin-ink text-sm font-extrabold text-white">
                      {material.title.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-fin-ink">{material.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-fin-text">{material.summary}</p>
                      <p className="mt-3 text-xs font-bold text-fin-muted">Mentor: {material.author || 'FinLearn'}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-fin-line bg-white p-6 shadow-panel">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Submit challenge</p>
            <h2 className="mt-2 text-2xl font-extrabold text-fin-ink">Kirim jawaban</h2>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Challenge</span>
                <select
                  value={activeChallenge}
                  onChange={(event) => setActiveChallenge(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-bold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                >
                  {challenges.map((challenge) => (
                    <option key={challenge.id} value={challenge.id}>{challenge.title}</option>
                  ))}
                </select>
              </label>

              {selectedChallenge && (
                <p className="rounded-2xl border border-fin-line bg-fin-shell p-4 text-sm font-semibold leading-6 text-fin-text">
                  {selectedChallenge.description}
                </p>
              )}

              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Jawaban teks</span>
                <textarea
                  value={submissionText}
                  onChange={(event) => setSubmissionText(event.target.value)}
                  rows="5"
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">File pendukung</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp,application/pdf"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null
                    setAttachmentFile(file)
                    setFileName(file?.name || '')
                  }}
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-text file:mr-4 file:rounded-lg file:border-0 file:bg-fin-forest file:px-4 file:py-2 file:font-bold file:text-white"
                />
                {fileName && <span className="mt-2 block text-xs font-bold text-fin-muted">{fileName}</span>}
              </label>

              {status && <p className="text-sm font-bold text-fin-forest" aria-live="polite">{status}</p>}

              <button type="submit" className="rounded-xl bg-fin-forest px-6 py-3 text-sm font-extrabold text-white shadow-lift hover:bg-fin-forestDark">
                Submit Challenge
              </button>
            </form>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-fin-line bg-white p-6 shadow-panel">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Feedback mentor</p>
          <h2 className="mt-2 text-2xl font-extrabold text-fin-ink">Riwayat submission</h2>
          <div className="mt-6 grid gap-4">
            {submissions.length === 0 && <p className="text-sm font-semibold text-fin-text">Belum ada submission.</p>}
            {submissions.map((submission) => (
              <div key={submission.id} className="rounded-2xl border border-fin-line bg-fin-shell p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-extrabold text-fin-ink">{submission.challengeTitle}</h3>
                    <p className="mt-2 text-sm leading-6 text-fin-text">{submission.text}</p>
                    {submission.fileName && <p className="mt-2 text-xs font-bold text-fin-muted">File: {submission.fileName}</p>}
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-extrabold text-fin-forest ring-1 ring-fin-sage">
                    {submission.status === 'reviewed' ? 'Reviewed' : 'Submitted'}
                  </span>
                </div>
                <div className="mt-4 rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-fin-body">
                  {submission.feedback || 'Belum ada feedback mentor.'}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default StudentDashboard
