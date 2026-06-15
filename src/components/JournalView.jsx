import {
  IconX,
  IconNotebook,
  IconArrowRight,
  IconTrash,
  IconCloudOff,
} from '@tabler/icons-react'
import { DISTORTIONS } from '../lib/distortions.js'
import { formatWhen } from '../lib/date.js'
import MoodFace from './MoodFace.jsx'
import { MOODS } from './MoodPicker.jsx'

// A modal listing every saved reframe, newest first. Each card shows the
// original thought, the reframe it became, the before→after heaviness shift,
// and the patterns spotted. A small history makes growth visible over time.
export default function JournalView({ entries, onClose, onDelete }) {
  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/30 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="card flex max-h-[88vh] w-full max-w-lg flex-col rounded-b-none rounded-t-3xl p-0 shadow-lift animate-fade-up sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-indigo-50 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-calm-gradient shadow-soft">
            <IconNotebook size={18} className="text-white" stroke={2} />
          </div>
          <h2 className="text-lg font-extrabold text-ink">Your journal</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close journal"
            className="ml-auto rounded-full p-1.5 text-ink-muted transition hover:bg-indigo-50 hover:text-ink"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {sorted.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-base font-semibold text-ink">No reframes yet</p>
              <p className="mt-1 text-sm text-ink-muted">
                The thoughts you reframe will gather here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((e) => (
                <JournalCard key={e.id} entry={e} onDelete={() => onDelete(e.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function JournalCard({ entry, onDelete }) {
  const hasDelta =
    typeof entry.heavyBefore === 'number' && typeof entry.heavyAfter === 'number'
  const names = (entry.distortions || [])
    .map((k) => DISTORTIONS.find((d) => d.key === k)?.name)
    .filter(Boolean)
  const mood = typeof entry.mood === 'number' ? MOODS[entry.mood] : null

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
        {mood && <MoodFace score={mood.score} size={26} />}
        <span>{formatWhen(entry.createdAt)}</span>
        {entry.offline && (
          <span className="inline-flex items-center gap-1">
            <IconCloudOff size={12} /> offline
          </span>
        )}
        {hasDelta && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-600">
            {entry.heavyBefore} → {entry.heavyAfter}
          </span>
        )}
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete entry"
          className={`rounded-full p-1 text-ink-muted/60 transition hover:bg-terracotta-50 hover:text-terracotta-600 ${
            hasDelta ? '' : 'ml-auto'
          }`}
        >
          <IconTrash size={15} />
        </button>
      </div>

      <p className="text-sm leading-relaxed text-ink-muted line-through decoration-ink-muted/30">
        “{entry.thought}”
      </p>
      <div className="my-1.5 flex justify-center text-indigo-300">
        <IconArrowRight size={16} className="rotate-90" />
      </div>
      <p className="text-sm font-semibold leading-relaxed text-ink">“{entry.reframe}”</p>

      {names.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {names.map((n) => (
            <span
              key={n}
              className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700"
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
