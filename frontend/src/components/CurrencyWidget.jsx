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

function formatUSD(value) {
  if (typeof value !== 'number') return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function CurrencyWidget() {
  const [fiat, setFiat]       = useState(null)
  const [crypto, setCrypto]   = useState(null)
  const [updatedAt, setUpdatedAt] = useState('')
  const [source, setSource]   = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    let active = true

    async function loadRates() {
      try {
        setLoading(true)
        setError('')

        const result = await getCurrencyRates()

        if (!active) return

        if (!result?.fiat?.IDR) {
          throw new Error('Data kurs USD/IDR tidak ditemukan.')
        }

        setFiat(result.fiat)
        setCrypto(result.crypto || null)
        setUpdatedAt(result.updated_at || new Date().toISOString())
        setSource(result.source || 'backend')
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat kurs.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadRates()
    return () => { active = false }
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
        <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && fiat && (
        <>
          {/* Primary USD/IDR rate */}
          <div className="mt-6 rounded-2xl bg-fin-ink p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-fin-sage">Estimasi 1 USD</p>
            <p className="mt-3 break-words text-3xl font-extrabold tracking-tight sm:text-4xl">{formatIDR(fiat.IDR)}</p>
          </div>

          {/* Other fiat currencies */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'SGD', value: fiat.SGD },
              { label: 'MYR', value: fiat.MYR },
              { label: 'JPY', value: fiat.JPY },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-fin-line bg-fin-shell px-3 py-2.5 text-center">
                <p className="text-xs font-extrabold uppercase text-fin-forest">{label}</p>
                <p className="mt-1 text-sm font-extrabold text-fin-ink">
                  {typeof value === 'number' ? value.toFixed(2) : '-'}
                </p>
              </div>
            ))}
          </div>

          {/* Crypto prices (only when backend is active) */}
          {crypto && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-forest">Aset Digital</p>
              {[
                { label: 'Bitcoin (BTC)', data: crypto.bitcoin },
                { label: 'Ethereum (ETH)', data: crypto.ethereum },
              ].map(({ label, data }) =>
                data ? (
                  <div key={label} className="flex items-center justify-between rounded-xl border border-fin-line bg-fin-shell px-4 py-3">
                    <p className="text-sm font-extrabold text-fin-ink">{label}</p>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-fin-ink">{formatUSD(data.usd)}</p>
                      <p className="text-xs font-semibold text-fin-text">{formatIDR(data.idr)}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

          <p className="mt-4 text-sm leading-6 text-fin-text">
            Data ini membantu kamu memahami perubahan nilai tukar saat belajar inflasi, impor, dan daya beli. Sumber:{' '}
            <span className="font-extrabold text-fin-ink">
              {source === 'backend' ? 'Backend FinLearn' : 'Public API'}
            </span>
            .
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
