import { useEffect, useState } from 'react'
import { getCurrencyRates } from '../services/api'

function formatIDR(value) {
  if (typeof value !== 'number') return 'Tidak tersedia'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function CurrencyWidget() {
  const [rate, setRate] = useState(null)
  const [updatedAt, setUpdatedAt] = useState('')
  const [source, setSource] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadRates() {
      try {
        setLoading(true)
        setError('')

        const result = await getCurrencyRates()

        if (!active) return

        if (!result?.rates?.IDR) {
          throw new Error('Data kurs USD/IDR tidak ditemukan.')
        }

        setRate(result.rates.IDR)
        setUpdatedAt(result.updated_at || new Date().toISOString())
        setSource(result.source || 'backend')
      } catch (err) {
        if (active) {
          setError(err.message || 'Gagal memuat kurs.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadRates()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="rounded-3xl border border-fin-line bg-white p-6 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Kurs hari ini</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-fin-ink">USD / IDR</h3>
        </div>
        <span className="rounded-full border border-fin-sage bg-fin-mist px-3 py-1 text-xs font-extrabold text-fin-forest">
          Live
        </span>
      </div>

      {loading && (
        <div className="mt-6 rounded-2xl border border-fin-line bg-fin-shell p-4" aria-live="polite">
          <div className="h-3 w-32 animate-pulse rounded-full bg-fin-line" />
          <div className="mt-4 h-8 w-56 animate-pulse rounded-full bg-fin-line" />
          <p className="mt-4 text-sm font-semibold text-fin-text">Memuat kurs...</p>
        </div>
      )}

      {!loading && error && (
        <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700" role="alert">{error}</p>
      )}

      {!loading && !error && (
        <>
          <div className="mt-6 rounded-2xl bg-fin-ink p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-fin-sage">Estimasi 1 USD</p>
            <p className="mt-3 break-words text-3xl font-extrabold tracking-tight sm:text-4xl">{formatIDR(rate)}</p>
          </div>

          <p className="mt-4 text-sm leading-6 text-fin-text">
            Data ini membantu kamu membaca perubahan nilai tukar saat belajar inflasi, impor, dan daya beli. Sumber: <span className="font-extrabold text-fin-ink">{source === 'backend' ? 'Backend FinLearn' : 'Public API'}</span>.
          </p>
          {updatedAt && (
            <p className="mt-3 text-xs font-bold text-fin-muted">
              Diperbarui: {new Date(updatedAt).toLocaleString('id-ID')}
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default CurrencyWidget
