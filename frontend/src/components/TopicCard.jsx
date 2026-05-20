import { Link } from 'react-router-dom'

const topicInitials = {
  budgeting: 'BG',
  inflasi: 'IF',
  'compound-interest': 'CI',
}

function TopicCard({ topic, to, cta = 'Buka Materi' }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-fin-line bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-fin-sage hover:bg-fin-shell hover:shadow-panel focus:outline-none focus:ring-2 focus:ring-fin-forest focus:ring-offset-2 focus:ring-offset-fin-mist"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-fin-mist text-sm font-extrabold text-fin-forest ring-1 ring-fin-line transition group-hover:scale-105 group-hover:bg-fin-sageSoft">
        {topicInitials[topic.slug] || topic.shortLabel?.slice(0, 2).toUpperCase() || 'FL'}
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
