// localStorage persistence. The whole app state lives under one key so we can
// load/save atomically. Shape:
// {
//   onboarded: boolean,
//   entries: [{
//     id, createdAt,
//     thought,                 // the original distressing thought
//     heavyBefore,             // 1-5, how heavy it felt before (optional)
//     heavyAfter,              // 1-5, how heavy after the reframe (optional)
//     validation, evidence, reframe, reflection,
//     distortions: string[],   // canonical distortion keys
//     offline: boolean         // produced without the AI?
//   }]
// }

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
