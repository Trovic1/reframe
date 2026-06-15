// The reframing engine. Sends a distressing thought to Groq's OpenAI-compatible
// chat endpoint and asks for a STRUCTURED, warm, CBT-style reframe as JSON:
//
//   {
//     validation: string,          // brief, genuine acknowledgement of the feeling
//     distortions: string[],       // 0-3 cognitive-distortion KEYS from our list
//     evidence: string,            // a gentle, balanced look at the facts
//     reframe: string,             // a kinder, more accurate alternative thought
//     reflection: string           // one short question to sit with
//   }
//
// The key comes from VITE_GROQ_API_KEY. If there is no key, we fall back to a
// small local heuristic so the app still does something useful offline (clearly
// labelled in the UI). Any client-side key is visible in the browser — for
// production, proxy this through a serverless function (see README).

import { DISTORTIONS, resolveDistortion } from './distortions.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

const DISTORTION_KEYS = DISTORTIONS.map((d) => `"${d.key}" (${d.name})`).join(', ')

const SYSTEM_PROMPT = `You are a warm, grounded cognitive behavioral therapy (CBT) coach helping someone reframe a distressing thought. You are NOT a therapist and must never diagnose. Your tone is gentle, human, and non-clinical — like a wise, kind friend who knows CBT.

The user shares a negative or anxious thought. You help them see it more clearly and kindly using CBT.

You must respond with ONLY valid JSON — no prose, no markdown fences — with exactly these fields:
- "validation": string. One or two warm sentences that acknowledge the feeling as real and understandable. Never dismiss it. Do NOT start with "It sounds like".
- "distortions": array of 0-3 strings, each EXACTLY one of these keys: ${DISTORTION_KEYS}. Only include distortions genuinely present in the thought. Use the key, not the name.
- "evidence": string. 1-2 gentle sentences inviting a balanced look at the facts — what's actually known vs. assumed. Pose it softly, not as a lecture.
- "reframe": string. A kinder, more accurate, BELIEVABLE alternative thought written in the user's first person ("I ..."). It should not be toxic positivity — keep it realistic and compassionate.
- "reflection": string. One short, open question for the user to sit with.

Keep every field concise. Write at a calm, accessible reading level. If the thought is already balanced and healthy, gently affirm it and return an empty distortions array.`

export class ReframeError extends Error {}

/** True if a usable Groq key is configured. */
export function hasApiKey() {
  const k = import.meta.env.VITE_GROQ_API_KEY
  return Boolean(k) && k !== 'your_groq_api_key_here'
}

/**
 * Reframe a distressing thought.
 * @param {string} thought
 * @returns {Promise<{validation:string, distortions:string[], evidence:string, reframe:string, reflection:string, offline?:boolean}>}
 */
export async function reframeThought(thought) {
  const text = thought.trim()
  if (!text) throw new ReframeError('Write down the thought first.')

  if (!hasApiKey()) {
    return localReframe(text)
  }

  let res
  try {
    res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        max_tokens: 700,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `The thought:\n"${text}"\n\nReframe it as JSON.` },
        ],
      }),
    })
  } catch {
    throw new ReframeError(
      'Could not reach the AI. Check your connection and try again.'
    )
  }

  if (!res.ok) {
    if (res.status === 401)
      throw new ReframeError('Your Groq API key was rejected. Check VITE_GROQ_API_KEY.')
    if (res.status === 429)
      throw new ReframeError('The AI is busy right now (rate limited). Try again in a moment.')
    throw new ReframeError(`The AI request failed (error ${res.status}). Please try again.`)
  }

  let payload
  try {
    payload = await res.json()
  } catch {
    throw new ReframeError('Got an unexpected response from the AI. Please try again.')
  }

  const content = payload?.choices?.[0]?.message?.content
  if (!content) throw new ReframeError('The AI returned an empty response. Please try again.')

  return parseReframe(content)
}

function parseReframe(content) {
  let data
  try {
    data = JSON.parse(content)
  } catch {
    const match = content.match(/\{[\s\S]*\}/)
    if (!match) throw new ReframeError('The AI response was not valid JSON. Please try again.')
    data = JSON.parse(match[0])
  }

  // Normalise distortion keys against our canonical list, dropping unknowns.
  const distortions = Array.isArray(data.distortions)
    ? [...new Set(
        data.distortions
          .map((d) => resolveDistortion(d)?.key)
          .filter(Boolean)
      )].slice(0, 3)
    : []

  const out = {
    validation: String(data.validation ?? '').trim(),
    distortions,
    evidence: String(data.evidence ?? '').trim(),
    reframe: String(data.reframe ?? '').trim(),
    reflection: String(data.reflection ?? '').trim(),
  }

  if (!out.reframe) {
    throw new ReframeError('The AI did not return a usable reframe. Please try again.')
  }
  return out
}

// ---------------------------------------------------------------------------
// Offline fallback. No AI, just light keyword heuristics so the app is still
// usable without a key. The UI labels these results as offline.

const HEURISTICS = [
  { key: 'all-or-nothing', re: /\b(always|never|everything|nothing|completely|totally|ruined|perfect)\b/i },
  { key: 'overgeneralization', re: /\b(always|never|everyone|no one|nobody|every time)\b/i },
  { key: 'catastrophizing', re: /\b(disaster|terrible|worst|catastrophe|end of the world|can'?t handle)\b/i },
  { key: 'mind-reading', re: /\b(they think|everyone thinks|he thinks|she thinks|judging|hate me)\b/i },
  { key: 'fortune-telling', re: /\b(will fail|going to fail|won'?t work|never going to|bound to)\b/i },
  { key: 'labeling', re: /\bi('?m| am)\s+(a\s+)?(failure|loser|idiot|stupid|worthless|useless|bad)\b/i },
  { key: 'should-statements', re: /\b(should|must|have to|ought to|supposed to)\b/i },
  { key: 'emotional-reasoning', re: /\bi feel (like )?(i'?m|i am|so|such)\b/i },
]

function localReframe(text) {
  const distortions = [...new Set(
    HEURISTICS.filter((h) => h.re.test(text)).map((h) => h.key)
  )].slice(0, 3)

  return {
    offline: true,
    validation:
      'That sounds genuinely heavy, and it makes sense that it weighs on you. Naming it is already a real step.',
    distortions,
    evidence:
      'Try separating what you know for certain from what your mind is assuming. Which parts are facts, and which are fears?',
    reframe:
      'This is one hard moment and a strong feeling — not the whole, fixed truth about me or how things will turn out.',
    reflection:
      'If a close friend told you this exact thought, what would you gently say back to them?',
  }
}
