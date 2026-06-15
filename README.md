# 🪶 Reframe

**A calm, AI-guided space to untangle a heavy thought.**

You type the anxious or self-critical thought exactly as it sounds in your head.
Reframe gently names the *cognitive distortions* hiding inside it — the classic
thinking traps from cognitive behavioral therapy (CBT) — and offers a kinder,
truer way to see the same situation. Over time, your saved reframes show how
much lighter your thoughts get.

> Built for the **CS Girlies "Technology for Wellness"** hackathon.

---

## Why it matters

Most anxious thoughts aren't lies — they're *distortions*. "I always mess
everything up" feels true, but it's **all-or-nothing thinking** plus
**overgeneralization** wearing a costume. CBT works by learning to spot the
pattern and answer it with something more accurate and compassionate. Reframe
makes that practice take 30 seconds instead of a therapy homework sheet.

- **AI is the engine, not a gimmick.** A Groq-hosted LLM reads your thought and
  returns a *structured* reframe: a validation, the distortions present, a
  balanced look at the facts, the reframe itself, and a reflection question.
- **It teaches.** Every distortion is a tap-to-expand chip that explains the
  pattern, so you slowly learn to catch them yourself.
- **It's honest and safe.** Reframe says up front it is *not therapy*. If a
  thought contains crisis language, it stops and surfaces real human help
  (988, Crisis Text Line, findahelpline.com) before anything else.
- **It's private.** Everything lives in your browser's `localStorage`. No
  account, no server, nothing leaves your device except the single thought you
  send to the AI.

## How it works

```
Your thought ─▶ crisis check ─▶ Groq LLM (structured JSON) ─▶ reframe screen ─▶ journal
                    │
                    └─▶ crisis? ─▶ show real help first
```

1. **Write** the thought, and (optionally) rate how heavy it feels, 1–5.
2. Reframe checks for crisis language. If found, it pauses and shows support.
3. Otherwise it asks the model for a structured CBT reframe.
4. You read the reframe, then rate how heavy the thought feels *now*. The
   before → after drop is saved so progress is visible.

## Tech

- **React 18 + Vite 6 + Tailwind CSS 3**
- **Groq** chat completions (`llama-3.3-70b-versatile`) in JSON mode for
  reliable structured output
- `@tabler/icons-react`
- `localStorage` for all persistence — no backend

## Run it

```bash
npm install
cp .env.example .env      # then paste your free Groq key into .env
npm run dev
```

Get a free Groq key at <https://console.groq.com/keys>.

**No key?** Reframe still runs — it falls back to a simpler offline heuristic
mode (clearly labelled in the UI) so you can try the flow without one.

```bash
npm run build             # production build
npm run preview           # preview the build
```

## A note on the API key

This is a client-only app, so the Groq key ships in the browser bundle — fine
for a demo or personal use. For anything public, proxy the request through a
small serverless function so the key stays server-side.

## Safety

Reframe is a self-reflection tool, **not** therapy or medical advice. If you are
in crisis or thinking about harming yourself, please reach out to a professional
or call/text **988** (US) or find a helpline at **findahelpline.com**.
