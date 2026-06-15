import { IconNotebook, IconArrowDownRight, IconBrain } from '@tabler/icons-react'
import { DISTORTIONS } from '../lib/distortions.js'

// A compact summary across all saved entries: how many reframes, the average
// drop in heaviness (before → after), and the pattern that shows up most.
export default function StatsBar({ entries }) {
  const count = entries.length

  // Average lightening, over entries that have both before & after recorded.
  const withBoth = entries.filter(
    (e) => typeof e.heavyBefore === 'number' && typeof e.heavyAfter === 'number'
  )
  const avgDrop =
    withBoth.length > 0
      ? withBoth.reduce((s, e) => s + (e.heavyBefore - e.heavyAfter), 0) / withBoth.length
      : 0

  // Most common distortion across all entries.
  const counts = {}
  for (const e of entries) for (const k of e.distortions || []) counts[k] = (counts[k] || 0) + 1
  const topKey = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
  const topName = topKey ? DISTORTIONS.find((d) => d.key === topKey)?.name : null

  const tiles = [
    { icon: IconNotebook, value: count, label: count === 1 ? 'reframe' : 'reframes' },
    {
      icon: IconArrowDownRight,
      value: avgDrop > 0 ? `−${avgDrop.toFixed(1)}` : '—',
      label: 'avg. lighter',
    },
    {
      icon: IconBrain,
      value: topName ? topName.split(' ')[0] : '—',
      label: topName ? 'top pattern' : 'no pattern yet',
      small: true,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map((t, i) => (
        <div
          key={i}
          className="card flex flex-col items-center gap-1.5 px-3 py-4 text-center animate-fade-up"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-calm-gradient shadow-soft">
            <t.icon size={18} className="text-white" stroke={2} />
          </div>
          <div
            className={`font-extrabold leading-none text-ink ${t.small ? 'text-base' : 'text-2xl'}`}
          >
            {t.value}
          </div>
          <div className="text-xs font-medium text-ink-muted">{t.label}</div>
        </div>
      ))}
    </div>
  )
}
