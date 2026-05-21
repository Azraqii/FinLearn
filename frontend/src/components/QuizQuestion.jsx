function QuizQuestion({ question, selectedAnswer, onSelect }) {
  return (
    <div className="rounded-3xl border border-fin-line bg-white p-6 shadow-soft sm:p-8">
      <h2 className="text-xl font-extrabold leading-8 text-fin-ink sm:text-2xl">{question.question}</h2>

      <div className="mt-5 grid gap-2.5" role="radiogroup" aria-label={question.question}>
        {question.options.map((option, index) => {
          const selected = selectedAnswer === option

          return (
            <label
              key={option}
              className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-4 text-base font-semibold leading-6 transition-all duration-150 sm:p-5 ${
                selected
                  ? 'border-fin-forest bg-fin-sageSoft text-fin-ink shadow-sm'
                  : 'border-fin-line bg-white text-fin-text hover:border-fin-sage hover:bg-fin-shell'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={selected}
                onChange={() => onSelect(option)}
                className="sr-only"
              />
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition-all duration-150 ${
                  selected
                    ? 'bg-fin-forest text-white'
                    : 'bg-fin-mist text-fin-text ring-1 ring-fin-line group-hover:ring-fin-sage'
                }`}
              >
                {selected ? (
                  <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                    <path d="M3 8.5L6.5 12L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </span>
              <span className="flex-1">{option}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default QuizQuestion
