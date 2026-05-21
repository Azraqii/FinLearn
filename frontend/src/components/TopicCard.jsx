import { Link } from 'react-router-dom'

const topicIcons = {
  budgeting: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 26, height: 26 }}>
      <rect x="2" y="6" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 11h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="14.5" y="14" width="4.5" height="2.5" rx="1" fill="currentColor" opacity="0.55" />
      <path d="M6 6V5.5A2.5 2.5 0 018.5 3h7A2.5 2.5 0 0118 5.5V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  inflasi: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 26, height: 26 }}>
      <polyline points="2,18 8,11 13,14.5 22,5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17,5 22,5 22,10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="2" y1="21" x2="22" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  'compound-interest': (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 26, height: 26 }}>
      <circle cx="8.5" cy="8.5" r="2.75" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="15.5" cy="15.5" r="2.75" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 18.5L18 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
}

function TopicCard({ topic, to, cta = 'Buka Materi' }) {
  const icon = topicIcons[topic.slug]

  return (
    <Link
      to={to}
      className="group rounded-2xl border border-fin-line bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-fin-sage hover:bg-fin-shell hover:shadow-panel focus:outline-none focus:ring-2 focus:ring-fin-forest focus:ring-offset-2 focus:ring-offset-fin-mist"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-fin-mist text-fin-forest ring-1 ring-fin-line transition group-hover:scale-105 group-hover:bg-fin-sageSoft">
        {icon ?? topic.shortLabel?.slice(0, 2).toUpperCase() ?? 'FL'}
      </div>

      <h3 className="text-lg font-extrabold text-fin-ink transition group-hover:text-fin-forest">
        {topic.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-fin-text">{topic.description}</p>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-fin-forest transition group-hover:gap-3 group-hover:text-fin-ink">
        {cta} <span aria-hidden="true" className="transition group-hover:translate-x-1">-&gt;</span>
      </div>
    </Link>
  )
}

export default TopicCard
