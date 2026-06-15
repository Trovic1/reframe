// A 1–10 range slider with a gradient-filled track, low/high labels, and the
// current value shown as a pill — the "How active are you?" / "How long did you
// sleep?" sliders from the design. Generic enough for heaviness, energy, sleep.

export default function ScaleSlider({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  lowLabel = 'Low',
  highLabel = 'High',
  valueLabel, // optional fn(value) => string shown in the pill
}) {
  const v = value ?? Math.round((min + max) / 2)
  const pct = ((v - min) / (max - min)) * 100

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-muted">{lowLabel}</span>
        <span className="rounded-full bg-calm-gradient px-3 py-1 text-sm font-bold text-white shadow-soft">
          {valueLabel ? valueLabel(v) : v}
        </span>
        <span className="text-sm font-semibold text-ink-muted">{highLabel}</span>
      </div>

      <div className="relative h-9 select-none">
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-indigo-100" />
        {/* Fill */}
        <div
          className="absolute left-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-calm-gradient"
          style={{ width: `calc(${pct}% )` }}
        />
        {/* Thumb */}
        <div
          className="pointer-events-none absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-violet-500 shadow-glow"
          style={{ left: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={v}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-valuetext={valueLabel ? valueLabel(v) : String(v)}
        />
      </div>
    </div>
  )
}
