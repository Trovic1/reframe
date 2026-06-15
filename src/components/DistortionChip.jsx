import { useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'

// A named cognitive distortion, shown as a pill that expands to explain itself.
// Tapping teaches the user the pattern — the educational core of the app.
export default function DistortionChip({ distortion }) {
  const [open, setOpen] = useState(false)
  if (!distortion) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/70">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left"
      >
        <span className="text-sm font-semibold text-violet-800">{distortion.name}</span>
        <IconChevronDown
          size={16}
          className={`shrink-0 text-violet-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="px-3.5 pb-3 text-sm leading-relaxed text-violet-700 animate-fade-up">
          {distortion.blurb}
        </p>
      )}
    </div>
  )
}
