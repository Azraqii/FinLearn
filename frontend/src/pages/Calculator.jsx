import { useMemo, useState } from 'react'

function formatIDR(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function calculateCompound(principal, annualRate, years, frequency) {
  const p = Math.max(0, Number(principal) || 0)
  const r = Math.max(0, Number(annualRate) || 0) / 100
  const t = Math.max(0, Number(years) || 0)
  const n = Number(frequency) || 1

  return p * (1 + r / n) ** (n * t)
}

function Calculator() {
  const [principal, setPrincipal] = useState(1000000)
  const [annualRate, setAnnualRate] = useState(6)
  const [years, setYears] = useState(5)
  const [frequency, setFrequency] = useState(12)

  const finalValue = useMemo(
    () => calculateCompound(principal, annualRate, years, frequency),
    [principal, annualRate, years, frequency],
  )

  const totalInterest = finalValue - Math.max(0, Number(principal) || 0)
  const principalValue = Math.max(0, Number(principal) || 0)
  const interestShare = finalValue > 0 ? Math.min(100, Math.max(0, (totalInterest / finalValue) * 100)) : 0

  const growthRows = useMemo(() => {
    return Array.from({ length: Math.max(1, Number(years) || 1) }, (_, index) => {
      const year = index + 1
      const value = calculateCompound(principal, annualRate, year, frequency)
      return {
        year,
        value,
        interest: value - Math.max(0, Number(principal) || 0),
      }
    })
  }, [principal, annualRate, years, frequency])

  const maxValue = Math.max(...growthRows.map((row) => row.value), 1)

  return (
    <main className="min-h-screen bg-fin-mist">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-8 rounded-3xl border border-fin-line bg-white/75 p-6 shadow-soft sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Simulasi investasi</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-fin-ink sm:text-5xl">
            Kalkulator bunga majemuk
          </h1>
          <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-fin-text sm:text-lg">
            Simulasikan rumus A = P(1 + r/n)^(nt) untuk memahami bagaimana modal dapat tumbuh dari waktu ke waktu. Ini alat edukasi dan belum memperhitungkan pajak, biaya, inflasi, atau risiko.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="rounded-3xl border border-fin-line bg-white p-6 shadow-soft sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Input skenario</p>
              <h2 className="mt-2 text-2xl font-extrabold text-fin-ink">Atur asumsi</h2>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Modal awal (Rp)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={principal}
                  onChange={(event) => setPrincipal(Number(event.target.value))}
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3.5 text-base font-bold text-fin-ink outline-none transition focus:border-fin-forest focus:bg-white focus:ring-2 focus:ring-fin-sage"
                />
              </label>

              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <label htmlFor="annualRate" className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">
                    Bunga per tahun
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-fin-line bg-fin-shell px-3 py-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="30"
                      step="0.1"
                      value={annualRate}
                      onChange={(event) => setAnnualRate(Number(event.target.value))}
                      className="w-20 bg-transparent text-right text-base font-extrabold text-fin-ink outline-none"
                    />
                    <span className="text-sm font-extrabold text-fin-forest">%</span>
                  </div>
                </div>
                <input
                  id="annualRate"
                  type="range"
                  min="0"
                  max="30"
                  step="0.1"
                  value={annualRate}
                  onChange={(event) => setAnnualRate(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-fin-forest"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <label htmlFor="years" className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">
                    Jangka waktu
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-fin-line bg-fin-shell px-3 py-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="40"
                      value={years}
                      onChange={(event) => setYears(Number(event.target.value))}
                      className="w-16 bg-transparent text-right text-base font-extrabold text-fin-ink outline-none"
                    />
                    <span className="text-sm font-extrabold text-fin-text">tahun</span>
                  </div>
                </div>
                <input
                  id="years"
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={years}
                  onChange={(event) => setYears(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-fin-forest"
                />
              </div>

              <label className="block">
                <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-fin-text">Frekuensi bunga</span>
                <select
                  value={frequency}
                  onChange={(event) => setFrequency(Number(event.target.value))}
                  className="mt-3 w-full rounded-xl border border-fin-line bg-fin-shell px-4 py-3.5 text-base font-bold text-fin-ink outline-none transition focus:border-fin-forest focus:bg-white focus:ring-2 focus:ring-fin-sage"
                >
                  <option value={1}>Tahunan</option>
                  <option value={12}>Bulanan</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-fin-line bg-white p-6 shadow-panel sm:p-7">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-fin-line bg-fin-shell p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">Modal awal</p>
                <p className="mt-3 break-words text-2xl font-extrabold text-fin-ink">{formatIDR(principalValue)}</p>
              </div>
              <div className="rounded-2xl border border-fin-sage bg-fin-sageSoft p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-forest">Total bunga</p>
                <p className="mt-3 break-words text-2xl font-extrabold text-fin-forest">{formatIDR(totalInterest)}</p>
              </div>
              <div className="rounded-2xl bg-fin-ink p-5 text-white">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-sage">Nilai akhir</p>
                <p className="mt-3 break-words text-2xl font-extrabold">{formatIDR(finalValue)}</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-fin-line bg-fin-shell p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-extrabold text-fin-ink">Komposisi nilai akhir</h2>
                <p className="text-sm font-bold text-fin-text">{Math.round(interestShare)}% dari bunga</p>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-white ring-1 ring-fin-line">
                <div className="h-full rounded-full bg-fin-forest" style={{ width: `${interestShare}%` }} />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-5 text-xl font-extrabold text-fin-ink">Grafik pertumbuhan</h2>
              <div className="space-y-4">
                {growthRows.map((row) => (
                  <div key={row.year} className="grid grid-cols-[58px_1fr] gap-3 sm:grid-cols-[72px_1fr_150px] sm:items-center">
                    <span className="text-sm font-extrabold text-fin-text">Tahun {row.year}</span>
                    <div className="h-8 overflow-hidden rounded-xl bg-fin-mist ring-1 ring-fin-line">
                      <div
                        className="h-full rounded-xl bg-fin-forest transition-all"
                        style={{ width: `${Math.max(6, (row.value / maxValue) * 100)}%` }}
                      />
                    </div>
                    <p className="col-span-2 text-right text-xs font-extrabold text-fin-forest sm:col-span-1">{formatIDR(row.value)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-fin-line">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-fin-line text-sm">
                  <thead className="bg-fin-mist text-left text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">
                    <tr>
                      <th className="px-5 py-4">Tahun</th>
                      <th className="px-5 py-4">Nilai akhir</th>
                      <th className="px-5 py-4">Bunga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-fin-line bg-white">
                    {growthRows.map((row) => (
                      <tr key={row.year} className="hover:bg-fin-shell">
                        <td className="px-5 py-3 font-extrabold text-fin-ink">{row.year}</td>
                        <td className="px-5 py-3 font-semibold text-fin-text">{formatIDR(row.value)}</td>
                        <td className="px-5 py-3 font-extrabold text-fin-forest">{formatIDR(row.interest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Calculator
