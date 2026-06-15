import { IconArrowRight } from '@tabler/icons-react'
import Confetti from './Confetti.jsx'
import MoodFace from './MoodFace.jsx'

// The celebratory finish, shown after a reframe is saved. Confetti, the
// before → after shift drawn as two faces, and a warm closing line. Gives the
// flow (and the demo video) a satisfying payoff.
export default function Celebration({ heavyBefore, heavyAfter, encouragement, onDone }) {
  const hasDelta = typeof heavyBefore === 'number' && typeof heavyAfter === 'number'
  // Heaviness 1..10 → brightness 1..0 (heavier = darker face).
  const scoreFor = (h) => 1 - (h - 1) / 9

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Confetti />

      <div aria-hidden className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl animate-float-slow" />
      <div aria-hidden className="pointer-events-none absolute -right-16 bottom-16 h-64 w-64 rounded-full bg-indigo-300/40 blur-3xl animate-float" />

      <div className="relative z-10 w-full max-w-lg animate-fade-up">
        <div className="mb-2 animate-bob inline-block">
          <MoodFace score={0.95} size={120} />
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
          <span className="text-gradient">Reframed.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-xl leading-relaxed text-ink-muted">
          {encouragement || 'You showed up for yourself today — that matters.'}
        </p>

        {hasDelta && (
          <div className="card mt-8 flex items-center justify-center gap-5 p-6">
            <div className="flex flex-col items-center gap-1.5">
              <MoodFace score={scoreFor(heavyBefore)} size={64} />
              <span className="text-sm font-semibold text-ink-muted">Before · {heavyBefore}</span>
            </div>
            <IconArrowRight size={28} className="text-indigo-400" />
            <div className="flex flex-col items-center gap-1.5">
              <MoodFace score={scoreFor(heavyAfter)} size={64} />
              <span className="text-sm font-semibold text-ink-muted">Now · {heavyAfter}</span>
            </div>
          </div>
        )}

        <button type="button" onClick={onDone} className="btn-primary mt-8 w-full py-4 text-lg">
          Done
        </button>
      </div>
    </div>
  )
}
