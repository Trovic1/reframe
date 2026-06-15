import { useEffect } from 'react'
import MoodFace from './MoodFace.jsx'

// The full-screen splash shown briefly between questions (and while the reframe
// is being generated). A floating face, an affirming line, and pulsing rings —
// it gives the flow a sense of depth and pacing for the demo video.
//
// When `loading` is true it stays up until dismissed by the parent (no timer)
// and shows a "thinking" message. Otherwise it auto-advances after `duration`.
export default function StepTransition({ message, faceScore = 0.6, loading = false, duration = 1100, onDone }) {
  useEffect(() => {
    if (loading) return
    const t = setTimeout(() => onDone?.(), duration)
    return () => clearTimeout(t)
  }, [loading, duration, onDone])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-calm-gradient px-8 text-center text-white">
      <div aria-hidden className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-float-slow" />
      <div aria-hidden className="pointer-events-none absolute -right-16 bottom-16 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float" />

      <div className="relative animate-splash-in">
        <span aria-hidden className="absolute inset-0 rounded-full bg-white/30 animate-ring-pulse" />
        <span aria-hidden className="absolute inset-0 rounded-full bg-white/20 animate-ring-pulse" style={{ animationDelay: '0.6s' }} />
        <div className="relative animate-bob">
          <MoodFace score={faceScore} size={140} animate />
        </div>
      </div>

      <p className="relative mt-10 max-w-md whitespace-pre-line text-2xl font-bold leading-snug animate-splash-in lg:text-3xl">
        {message}
      </p>

      {loading && (
        <div className="relative mt-6 flex items-center gap-2" aria-label="Reframing">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 animate-bob rounded-full bg-white/90"
              style={{ animationDelay: `${i * 0.18}s`, animationDuration: '1.1s' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
