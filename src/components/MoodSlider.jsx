// A 1–5 "how heavy does this feel?" selector. Five tappable steps, gradient
// fill up to the chosen weight. Used both before (heaviness) and after (relief).
const STEPS = [1, 2, 3, 4, 5]

export default function MoodSlider({ value, onChange, lowLabel = 'Light', highLabel = 'Crushing' }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {STEPS.map((n) => {
          const active = value != null && n <= value
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`Heaviness ${n} of 5`}
              aria-pressed={value === n}
              className={`h-9 flex-1 rounded-xl border-2 transition-all duration-150 active:scale-95 ${
                active
                  ? 'border-transparent bg-calm-gradient shadow-soft'
                  : 'border-indigo-100 bg-white hover:border-indigo-200'
              } ${value === n ? 'ring-2 ring-indigo-300 ring-offset-1' : ''}`}
            />
          )
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-xs font-medium text-ink-muted">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}
