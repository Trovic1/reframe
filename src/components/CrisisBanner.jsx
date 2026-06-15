import { IconLifebuoy, IconExternalLink, IconX } from '@tabler/icons-react'
import { CRISIS_RESOURCES, SAFETY_DISCLAIMER } from '../lib/safety.js'

// Shown when a thought contains language that suggests a possible crisis. We
// stop the normal reframing flow and put real human help first. The user can
// still choose to continue reframing if they want.
export default function CrisisBanner({ onClose, onContinue }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md rounded-b-none rounded-t-3xl p-6 shadow-lift animate-fade-up sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunrise shadow-soft">
            <IconLifebuoy size={24} className="text-white" stroke={2} />
          </div>
          <h2 className="text-xl font-extrabold text-ink">You deserve support right now</h2>
        </div>

        <p className="text-sm leading-relaxed text-ink-muted">
          It sounds like you might be going through something really painful.
          You don't have to face it alone — please consider reaching out to a
          person who can help.
        </p>

        <div className="mt-4 space-y-2.5">
          {CRISIS_RESOURCES.map((r) => (
            <a
              key={r.name}
              href={r.href}
              target={r.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white px-4 py-3 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="rounded-lg bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                {r.region}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">{r.name}</span>
                <span className="block text-sm text-ink-muted">{r.contact}</span>
              </span>
              {r.href.startsWith('http') && (
                <IconExternalLink size={16} className="shrink-0 text-ink-muted" />
              )}
            </a>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink-muted">{SAFETY_DISCLAIMER}</p>

        <div className="mt-5 flex gap-2.5">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">
            <IconX size={18} />
            Close
          </button>
          <button type="button" onClick={onContinue} className="btn-ghost flex-1">
            Reframe anyway
          </button>
        </div>
      </div>
    </div>
  )
}
