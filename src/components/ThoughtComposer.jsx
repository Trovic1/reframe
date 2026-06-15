import { useState } from 'react'
import { IconSparkles, IconLoader2, IconAlertTriangle } from '@tabler/icons-react'
import MoodSlider from './MoodSlider.jsx'

const PROMPTS = [
  'I always mess everything up.',
  'Everyone at work thinks I\'m not good enough.',
  'If I fail this, my whole future is ruined.',
  'I should be further along by now.',
]

// The compose screen: write the thought, optionally rate how heavy it feels,
// then ask for a reframe.
export default function ThoughtComposer({ onSubmit, loading, error }) {
  const [thought, setThought] = useState('')
  const [heavy, setHeavy] = useState(null)

  function submit(e) {
    e.preventDefault()
    const t = thought.trim()
    if (!t || loading) return
    onSubmit(t, heavy)
  }

  return (
    <form onSubmit={submit} className="card p-6 animate-fade-up">
      <label htmlFor="thought" className="mb-2 block text-lg font-bold text-ink">
        What's weighing on you?
      </label>
      <p className="mb-3 text-sm text-ink-muted">
        Write it exactly as it sounds in your head. No one else sees this.
      </p>

      <textarea
        id="thought"
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        rows={4}
        placeholder="e.g. I completely embarrassed myself in that meeting…"
        className="field resize-none"
        autoFocus
      />

      {/* Quick-start examples */}
      {!thought && (
        <div className="mt-3 flex flex-wrap gap-2">
          {PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setThought(p)}
              className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 active:scale-95"
            >
              “{p}”
            </button>
          ))}
        </div>
      )}

      {/* Heaviness */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-ink">
          How heavy does it feel right now?
          <span className="font-normal text-ink-muted"> (optional)</span>
        </p>
        <MoodSlider value={heavy} onChange={setHeavy} lowLabel="Light" highLabel="Crushing" />
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-terracotta-200 bg-terracotta-50 px-3.5 py-2.5 text-sm text-terracotta-700">
          <IconAlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!thought.trim() || loading}
        className="btn-primary mt-5 w-full py-4 text-base"
      >
        {loading ? (
          <>
            <IconLoader2 size={20} className="animate-spin" />
            Reframing…
          </>
        ) : (
          <>
            <IconSparkles size={20} stroke={2} />
            Reframe this thought
          </>
        )}
      </button>
    </form>
  )
}
