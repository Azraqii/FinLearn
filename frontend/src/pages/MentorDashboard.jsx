import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getChallenges, getMaterials, getSubmissions, saveChallenge, saveMaterial, saveSubmissionFeedback } from '../services/api'

const emptyMaterial = {
  id: '',
  title: '',
  topic: 'budgeting',
  summary: '',
  content: '',
  thumbnail: '',
  thumbnailFile: null,
  status: 'published',
}

function MentorDashboard() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState([])
  const [challenges, setChallenges] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [materialForm, setMaterialForm] = useState(emptyMaterial)
  const [challengeForm, setChallengeForm] = useState({ title: '', description: '', dueDate: '', attachmentFile: null, status: 'published' })
  const [feedbackDrafts, setFeedbackDrafts] = useState({})
  const [status, setStatus] = useState('')
  const [statusTone, setStatusTone] = useState('success')

  async function loadData() {
    const [materialsResult, challengesResult, submissionsResult] = await Promise.all([
      getMaterials(),
      getChallenges(),
      getSubmissions(),
    ])
    setMaterials(materialsResult.data)
    setChallenges(challengesResult.data)
    setSubmissions(submissionsResult.data)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleMaterialSubmit(event) {
    event.preventDefault()
    if (materialForm.content.trim().length < 20) {
      setStatusTone('error')
      setStatus('Konten materi minimal 20 karakter agar bisa disimpan.')
      return
    }

    try {
      const result = await saveMaterial({
        ...materialForm,
        author: user.name,
      })

      setMaterials((current) => {
        const exists = current.some((item) => item.id === result.data.id)
        return exists ? current.map((item) => (item.id === result.data.id ? result.data : item)) : [result.data, ...current]
      })
      setMaterialForm(emptyMaterial)
      setStatusTone('success')
      setStatus('Materi berhasil disimpan ke database.')
    } catch (error) {
      setStatusTone('error')
      setStatus(error.message || 'Materi gagal disimpan.')
    }
  }

  async function handleChallengeSubmit(event) {
    event.preventDefault()
    const result = await saveChallenge({
      ...challengeForm,
      mentorName: user.name,
    })
    setChallenges((current) => [result.data, ...current])
    setChallengeForm({ title: '', description: '', dueDate: '', attachmentFile: null, status: 'published' })
    setStatus('Challenge berhasil dibuat.')
  }

  async function handleFeedback(submissionId) {
    const feedback = feedbackDrafts[submissionId]?.trim()
    if (!feedback) return

    await saveSubmissionFeedback(submissionId, feedback)
    setSubmissions((current) => current.map((item) => (
      item.id === submissionId
        ? { ...item, feedback, feedback_text: feedback, status: 'reviewed', reviewed_at: new Date().toISOString() }
        : item
    )))
    setFeedbackDrafts((current) => ({ ...current, [submissionId]: '' }))
    setStatus('Feedback berhasil dikirim.')
  }

  return (
    <main className="min-h-screen bg-fin-mist px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-3xl border border-fin-line bg-white/80 p-6 shadow-panel sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Mentor dashboard</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fin-ink">Kelola materi dan challenge</h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-fin-text">
            Buat materi, upload thumbnail atau gambar pendukung, buat challenge, tinjau submission student, dan berikan feedback.
          </p>
          {status && (
            <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-bold ${statusTone === 'error' ? 'border border-red-200 bg-red-50 text-red-700' : 'text-fin-forest'}`} aria-live="polite">
              {status}
            </p>
          )}
        </section>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-fin-line bg-white p-5 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">Materi</p>
            <p className="mt-2 text-4xl font-extrabold text-fin-ink">{materials.length}</p>
          </div>
          <div className="rounded-2xl border border-fin-line bg-white p-5 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">Challenge</p>
            <p className="mt-2 text-4xl font-extrabold text-fin-ink">{challenges.length}</p>
          </div>
          <div className="rounded-2xl border border-fin-sage bg-fin-sageSoft p-5 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-forest">Submission</p>
            <p className="mt-2 text-4xl font-extrabold text-fin-ink">{submissions.length}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-fin-line bg-white p-6 shadow-panel">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Materi</p>
            <h2 className="mt-2 text-2xl font-extrabold text-fin-ink">{materialForm.id ? 'Edit materi' : 'Buat materi'}</h2>

            <form onSubmit={handleMaterialSubmit} className="mt-6 grid gap-4">
              <input type="hidden" value={materialForm.id} readOnly />
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Judul</span>
                <input
                  value={materialForm.title}
                  onChange={(event) => setMaterialForm((current) => ({ ...current, title: event.target.value }))}
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Topik</span>
                <select
                  value={materialForm.topic}
                  onChange={(event) => setMaterialForm((current) => ({ ...current, topic: event.target.value }))}
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                >
                  <option value="budgeting">Budgeting</option>
                  <option value="inflasi">Inflasi</option>
                  <option value="compound-interest">Compound Interest</option>
                  <option value="aset-digital">Aset Digital</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Ringkasan</span>
                <textarea
                  value={materialForm.summary}
                  onChange={(event) => setMaterialForm((current) => ({ ...current, summary: event.target.value }))}
                  rows="3"
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Konten</span>
                <textarea
                  value={materialForm.content}
                  onChange={(event) => setMaterialForm((current) => ({ ...current, content: event.target.value }))}
                  rows="5"
                  minLength={20}
                  aria-describedby="material-content-help"
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                  required
                />
                <span id="material-content-help" className={`mt-2 block text-xs font-bold ${materialForm.content.trim().length > 0 && materialForm.content.trim().length < 20 ? 'text-red-700' : 'text-fin-muted'}`}>
                  Minimal 20 karakter. Saat ini {materialForm.content.trim().length}/20.
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Thumbnail atau gambar</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp,application/pdf"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null
                    setMaterialForm((current) => ({ ...current, thumbnailFile: file, thumbnail: file?.name || current.thumbnail || '' }))
                  }}
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-text file:mr-4 file:rounded-lg file:border-0 file:bg-fin-forest file:px-4 file:py-2 file:font-bold file:text-white"
                />
                {materialForm.thumbnail && <span className="mt-2 block text-xs font-bold text-fin-muted">{materialForm.thumbnail}</span>}
              </label>
              <div className="flex gap-3">
                <button type="submit" className="rounded-xl bg-fin-forest px-6 py-3 text-sm font-extrabold text-white shadow-lift hover:bg-fin-forestDark">
                  Simpan Materi
                </button>
                {materialForm.id && (
                  <button type="button" onClick={() => setMaterialForm(emptyMaterial)} className="rounded-xl border border-fin-sage bg-white px-6 py-3 text-sm font-extrabold text-fin-ink hover:bg-fin-shell">
                    Batal
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-3xl border border-fin-line bg-white p-6 shadow-panel">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Challenge</p>
            <h2 className="mt-2 text-2xl font-extrabold text-fin-ink">Buat challenge</h2>
            <form onSubmit={handleChallengeSubmit} className="mt-6 grid gap-4">
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Judul</span>
                <input
                  value={challengeForm.title}
                  onChange={(event) => setChallengeForm((current) => ({ ...current, title: event.target.value }))}
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Deskripsi</span>
                <textarea
                  value={challengeForm.description}
                  onChange={(event) => setChallengeForm((current) => ({ ...current, description: event.target.value }))}
                  rows="5"
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Tenggat</span>
                <input
                  type="date"
                  value={challengeForm.dueDate}
                  onChange={(event) => setChallengeForm((current) => ({ ...current, dueDate: event.target.value }))}
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                />
              </label>
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">File pendukung</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp,application/pdf"
                  onChange={(event) => setChallengeForm((current) => ({ ...current, attachmentFile: event.target.files?.[0] || null }))}
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3 text-sm font-semibold text-fin-text file:mr-4 file:rounded-lg file:border-0 file:bg-fin-forest file:px-4 file:py-2 file:font-bold file:text-white"
                />
                {challengeForm.attachmentFile && <span className="mt-2 block text-xs font-bold text-fin-muted">{challengeForm.attachmentFile.name}</span>}
              </label>
              <button type="submit" className="rounded-xl bg-fin-forest px-6 py-3 text-sm font-extrabold text-white shadow-lift hover:bg-fin-forestDark">
                Buat Challenge
              </button>
            </form>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-fin-line bg-white p-6 shadow-panel">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Submission student</p>
          <h2 className="mt-2 text-2xl font-extrabold text-fin-ink">Review dan feedback</h2>
          <div className="mt-6 grid gap-4">
            {submissions.length === 0 && <p className="text-sm font-semibold text-fin-text">Belum ada submission.</p>}
            {submissions.map((submission) => (
              <div key={submission.id} className="rounded-2xl border border-fin-line bg-fin-shell p-5">
                <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                  <div>
                    <p className="text-sm font-extrabold text-fin-ink">{submission.challengeTitle}</p>
                    <p className="mt-1 text-xs font-bold text-fin-muted">{submission.studentName} - {submission.studentEmail}</p>
                    <p className="mt-3 text-sm leading-6 text-fin-text">{submission.text}</p>
                    {submission.fileName && <p className="mt-2 text-xs font-bold text-fin-muted">File: {submission.fileName}</p>}
                    {submission.feedback && <p className="mt-4 rounded-xl bg-white p-3 text-sm font-semibold text-fin-body">Feedback saat ini: {submission.feedback}</p>}
                  </div>
                  <div>
                    <textarea
                      value={feedbackDrafts[submission.id] || ''}
                      onChange={(event) => setFeedbackDrafts((current) => ({ ...current, [submission.id]: event.target.value }))}
                      rows="4"
                      placeholder="Tulis feedback..."
                      className="w-full rounded-xl border border-fin-line bg-white px-4 py-3 text-sm font-semibold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                    />
                    <button type="button" onClick={() => handleFeedback(submission.id)} className="mt-3 w-full rounded-xl bg-fin-forest px-5 py-3 text-sm font-extrabold text-white shadow-lift hover:bg-fin-forestDark">
                      Kirim Feedback
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-fin-line bg-white p-6 shadow-panel">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Daftar materi</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {materials.map((material) => (
              <article key={material.id} className="rounded-2xl border border-fin-line bg-fin-shell p-5">
                <h3 className="font-extrabold text-fin-ink">{material.title}</h3>
                <p className="mt-2 text-sm leading-6 text-fin-text">{material.summary}</p>
                <button
                  type="button"
                  onClick={() => setMaterialForm(material)}
                  className="mt-4 rounded-xl border border-fin-sage bg-white px-4 py-2 text-sm font-extrabold text-fin-ink hover:bg-fin-mist"
                >
                  Edit
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default MentorDashboard
