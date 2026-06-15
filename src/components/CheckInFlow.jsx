import { useMemo, useState } from 'react'
import StepShell from './StepShell.jsx'
import StepTransition from './StepTransition.jsx'
import MoodPicker, { MOODS } from './MoodPicker.jsx'
import ScaleSlider from './ScaleSlider.jsx'
import MoodFace from './MoodFace.jsx'
import {
  activeSteps,
  resolve,
  buildContext,
  DEFAULT_ANSWERS,
  CATEGORIES,
  DRIVERS,
} from '../lib/checkin.js'

// Orchestrates the guided check-in: walks the (branching) step list, shows an
// animated splash between steps, then a "thinking" splash while the reframe is
// generated, and finally hands the result + answers back up to App.
//
// Props:
//   onComplete(result, answers, context)  — reframe arrived
//   onCrisis(thought, answers)            — crisis language detected on submit
//   onExit()                              — user bailed out
//   runReframe(thought, context)          — async, returns the reframe result
//   detectCrisis(text)                    — crisis check
export default function CheckInFlow({ onComplete, onCrisis, onExit, runReframe, detectCrisis }) {
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS)
  const [index, setIndex] = useState(0)
  const [splash, setSplash] = useState(null) // { message, faceScore } | null
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  // The active step list depends on answers (branching). Recompute each render.
  const steps = useMemo(() => activeSteps(answers), [answers])
  const step = steps[Math.min(index, steps.length - 1)]
  const isLast = index >= steps.length - 1

  const faceScore = answers.mood != null ? MOODS[answers.mood].score : 0.5

  function set(patch) {
    setAnswers((a) => ({ ...a, ...patch }))
  }

  const canNext = step.valid ? step.valid(answers) : true

  function goNext() {
    if (!canNext) return
    setError('')

    // Crisis check the moment we have the thought.
    if (step.id === 'thought' && detectCrisis(answers.thought)) {
      onCrisis(answers.thought, answers)
      return
    }

    if (isLast) {
      submit()
      return
    }

    // Show the affirming splash, then advance.
    setSplash({ message: resolve(step.splash, answers), faceScore })
  }

  function afterSplash() {
    setSplash(null)
    setIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  function goBack() {
    setError('')
    setIndex((i) => Math.max(0, i - 1))
  }

  async function submit() {
    setProcessing(true)
    setError('')
    try {
      const context = buildContext(answers)
      const result = await runReframe(answers.thought.trim(), context)
      onComplete(result, answers, context)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
      setProcessing(false)
    }
  }

  // ---- The "thinking" splash takes over the whole screen ----
  if (processing) {
    return (
      <StepTransition
        loading
        faceScore={faceScore}
        message={'Finding a kinder, truer\nway to see it…'}
      />
    )
  }

  // ---- Between-question splash ----
  if (splash) {
    return <StepTransition message={splash.message} faceScore={splash.faceScore} onDone={afterSplash} />
  }

  return (
    <StepShell
      eyebrow={resolve(step.eyebrow, answers)}
      title={resolve(step.title, answers)}
      subtitle={resolve(step.subtitle, answers)}
      faceScore={faceScore}
      step={index}
      total={steps.length}
      canBack={index > 0}
      canNext={canNext}
      nextLabel={isLast ? 'Reframe this' : 'Continue'}
      onBack={goBack}
      onNext={goNext}
      onExit={onExit}
    >
      <StepBody step={step} answers={answers} set={set} faceScore={faceScore} />

      {error && (
        <p className="mt-4 rounded-2xl border-2 border-terracotta-200 bg-terracotta-50 px-4 py-3 text-base font-medium text-terracotta-700">
          {error}
        </p>
      )}
    </StepShell>
  )
}

// Renders the input for the current step.
function StepBody({ step, answers, set, faceScore }) {
  switch (step.kind) {
    case 'mood':
      return <MoodPicker value={answers.mood} onChange={(mood) => set({ mood })} />

    case 'thought':
      return (
        <div>
          <textarea
            value={answers.thought}
            onChange={(e) => set({ thought: e.target.value })}
            rows={5}
            autoFocus
            placeholder="e.g. I completely embarrassed myself in that meeting…"
            className="field resize-none"
          />
          {!answers.thought && (
            <div className="mt-3 flex flex-wrap gap-2">
              {['I always mess everything up.', 'Everyone thinks I’m not good enough.', 'If I fail this, my future is ruined.'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set({ thought: p })}
                  className="rounded-full border-2 border-indigo-100 bg-indigo-50 px-3.5 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 active:scale-95"
                >
                  “{p}”
                </button>
              ))}
            </div>
          )}
        </div>
      )

    case 'category':
      return (
        <ChipGroup
          options={CATEGORIES}
          selected={answers.categories}
          max={3}
          onChange={(categories) => set({ categories })}
        />
      )

    case 'drivers':
      return (
        <ChipGroup
          options={DRIVERS}
          selected={answers.drivers}
          max={3}
          onChange={(drivers) => set({ drivers })}
        />
      )

    case 'heaviness':
      return (
        <div className="flex flex-col items-center gap-7">
          <MoodFace score={1 - (answers.heaviness - 1) / 9} size={120} animate />
          <div className="w-full">
            <ScaleSlider
              value={answers.heaviness}
              onChange={(heaviness) => set({ heaviness })}
              min={1}
              max={10}
              lowLabel="Light"
              highLabel="Crushing"
            />
          </div>
        </div>
      )

    case 'body':
      return (
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-lg font-bold text-ink">How’s your energy?</p>
            <ScaleSlider
              value={answers.energy}
              onChange={(energy) => set({ energy })}
              min={1}
              max={10}
              lowLabel="Drained"
              highLabel="Energized"
            />
          </div>
          <div>
            <p className="mb-3 text-lg font-bold text-ink">How long did you sleep last night?</p>
            <ScaleSlider
              value={answers.sleep}
              onChange={(sleep) => set({ sleep })}
              min={0}
              max={12}
              step={0.5}
              lowLabel="0h"
              highLabel="12h"
              valueLabel={(v) => `${v}h`}
            />
          </div>
        </div>
      )

    default:
      return null
  }
}

// A multi-select set of pills with an optional max.
function ChipGroup({ options, selected, onChange, max }) {
  function toggle(key) {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key))
    } else if (!max || selected.length < max) {
      onChange([...selected, key])
    }
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const active = selected.includes(o.key)
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => toggle(o.key)}
            aria-pressed={active}
            className={`chip ${active ? 'chip-active' : ''}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
