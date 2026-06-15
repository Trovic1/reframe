// The guided check-in: a short, adaptive sequence of questions that gathers
// real context before the AI reframe. Steps are data-driven so the flow stays
// easy to tune. Some steps are conditional (rule-based branching) — e.g. the
// "what's driving it" step only appears when the mood is low.
//
// An `answers` object accumulates across the flow:
//   {
//     mood,          // 0..4 index from MoodPicker (null until answered)
//     thought,       // the distressing thought (string)
//     categories,    // string[] of life-area keys
//     drivers,       // string[] (only asked on low mood)
//     heaviness,     // 1..10
//     energy,        // 1..10
//     sleep,         // 0..12 (hours, half-step)
//   }

export const CATEGORIES = [
  { key: 'work', label: 'Work' },
  { key: 'family', label: 'Family' },
  { key: 'friends', label: 'Friends' },
  { key: 'relationship', label: 'Relationship' },
  { key: 'money', label: 'Money' },
  { key: 'health', label: 'Health' },
  { key: 'self', label: 'Myself' },
  { key: 'other', label: 'Other' },
]

export const DRIVERS = [
  { key: 'failure', label: 'Feeling like a failure' },
  { key: 'rejection', label: 'Rejection' },
  { key: 'overwhelm', label: 'Overwhelm' },
  { key: 'comparison', label: 'Comparing myself' },
  { key: 'loneliness', label: 'Loneliness' },
  { key: 'uncertainty', label: 'Uncertainty' },
  { key: 'guilt', label: 'Guilt' },
  { key: 'other', label: 'Something else' },
]

// Each step declares: an id, the kind of input, headline copy, and (optionally)
// a `when(answers)` predicate for branching and a `valid(answers)` gate for the
// Next button. Splash copy is the affirming line shown on the transition out.
export const STEPS = [
  {
    id: 'mood',
    kind: 'mood',
    eyebrow: 'Check-in',
    title: 'How are you feeling\nright now?',
    subtitle: 'There’s no wrong answer. Just notice where you are.',
    splash: 'Thank you for being honest.',
    valid: (a) => a.mood != null,
  },
  {
    id: 'thought',
    kind: 'thought',
    eyebrow: 'The thought',
    // Copy softens when the mood is brighter.
    title: (a) =>
      a.mood != null && a.mood >= 3
        ? 'What’s on your mind?'
        : 'What’s weighing\non you?',
    subtitle: 'Write it exactly as it sounds in your head. No one else sees this.',
    splash: 'It takes courage to name it.',
    valid: (a) => Boolean(a.thought && a.thought.trim()),
  },
  {
    id: 'category',
    kind: 'category',
    eyebrow: 'Journal insight',
    title: 'What does this\ntouch on?',
    subtitle: 'Pick up to three areas this connects to.',
    splash: 'Naming where it lives helps.',
    valid: () => true, // optional
  },
  {
    id: 'drivers',
    kind: 'drivers',
    eyebrow: 'Going deeper',
    title: 'What’s driving\nthe weight?',
    subtitle: 'When it feels heavy, there’s often something underneath.',
    splash: 'You’re looking underneath it. That’s the work.',
    when: (a) => a.mood != null && a.mood <= 1, // only on low moods
    valid: () => true,
  },
  {
    id: 'heaviness',
    kind: 'heaviness',
    eyebrow: 'Intensity',
    title: 'How heavy does it\nfeel, 1 to 10?',
    subtitle: 'We’ll check this again after, so you can see the shift.',
    splash: 'Almost there.',
    valid: () => true,
  },
  {
    id: 'body',
    kind: 'body',
    eyebrow: 'Your week',
    title: 'How’s your energy\nand sleep?',
    subtitle: 'Mind and body travel together. This helps Reframe understand you.',
    splash: 'Let’s look at this together.',
    valid: () => true,
  },
]

/** The steps that actually apply given the current answers. */
export function activeSteps(answers) {
  return STEPS.filter((s) => !s.when || s.when(answers))
}

// Resolve copy that may be a function of the answers.
export function resolve(field, answers) {
  return typeof field === 'function' ? field(answers) : field
}

// Sensible defaults so optional slider steps always have a value.
export const DEFAULT_ANSWERS = {
  mood: null,
  thought: '',
  categories: [],
  drivers: [],
  heaviness: 6,
  energy: 5,
  sleep: 7,
}

const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]))
const DRV_LABEL = Object.fromEntries(DRIVERS.map((d) => [d.key, d.label]))
const MOOD_WORDS = ['awful', 'low', 'okay', 'good', 'great']

/**
 * Turn the gathered answers into a compact, human-readable context block that
 * gets handed to the reframe model so its response can be specific and deep.
 */
export function buildContext(answers) {
  const lines = []
  if (answers.mood != null) lines.push(`Current mood: ${MOOD_WORDS[answers.mood]} (${answers.mood + 1}/5).`)
  if (answers.categories?.length)
    lines.push(`Life areas involved: ${answers.categories.map((k) => CAT_LABEL[k] || k).join(', ')}.`)
  if (answers.drivers?.length)
    lines.push(`What feels underneath it: ${answers.drivers.map((k) => DRV_LABEL[k] || k).join(', ')}.`)
  if (typeof answers.heaviness === 'number')
    lines.push(`They rate the heaviness ${answers.heaviness}/10.`)
  if (typeof answers.energy === 'number') lines.push(`Energy level: ${answers.energy}/10.`)
  if (typeof answers.sleep === 'number') lines.push(`Slept about ${answers.sleep} hours last night.`)
  return lines.join('\n')
}
