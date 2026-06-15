import { useEffect, useState } from 'react'
import { IconFeather, IconNotebook } from '@tabler/icons-react'
import Intro from './components/Intro.jsx'
import ThoughtComposer from './components/ThoughtComposer.jsx'
import ReframeResult from './components/ReframeResult.jsx'
import JournalView from './components/JournalView.jsx'
import StatsBar from './components/StatsBar.jsx'
import CrisisBanner from './components/CrisisBanner.jsx'
import { loadState, saveState, makeId } from './lib/storage.js'
import { reframeThought, ReframeError } from './lib/reframe.js'
import { detectCrisis } from './lib/safety.js'
import { greeting } from './lib/date.js'

export default function App() {
  const [state, setState] = useState(loadState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // The thought currently being worked on, and its reframe once it arrives.
  const [draft, setDraft] = useState(null) // { thought, heavyBefore }
  const [result, setResult] = useState(null)
  const [crisis, setCrisis] = useState(null) // { thought, heavyBefore } awaiting confirm
  const [journalOpen, setJournalOpen] = useState(false)

  // Persist on every change.
  useEffect(() => {
    saveState(state)
  }, [state])

  function completeIntro() {
    setState((s) => ({ ...s, onboarded: true }))
  }

  // Run the reframe for a thought we've already cleared past the crisis check.
  async function runReframe(thought, heavyBefore) {
    setLoading(true)
    setError('')
    setDraft({ thought, heavyBefore })
    try {
      const r = await reframeThought(thought)
      setResult(r)
    } catch (err) {
      const msg =
        err instanceof ReframeError
          ? err.message
          : 'Something went wrong. Please try again.'
      setError(msg)
      setDraft(null)
    } finally {
      setLoading(false)
    }
  }

  // From the composer: check for crisis language first, then reframe.
  function handleSubmit(thought, heavyBefore) {
    setError('')
    if (detectCrisis(thought)) {
      setCrisis({ thought, heavyBefore })
      return
    }
    runReframe(thought, heavyBefore)
  }

  function continuePastCrisis() {
    const pending = crisis
    setCrisis(null)
    if (pending) runReframe(pending.thought, pending.heavyBefore)
  }

  // Save the current reframe to the journal and return to the composer.
  function saveEntry(heavyAfter) {
    const entry = {
      id: makeId(),
      createdAt: new Date().toISOString(),
      thought: draft.thought,
      heavyBefore: draft.heavyBefore ?? null,
      heavyAfter: heavyAfter ?? null,
      validation: result.validation,
      evidence: result.evidence,
      reframe: result.reframe,
      reflection: result.reflection,
      distortions: result.distortions || [],
      offline: Boolean(result.offline),
    }
    setState((s) => ({ ...s, entries: [entry, ...s.entries] }))
    startOver()
  }

  function startOver() {
    setResult(null)
    setDraft(null)
    setError('')
  }

  function deleteEntry(id) {
    setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }))
  }

  if (!state.onboarded) {
    return <Intro onComplete={completeIntro} />
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative floating blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-72 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl animate-float"
      />

      <div className="relative mx-auto max-w-lg px-5 py-8 sm:py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-calm-gradient shadow-glow">
              <IconFeather size={22} className="text-white" stroke={1.75} />
            </span>
            <div>
              <p className="text-sm font-medium text-ink-muted">{greeting()}</p>
              <h1 className="text-2xl font-extrabold leading-none tracking-tight">
                <span className="text-gradient">Reframe</span>
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setJournalOpen(true)}
            aria-label="Open journal"
            className="btn-ghost rounded-2xl px-3.5 py-3"
          >
            <IconNotebook size={20} stroke={1.75} />
          </button>
        </header>

        {/* Progress across saved reframes */}
        {state.entries.length > 0 && !result && (
          <div className="mb-6">
            <StatsBar entries={state.entries} />
          </div>
        )}

        {/* Compose, or the reframe result */}
        {result ? (
          <ReframeResult
            thought={draft.thought}
            result={result}
            heavyBefore={draft.heavyBefore}
            onSave={saveEntry}
            onStartOver={startOver}
          />
        ) : (
          <ThoughtComposer onSubmit={handleSubmit} loading={loading} error={error} />
        )}
      </div>

      {crisis && (
        <CrisisBanner onClose={() => setCrisis(null)} onContinue={continuePastCrisis} />
      )}
      {journalOpen && (
        <JournalView
          entries={state.entries}
          onClose={() => setJournalOpen(false)}
          onDelete={deleteEntry}
        />
      )}
    </div>
  )
}
