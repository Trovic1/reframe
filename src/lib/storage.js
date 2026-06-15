// localStorage persistence. The whole app state lives under one key so we can
// load/save atomically. Shape:
// {
//   onboarded: boolean,
//   entries: [{
//     id, createdAt,
//     thought,                 // the original distressing thought
//     mood,                    // 0-4 mood index at check-in (optional)
//     categories,              // string[] life-area keys (optional)
//     drivers,                 // string[] what's underneath it (optional)
//     energy,                  // 1-10 energy (optional)
//     sleep,                   // hours slept (optional)
//     heavyBefore,             // 1-10, how heavy it felt before (optional)
//     heavyAfter,              // 1-10, how heavy after the reframe (optional)
//     validation, evidence, reframe, reflection, encouragement,
//     distortions: string[],   // canonical distortion keys
//     offline: boolean         // produced without the AI?
//   }]
// }
//
// Older entries (heavyBefore/After on a 1-5 scale, no mood/categories) still
// load and render fine — every new field is optional.

const STORAGE_KEY = 'reframe.v1'

const EMPTY_STATE = {
  onboarded: false,
  entries: [],
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY_STATE }
    const parsed = JSON.parse(raw)
    return {
      ...EMPTY_STATE,
      ...parsed,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
    }
  } catch (err) {
    console.warn('Reframe: failed to load state, starting fresh.', err)
    return { ...EMPTY_STATE }
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.warn('Reframe: failed to save state.', err)
  }
}

// Small unique-id helper that doesn't depend on crypto being present.
export function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
