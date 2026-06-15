import MoodFace from './MoodFace.jsx'

// The five mood levels, laid out in a gentle upward curve like the screenshot's
// smile-shaped row. `value` is 0..4; null means nothing chosen yet.
const MOODS = [
  { score: 0.0, label: 'Awful' },
  { score: 0.28, label: 'Low' },
  { score: 0.5, label: 'Okay' },
  { score: 0.78, label: 'Good' },
  { score: 1.0, label: 'Great' },
]

// Vertical offsets (in px) to trace the curve — ends high, middle low.
const CURVE = [22, 6, 0, 6, 22]

export default function MoodPicker({ value, onChange }) {
  return (
    <div>
      <div className="flex items-end justify-between gap-2 sm:gap-3">
        {MOODS.map((m, i) => {
          const active = value === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              aria-pressed={active}
              aria-label={m.label}
              style={{ marginTop: CURVE[i] }}
              className={`group flex flex-1 flex-col items-center gap-2 rounded-3xl p-2 transition-all duration-200 active:scale-95 ${
                active ? 'scale-110' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span
                className={`rounded-full transition-shadow ${
                  active ? 'shadow-glow' : ''
                }`}
              >
                <MoodFace score={m.score} size={active ? 64 : 52} animate />
              </span>
              <span
                className={`text-sm font-bold transition-colors ${
                  active ? 'text-ink' : 'text-ink-muted'
                }`}
              >
                {m.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { MOODS }
