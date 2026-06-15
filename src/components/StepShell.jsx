import { IconChevronLeft, IconX } from '@tabler/icons-react'
import MoodFace from './MoodFace.jsx'

// The responsive frame every check-in question lives in.
//
//  • Desktop: a full-bleed two-panel layout — a gradient "hero" panel on the
//    left (mascot face, eyebrow, big title, progress) and the interactive
//    content on the right.
//  • Phone: a single stacked column — a compact header with the face + title,
//    then the content, then the nav buttons pinned to the bottom.
//
// `faceScore` drives the mascot expression so the panel reflects the mood.
export default function StepShell({
  eyebrow,
  title,
  subtitle,
  faceScore = 0.5,
  step,
  total,
  canBack,
  canNext,
  nextLabel = 'Continue',
  onBack,
  onNext,
  onExit,
  children,
}) {
  const progress = total > 0 ? ((step + 1) / total) * 100 : 0

  return (
    <div className="flex min-h-[100dvh] flex-col lg:flex-row">
      {/* ---- Hero panel (gradient) ---- */}
      <section className="relative flex shrink-0 flex-col overflow-hidden bg-calm-gradient px-6 pb-8 pt-6 text-white lg:w-[42%] lg:px-12 lg:pt-12">
        {/* floating blobs */}
        <div aria-hidden className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-white/15 blur-3xl animate-float-slow" />
        <div aria-hidden className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-3xl animate-float" />

        {/* top row: back + progress */}
        <div className="relative flex items-center gap-3">
          <button
            type="button"
            onClick={canBack ? onBack : onExit}
            aria-label={canBack ? 'Previous question' : 'Exit check-in'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur transition hover:bg-white/30 active:scale-95"
          >
            {canBack ? <IconChevronLeft size={22} /> : <IconX size={20} />}
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-bold tabular-nums text-white/90">
            {step + 1}/{total}
          </span>
        </div>

        {/* mascot + title */}
        <div className="relative mt-8 flex flex-1 flex-col items-center justify-center text-center lg:items-start lg:text-left">
          <div className="animate-bob">
            <MoodFace score={faceScore} size={132} animate />
          </div>
          {eyebrow && (
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-white/75">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 whitespace-pre-line text-4xl font-bold leading-[1.05] lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/85">{subtitle}</p>
          )}
        </div>
      </section>

      {/* ---- Content panel ---- */}
      <section className="flex flex-1 flex-col px-6 py-8 lg:px-14 lg:py-12">
        <div key={step} className="mx-auto flex w-full max-w-xl flex-1 flex-col animate-step-in">
          <div className="flex flex-1 flex-col justify-center">{children}</div>

          {/* Nav */}
          <div className="mt-8 flex items-center gap-3">
            {canBack && (
              <button type="button" onClick={onBack} className="btn-ghost px-6 py-4 text-base">
                <IconChevronLeft size={20} />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              disabled={!canNext}
              className="btn-primary flex-1 py-4 text-lg"
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
