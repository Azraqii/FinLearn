function QuizQuestion({ question, selectedAnswer, onSelect }) {
  return (
    <fieldset className="rounded-3xl border border-fin-line bg-white p-6 shadow-soft sm:p-8">
      <legend className="px-1 text-xl font-extrabold leading-8 text-fin-ink sm:text-2xl">{question.question}</legend>

      <div className="mt-6 grid gap-3">
        {question.options.map((option, index) => {
          const selected = selectedAnswer === option

          return (
            <label
              key={option}
              className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 text-base font-semibold leading-7 transition-all sm:p-5 ${
                selected
                  ? 'border-fin-forest bg-fin-sageSoft text-fin-ink shadow-lift'
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
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                  selected ? 'bg-fin-forest text-white' : 'bg-fin-mist text-fin-text ring-1 ring-fin-line'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default QuizQuestion
