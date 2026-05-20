import { Link } from 'react-router-dom'
import CurrencyWidget from '../components/CurrencyWidget'

const featureCards = [
  {
    eyebrow: '01',
    title: 'Materi terarah',
    description: 'Pahami budgeting, inflasi, dan bunga majemuk lewat penjelasan ringkas yang mudah diikuti.',
  },
  {
    eyebrow: '02',
    title: 'Kuis fokus',
    description: 'Latih pemahaman per topik, lihat skor, lalu bandingkan progresmu di leaderboard.',
  },
  {
    eyebrow: '03',
    title: 'Simulasi praktis',
    description: 'Gunakan kalkulator untuk melihat dampak waktu, modal, dan imbal hasil terhadap tabungan.',
  },
]

const trustPoints = ['Tanpa login', 'Bahasa sederhana', 'Progres tersimpan']
const dashboardStats = [
  { label: 'Topik inti', value: '3', note: 'Budgeting, inflasi, compound' },
  { label: 'Format kuis', value: '5', note: 'Soal fokus per topik' },
  { label: 'Simulasi', value: '1', note: 'Bunga majemuk interaktif' },
]

function Home() {
  return (
    <main className="bg-fin-mist">
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 w-fit">
            <p className="rounded-full border border-fin-sage bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">
              Platform edukasi finansial
            </p>
          </div>

          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-fin-ink sm:text-5xl lg:text-6xl lg:leading-[1.04]">
            Belajar mengelola uang dengan percaya diri.
          </h1>

          <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-fin-text sm:text-lg">
            FinLearn membantu pelajar Indonesia memahami konsep keuangan dasar secara praktis, mulai dari anggaran bulanan, inflasi, nilai tukar, sampai kekuatan bunga majemuk.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/learn"
              className="inline-flex items-center justify-center rounded-xl bg-fin-forest px-6 py-3.5 text-base font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-fin-forestDark focus:outline-none focus:ring-2 focus:ring-fin-forest focus:ring-offset-2 focus:ring-offset-fin-mist"
            >
              Mulai Belajar
            </Link>

            <Link
              to="/quiz"
              className="inline-flex items-center justify-center rounded-xl border border-fin-sage bg-white px-6 py-3.5 text-base font-extrabold text-fin-ink shadow-sm transition hover:-translate-y-0.5 hover:border-fin-forest hover:bg-fin-shell focus:outline-none focus:ring-2 focus:ring-fin-forest focus:ring-offset-2 focus:ring-offset-fin-mist"
            >
              Ikut Kuis
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {trustPoints.map((item) => (
              <div key={item} className="rounded-xl border border-fin-line bg-white/65 px-4 py-3 text-sm font-bold text-fin-text">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid content-center gap-5">
          <CurrencyWidget />

          <div className="grid gap-3 sm:grid-cols-3">
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-fin-line bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">{stat.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-fin-ink">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-fin-muted">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-fin-sage bg-fin-sageSoft p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-fin-forest text-sm font-extrabold text-white">
                i
              </div>
              <div>
                <p className="text-sm font-extrabold text-fin-ink">Belajar tanpa hambatan</p>
                <p className="mt-2 text-sm leading-6 text-fin-body">
                  Tidak perlu membuat akun. Masukkan nama saat mengerjakan kuis agar skor kamu tersimpan di leaderboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-fin-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">
                Fitur unggulan
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-fin-ink sm:text-4xl">
                Dasar finansial yang rapi, jelas, dan bisa langsung dipraktikkan.
              </h2>
            </div>

            <Link to="/calculator" className="inline-flex items-center gap-2 text-base font-extrabold text-fin-forest transition hover:gap-3 hover:text-fin-ink">
              Coba Kalkulator <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-fin-line bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-fin-sage">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-fin-mist text-sm font-extrabold text-fin-forest ring-1 ring-fin-line">
                  {feature.eyebrow}
                </div>
                <h3 className="text-lg font-extrabold text-fin-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-fin-text">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
