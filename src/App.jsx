import { useEffect, useState } from 'react'
import Intro from './components/Intro.jsx'
import Home from './components/Home.jsx'
import CheckInFlow from './components/CheckInFlow.jsx'
import ReframeResult from './components/ReframeResult.jsx'
import Celebration from './components/Celebration.jsx'
import JournalView from './components/JournalView.jsx'
import CrisisBanner from './components/CrisisBanner.jsx'
import { loadState, saveState, makeId } from './lib/storage.js'
import { reframeThought, ReframeError } from './lib/reframe.js'
import { detectCrisis } from './lib/safety.js'
import { buildContext } from './lib/checkin.js'

// Phases of the app:
//   'home'    — dashboard
//   'checkin' — the guided, animated question flow
//   'result'  — the AI reframe, with the after-heaviness check
//   'celebrate' — confetti payoff after saving
const PHASES = { HOME: 'home', CHECKIN: 'checkin', RESULT: 'result', CELEBRATE: 'celebrate' }

export default function App() {
  const [state, setState] = useState(loadState)
  const [phase, setPhase] = useState(PHASES.HOME)

  // Work-in-progress for the current check-in.
  const [answers, setAnswers] = useState(null) // the gathered check-in answers
  const [result, setResult] = useState(null) // the AI reframe
  const [lastDelta, setLastDelta] = useState(null) // { before, after } for celebration
  const [crisis, setCrisis] = useState(null) // pending { thought, answers }
  const [journalOpen, setJournalOpen] = useState(false)

  useEffect(() => {
    saveState(state)
  }, [state])

  function completeIntro() {
    setState((s) => ({ ...s, onboarded: true }))
  }

  // Run the reframe for a thought that has passed the crisis check.
  async function runReframe(thought, context) {
    try {
      return await reframeThought(thought, context)
    } catch (err) {
      const msg =
        err instanceof ReframeError ? err.message : 'Something went wrong. Please try again.'
      throw new Error(msg)
    }
  }

  // CheckInFlow finished and produced a reframe.
  function handleCheckInComplete(reframe, gathered) {
    setResult(reframe)
    setAnswers(gathered)
    setPhase(PHASES.RESULT)
  }

  // CheckInFlow detected crisis language on the thought.
  function handleCrisis(thought, gathered) {
    setCrisis({ thought, answers: gathered })
  }

  // The user chose to continue past the crisis banner: finish the reframe.
  async function continuePastCrisis() {
    const pending = crisis
    setCrisis(null)
    if (!pending) return
    setAnswers(pending.answers)
    // We re-enter the flow's submit by going straight to a reframe here.
    try {
      const reframe = await runReframe(pending.thought, buildContext(pending.answers))
      handleCheckInComplete(reframe, pending.answers)
    } catch {
      setPhase(PHASES.HOME)
    }
  }

  // Save the reframe + all the check-in context to the journal, then celebrate.
  function saveEntry(heavyAfter) {
    const entry = {
      id: makeId(),
      createdAt: new Date().toISOString(),
      thought: answers.thought.trim(),
      mood: answers.mood ?? null,
      categories: answers.categories || [],
      drivers: answers.drivers || [],
      energy: answers.energy ?? null,
      sleep: answers.sleep ?? null,
      heavyBefore: answers.heaviness ?? null,
      heavyAfter: heavyAfter ?? null,
      validation: result.validation,
      evidence: result.evidence,
      reframe: result.reframe,
      reflection: result.reflection,
      encouragement: result.encouragement || '',
      distortions: result.distortions || [],
      offline: Boolean(result.offline),
    }
    setState((s) => ({ ...s, entries: [entry, ...s.entries] }))
    setLastDelta({ before: entry.heavyBefore, after: entry.heavyAfter })
    setPhase(PHASES.CELEBRATE)
  }

  function resetFlow() {
    setResult(null)
    setAnswers(null)
    setPhase(PHASES.HOME)
  }

  function deleteEntry(id) {
    setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }))
  }

  if (!state.onboarded) {
    return <Intro onComplete={completeIntro} />
  }

  return (
    <>
      {phase === PHASES.HOME && (
        <Home
          entries={state.entries}
          onStart={() => setPhase(PHASES.CHECKIN)}
          onOpenJournal={() => setJournalOpen(true)}
        />
      )}

      {phase === PHASES.CHECKIN && (
        <CheckInFlow
          runReframe={runReframe}
          detectCrisis={detectCrisis}
          onComplete={handleCheckInComplete}
          onCrisis={handleCrisis}
          onExit={resetFlow}
        />
      )}

      {phase === PHASES.RESULT && result && (
        <div className="relative mx-auto max-w-2xl px-5 py-8 sm:py-12">
          <ReframeResult
            thought={answers.thought.trim()}
            result={result}
            answers={answers}
            heavyBefore={answers.heaviness}
            onSave={saveEntry}
            onStartOver={resetFlow}
          />
        </div>
      )}

      {phase === PHASES.CELEBRATE && (
        <Celebration
          heavyBefore={lastDelta?.before}
          heavyAfter={lastDelta?.after}
          encouragement={result?.encouragement}
          onDone={resetFlow}
        />
      )}

      {crisis && (
        <CrisisBanner
          onClose={() => {
            setCrisis(null)
            setPhase(PHASES.HOME)
          }}
          onContinue={continuePastCrisis}
        />
      )}
      {journalOpen && (
        <JournalView
          entries={state.entries}
          onClose={() => setJournalOpen(false)}
          onDelete={deleteEntry}
        />
      )}
    </>
  )
}
