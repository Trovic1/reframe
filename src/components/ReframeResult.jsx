import { useState } from 'react'
import {
  IconQuote,
  IconHeartHandshake,
  IconScale,
  IconBulb,
  IconDeviceFloppy,
  IconPencilPlus,
  IconCloudOff,
} from '@tabler/icons-react'
import { DISTORTIONS } from '../lib/distortions.js'
import { CATEGORIES } from '../lib/checkin.js'
import DistortionChip from './DistortionChip.jsx'
import ScaleSlider from './ScaleSlider.jsx'
import MoodFace from './MoodFace.jsx'

const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]))

// The payoff screen. Shows the AI's reframe of the thought: a warm validation,
// the thinking patterns it spotted, a balanced look at the facts, the reframe
// itself (the hero), and a reflection question. Finally we ask how heavy the
// thought feels *now* — the before/after delta is what makes progress visible.
export default function ReframeResult({ thought, result, answers, heavyBefore, onSave, onStartOver }) {
  const [heavyAfter, setHeavyAfter] = useState(heavyBefore ?? 5)

  const chips = (result.distortions || [])
    .map((k) => DISTORTIONS.find((d) => d.key === k))
    .filter(Boolean)

  const categories = answers?.categories || []

  return (
    <div className="space-y-5 animate-fade-up">
      {/* The original thought, quoted back gently. */}
      <div className="card p-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <IconQuote size={15} stroke={2} />
          The thought
          {result.offline && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium normal-case tracking-normal text-indigo-600">
              <IconCloudOff size={12} />
              offline mode
            </span>
          )}
        </div>
        <p className="text-xl leading-relaxed text-ink">“{thought}”</p>
        {categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {categories.map((k) => (
              <span
                key={k}
                className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700"
              >
                {CAT_LABEL[k] || k}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Validation. */}
      {result.validation && (
        <Section icon={IconHeartHandshake} label="First, this is valid">
          <p className="text-lg leading-relaxed text-ink">{result.validation}</p>
        </Section>
      )}

      {/* Distortions spotted — the educational core. */}
      {chips.length > 0 && (
        <div>
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Patterns hiding inside it
          </p>
          <div className="space-y-2">
            {chips.map((d) => (
              <DistortionChip key={d.key} distortion={d} />
            ))}
          </div>
        </div>
      )}

      {/* A balanced look at the facts. */}
      {result.evidence && (
        <Section icon={IconScale} label="A balanced look">
          <p className="text-lg leading-relaxed text-ink">{result.evidence}</p>
        </Section>
      )}

      {/* The reframe — the hero of the screen. */}
      <div className="relative overflow-hidden rounded-3xl bg-calm-gradient p-7 shadow-glow">
        <IconQuote
          size={72}
          className="pointer-events-none absolute -right-2 -top-2 text-white/15"
          stroke={2}
        />
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/80">
          A kinder, truer way to see it
        </p>
        <p className="text-2xl font-semibold leading-relaxed text-white">{result.reframe}</p>
      </div>

      {/* Reflection question. */}
      {result.reflection && (
        <Section icon={IconBulb} label="Sit with this">
          <p className="text-lg leading-relaxed text-ink">{result.reflection}</p>
        </Section>
      )}

      {/* After-heaviness: make the shift measurable. */}
      <div className="card p-6">
        <p className="mb-4 text-lg font-bold text-ink">
          How heavy does it feel now?
          {typeof heavyBefore === 'number' && (
            <span className="text-base font-normal text-ink-muted"> (it was {heavyBefore}/10)</span>
          )}
        </p>
        <div className="flex flex-col items-center gap-6">
          <MoodFace score={1 - (heavyAfter - 1) / 9} size={88} animate />
          <div className="w-full">
            <ScaleSlider
              value={heavyAfter}
              onChange={setHeavyAfter}
              min={1}
              max={10}
              lowLabel="Light"
              highLabel="Crushing"
            />
          </div>
        </div>
      </div>

      {/* Actions. */}
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={() => onSave(heavyAfter)}
          className="btn-primary flex-1 py-4 text-base"
        >
          <IconDeviceFloppy size={20} stroke={2} />
          Save to journal
        </button>
        <button type="button" onClick={onStartOver} className="btn-ghost flex-1 py-4 text-base">
          <IconPencilPlus size={20} stroke={2} />
          New check-in
        </button>
      </div>
    </div>
  )
}

// A labelled card section with a small leading icon.
function Section({ icon: Icon, label, children }) {
  return (
    <div className="card p-6">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        <Icon size={15} stroke={2} className="text-indigo-500" />
        {label}
      </div>
      {children}
    </div>
  )
}
