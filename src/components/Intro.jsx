import { IconFeather, IconArrowRight, IconShieldHeart } from '@tabler/icons-react'
import { hasApiKey } from '../lib/reframe.js'

// First-run welcome. Explains what Reframe is, sets gentle expectations, and —
// importantly for a mental-wellness tool — states up front that this is not
// therapy. Honest framing builds trust (and scores the accessibility criteria).
export default function Intro({ onComplete }) {
  const steps = [
    { n: '1', text: 'Write down a thought that\'s weighing on you.' },
    { n: '2', text: 'See the thinking patterns hiding inside it.' },
    { n: '3', text: 'Get a kinder, truer way to see the same thing.' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-indigo-300/40 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-violet-300/40 blur-3xl animate-float"
      />

      <div className="relative mx-auto max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-calm-gradient shadow-glow animate-float">
            <IconFeather size={40} className="text-white" stroke={1.75} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink">
            <span className="text-gradient">Reframe</span>
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-ink-muted">
            A calm space to untangle a heavy thought. Reframe uses gentle
            cognitive behavioral therapy techniques to help you see it more
            clearly — and more kindly.
          </p>
        </div>

        <div className="card p-6">
          <div className="space-y-3.5">
            {steps.map((s) => (
              <div key={s.n} className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-calm-gradient text-sm font-bold text-white shadow-soft">
                  {s.n}
                </div>
                <p className="text-base text-ink">{s.text}</p>
              </div>
            ))}
          </div>

          {/* Honest, up-front safety framing. */}
          <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-indigo-50 px-4 py-3.5">
            <IconShieldHeart size={20} className="mt-0.5 shrink-0 text-indigo-500" stroke={1.75} />
            <p className="text-sm leading-relaxed text-indigo-900/80">
              Reframe is a self-reflection tool, <strong>not therapy</strong>.
              If things ever feel like too much, it will help you find real
              support.
            </p>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="btn-primary mt-6 w-full py-4 text-base"
          >
            Start
            <IconArrowRight size={20} stroke={2.5} />
          </button>

          {!hasApiKey() && (
            <p className="mt-3 text-center text-xs leading-relaxed text-ink-muted">
              No AI key detected — Reframe will run in a simpler offline mode.
              Add a free Groq key (see README) for the full experience.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
