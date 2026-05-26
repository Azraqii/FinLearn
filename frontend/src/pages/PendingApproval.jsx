import { Link } from 'react-router-dom'

function PendingApproval() {
  return (
    <main className="min-h-screen bg-fin-mist px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl border border-fin-line bg-white p-8 text-center shadow-panel">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Menunggu approval</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fin-ink">Akun sedang ditinjau admin</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-fin-text">
          Setelah admin menyetujui akun, kamu bisa login dan membuka dashboard sesuai role. Untuk demo lokal, masuk sebagai admin dan approve akun dari halaman admin.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/login" className="inline-flex justify-center rounded-xl bg-fin-forest px-6 py-3.5 text-sm font-extrabold text-white shadow-lift">
            Kembali ke Login
          </Link>
          <Link to="/" className="inline-flex justify-center rounded-xl border border-fin-sage bg-white px-6 py-3.5 text-sm font-extrabold text-fin-ink hover:bg-fin-shell">
            Beranda
          </Link>
        </div>
      </section>
    </main>
  )
}

export default PendingApproval
