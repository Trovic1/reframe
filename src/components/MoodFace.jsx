// A big, full-color mood face drawn as SVG. The expression is driven by a
// continuous `score` from 0 (lowest / heaviest) to 1 (brightest). At the very
// bottom the eyes become little "x"s — the playful, full faces from the design.
//
// Used everywhere a feeling is shown: the mood picker, the heaviness slider,
// the celebration before/after, and as the app mascot.

const PALETTE = [
  { face: '#c4b5fd', ring: '#a78bfa' }, // 0  low  — soft violet
  { face: '#c7b9fb', ring: '#a78bfa' }, // .25
  { face: '#d8cdfb', ring: '#b9a7f7' }, // .5  neutral
  { face: '#bbe3c0', ring: '#86cf97' }, // .75 good — sage
  { face: '#9ad9a6', ring: '#66bf7d' }, // 1   great
]

// Pick a palette stop from a 0..1 score.
function colorFor(score) {
  const i = Math.min(PALETTE.length - 1, Math.max(0, Math.round(score * (PALETTE.length - 1))))
  return PALETTE[i]
}

export default function MoodFace({ score = 0.5, size = 96, className = '', animate = false }) {
  const s = Math.min(1, Math.max(0, score))
  const { face, ring } = colorFor(s)

  // Mouth: interpolate the control-point Y so it morphs frown → flat → smile.
  // curve > 0 => smile (control point below the ends), curve < 0 => frown.
  const curve = (s - 0.5) * 2 // -1 .. 1
  const mouthMidY = 66 - curve * 16 // 82 (deep frown) .. 50 (big smile)
  const mouthPath = `M 34 64 Q 50 ${mouthMidY} 66 64`

  const xEyes = s < 0.12 // the "knocked-out" sad face from the screenshot

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" fill={ring} opacity="0.35" />
      <circle cx="50" cy="50" r="40" fill={face} />

      {/* Cheeks for the happier moods */}
      {s > 0.6 && (
        <g fill="#f9a8c4" opacity={(s - 0.6) * 1.6}>
          <circle cx="33" cy="58" r="5" />
          <circle cx="67" cy="58" r="5" />
        </g>
      )}

      {/* Eyes */}
      <g stroke="#4c1d95" strokeWidth="3.5" strokeLinecap="round" fill="#4c1d95">
        {xEyes ? (
          <>
            <line x1="32" y1="38" x2="40" y2="46" />
            <line x1="40" y1="38" x2="32" y2="46" />
            <line x1="60" y1="38" x2="68" y2="46" />
            <line x1="68" y1="38" x2="60" y2="46" />
          </>
        ) : (
          <>
            <circle cx="36" cy="42" r="4.5" stroke="none" />
            <circle cx="64" cy="42" r="4.5" stroke="none" />
          </>
        )}
      </g>

      {/* Mouth */}
      <path
        d={mouthPath}
        fill="none"
        stroke="#4c1d95"
        strokeWidth="4"
        strokeLinecap="round"
        style={{ transition: animate ? 'd 0.3s ease' : undefined }}
      />
    </svg>
  )
}
