// The ten classic cognitive distortions from CBT (Burns / Beck). Used to teach
// the user and to give the AI a fixed, well-known vocabulary to label thoughts
// with. `key` is what the model is told to return; `name` and `blurb` are shown
// in the UI.

export const DISTORTIONS = [
  {
    key: 'all-or-nothing',
    name: 'All-or-nothing thinking',
    blurb: 'Seeing things in black-and-white — anything less than perfect is a total failure.',
  },
  {
    key: 'overgeneralization',
    name: 'Overgeneralization',
    blurb: 'Treating one bad event as a never-ending pattern ("always", "never").',
  },
  {
    key: 'mental-filter',
    name: 'Mental filter',
    blurb: 'Dwelling on a single negative detail until your whole view darkens.',
  },
  {
    key: 'discounting-positives',
    name: 'Discounting the positive',
    blurb: 'Insisting your wins "don\'t count", so the good never lands.',
  },
  {
    key: 'mind-reading',
    name: 'Mind reading',
    blurb: 'Assuming you know others are judging you, without real evidence.',
  },
  {
    key: 'fortune-telling',
    name: 'Fortune telling',
    blurb: 'Predicting things will turn out badly as if it were already fact.',
  },
  {
    key: 'catastrophizing',
    name: 'Catastrophizing',
    blurb: 'Blowing things up into the worst imaginable outcome.',
  },
  {
    key: 'emotional-reasoning',
    name: 'Emotional reasoning',
    blurb: 'Believing something is true because it *feels* true ("I feel useless, so I am").',
  },
  {
    key: 'should-statements',
    name: 'Should statements',
    blurb: 'Beating yourself up with rigid "shoulds", "musts" and "oughts".',
  },
  {
    key: 'labeling',
    name: 'Labeling',
    blurb: 'Turning a mistake into a global label about who you are ("I\'m a failure").',
  },
  {
    key: 'personalization',
    name: 'Personalization',
    blurb: 'Blaming yourself for things that weren\'t entirely in your control.',
  },
]

const BY_KEY = new Map(DISTORTIONS.map((d) => [d.key, d]))

// Resolve a distortion the AI named back to our canonical entry. Tolerant of
// the model returning a slightly different key, the display name, or spaces
// instead of dashes.
export function resolveDistortion(raw) {
  if (!raw) return null
  const norm = String(raw).trim().toLowerCase().replace(/\s+/g, '-')
  if (BY_KEY.has(norm)) return BY_KEY.get(norm)
  // Fall back to a loose name/substring match.
  return (
    DISTORTIONS.find(
      (d) => d.name.toLowerCase() === String(raw).trim().toLowerCase()
    ) ||
    DISTORTIONS.find(
      (d) => norm.includes(d.key) || d.key.includes(norm)
    ) ||
    null
  )
}
