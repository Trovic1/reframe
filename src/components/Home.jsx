import { IconFeather, IconNotebook, IconArrowRight } from '@tabler/icons-react'
import MoodFace from './MoodFace.jsx'
import StatsBar from './StatsBar.jsx'
import { greeting } from '../lib/date.js'
import { MOODS } from './MoodPicker.jsx'

// The home base. A warm greeting, the big "start a check-in" call to action,
// progress across past reframes, and a peek at the most recent one. Fills a
// desktop screen (centered, roomy) and stacks naturally on a phone.
export default function Home({ entries, onStart, onOpenJournal }) {
  const last = entries[0]
  const lastMood = last && typeof last.mood === 'number' ? MOODS[last.mood] : null

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl animate-float-slow" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-72 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl animate-float" />

      <div className="relative mx-auto max-w-2xl px-5 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-calm-gradient shadow-glow">
              <IconFeather size={24} className="text-white" stroke={1.75} />
            </span>
            <div>
              <p className="text-sm font-medium text-ink-muted">{greeting()}</p>
              <h1 className="text-3xl font-bold leading-none">
                <span className="text-gradient">Reframe</span>
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenJournal}
            aria-label="Open journal"
            className="btn-ghost rounded-2xl px-4 py-3.5"
          >
            <IconNotebook size={22} stroke={1.75} />
          </button>
        </header>

        {/* Hero CTA */}
        <button
          type="button"
          onClick={onStart}
          className="group relative mb-6 flex w-full items-center gap-5 overflow-hidden rounded-3xl bg-calm-gradient p-7 text-left shadow-glow transition-transform hover:-translate-y-0.5 active:scale-[0.99] sm:p-9"
        >
          <div aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
          <div className="animate-bob shrink-0">
            <MoodFace score={0.85} size={92} />
          </div>
          <div className="relative min-w-0 flex-1 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75">
              Take a moment
            </p>
            <p className="mt-1 text-3xl font-bold leading-tight sm:text-4xl">
              Start a check-in
            </p>
            <p className="mt-2 text-lg text-white/85">
              A few gentle questions, then a kinder way to see it.
            </p>
          </div>
          <IconArrowRight
            size={28}
            className="relative shrink-0 text-white transition-transform group-hover:translate-x-1"
          />
        </button>

        {/* Stats */}
        {entries.length > 0 && (
          <div className="mb-6">
            <StatsBar entries={entries} />
          </div>
        )}

        {/* Last check-in peek */}
        {last && (
          <button
            type="button"
            onClick={onOpenJournal}
            className="card flex w-full items-center gap-4 p-5 text-left transition hover:-translate-y-0.5"
          >
            {lastMood && (
              <span className="shrink-0">
                <MoodFace score={lastMood.score} size={52} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink-muted">Your last reframe</p>
              <p className="truncate text-lg font-semibold text-ink">“{last.reframe}”</p>
            </div>
            <IconArrowRight size={20} className="shrink-0 text-ink-muted" />
          </button>
        )}
      </div>
    </div>
  )
}
