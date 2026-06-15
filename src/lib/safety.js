// Safety layer. Reframe is a self-help journaling tool, NOT a substitute for
// professional care. If a thought contains language suggesting a crisis or risk
// of self-harm, we stop the normal reframing flow and surface real help first.
//
// This is deliberately high-recall (better to show resources when not strictly
// needed than to miss someone). Matching is word-boundary aware to avoid silly
// false positives like "I killed it at work".

const CRISIS_PATTERNS = [
  /\bkill(?:ing)?\s+myself\b/,
  /\bend(?:ing)?\s+(?:my|it all|my life)\b/,
  /\bsuicid/,
  /\btake\s+my\s+(?:own\s+)?life\b/,
  /\bwant\s+to\s+die\b/,
  /\bdon'?t\s+want\s+to\s+(?:be\s+here|live|exist)\b/,
  /\bbetter\s+off\s+(?:dead|without\s+me)\b/,
  /\bharm(?:ing)?\s+myself\b/,
  /\bhurt(?:ing)?\s+myself\b/,
  /\bself[-\s]?harm\b/,
  /\bno\s+reason\s+to\s+live\b/,
  /\bcan'?t\s+go\s+on\b/,
]

/** Does this text suggest a possible crisis? */
export function detectCrisis(text) {
  if (!text) return false
  const t = String(text).toLowerCase()
  return CRISIS_PATTERNS.some((re) => re.test(t))
}

// Crisis resources shown in the safety banner. US-first with an international
// pointer, since the audience is global.
export const CRISIS_RESOURCES = [
  {
    region: 'US',
    name: '988 Suicide & Crisis Lifeline',
    contact: 'Call or text 988',
    href: 'tel:988',
  },
  {
    region: 'US',
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    href: 'sms:741741?&body=HOME',
  },
  {
    region: 'Global',
    name: 'Find a helpline near you',
    contact: 'findahelpline.com',
    href: 'https://findahelpline.com',
  },
]

export const SAFETY_DISCLAIMER =
  'Reframe is a self-reflection tool, not therapy or medical advice. If you are in crisis or thinking about harming yourself, please reach out to a professional or one of the resources above.'
