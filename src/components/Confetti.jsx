import { useMemo } from 'react'

// A lightweight, dependency-free confetti burst. Renders a fixed number of
// colored pieces that fall and spin via a CSS keyframe. Purely decorative.

const COLORS = ['#8b5cf6', '#a855f7', '#c4b5fd', '#66bf7d', '#ffc04d', '#f26c43', '#60a5fa']
const COUNT = 80

export default function Confetti() {
  // Build the pieces once on mount. Randomness here is fine (browser runtime).
  const pieces = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 0.8
        const duration = 2.6 + Math.random() * 1.8
        const size = 7 + Math.random() * 7
        const color = COLORS[i % COLORS.length]
        const round = Math.random() > 0.5
        return { left, delay, duration, size, color, round, key: i }
      }),
    []
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.key}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 1.6),
            backgroundColor: p.color,
            borderRadius: p.round ? '9999px' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
