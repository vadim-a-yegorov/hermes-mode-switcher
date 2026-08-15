/**
 * Mode Toggles — Perplexity-style mode selector in the composer.
 *
 * A native SegmentedControl (Auto | Research | Computer) in the composer
 * actions area, next to the send/mic controls. Unlike the old loose-button
 * version that only flipped /personality (invisible, CLI-ish), this also
 * installs composer MIDDLEWARE: when a mode is active, every outgoing
 * message is rewritten to deterministically trigger that mode's behavior
 * at send time — not merely hinted at via a system-prompt overlay.
 *
 *   Auto      → normal chat, pass-through
 *   Research  → deep multi-step web research (deep_research / perplexity_deep_research)
 *   Computer  → OK-Computer multi-worker orchestration
 *
 * The personality flip (slash.exec /personality) is kept as the "sticky"
 * system-prompt reinforcement; the middleware is the guaranteed trigger.
 */
import { COMPOSER_AREAS, SegmentedControl, atom, haptic, host, useValue } from '@hermes/plugin-sdk'
import { jsx } from 'react/jsx-runtime'

const ID = 'mode-toggles'

const MODES = [
  {
    id: 'auto',
    label: 'Auto',
    personality: 'none',
    tip: 'Normal chat — searches the web when needed',
  },
  {
    id: 'research',
    label: 'Research',
    personality: 'research-deep',
    tip: 'Deep multi-step web research before answering',
  },
  {
    id: 'computer',
    label: 'Computer',
    personality: 'computer',
    tip: 'OK-Computer multi-worker orchestration',
  },
]

// One reactive atom holds the active mode id. Default: auto.
const $active = atom('auto')

/** Send-time directive injected by middleware when a mode is active. */
function modeDirective(modeId, originalText) {
  if (modeId === 'research') {
    return (
      `[DEEP RESEARCH] ${originalText}\n\n` +
      `Run deep_research (or perplexity_deep_research) on this topic and deliver ` +
      `a comprehensive cited report. Use perplexity_search for quick follow-up ` +
      `lookups. Never give a shallow answer when depth is required — cite every claim.`
    )
  }
  if (modeId === 'computer') {
    return (
      `[OK-COMPUTER] ${originalText}\n\n` +
      `Operate as OK-Computer: decompose this into workstreams, dispatch parallel ` +
      `workers, verify evidence, and deliver an aggregated result.`
    )
  }
  return originalText
}

function ModeSelector() {
  const active = useValue($active)

  return jsx(SegmentedControl, {
    options: MODES.map(({ id, label }) => ({ id, label })),
    value: active,
    onChange: id => {
      haptic('tap')
      // read imperatively — never from the render closure
      $active.set(id)
      const mode = MODES.find(m => m.id === id)
      const target = mode && mode.personality !== 'none' ? mode.personality : 'none'
      // Sticky system-prompt reinforcement. Best-effort; middleware is the
      // guaranteed trigger regardless of whether this RPC lands.
      host.request('slash.exec', { command: '/personality', args: target }).catch(() => {})
    },
  })
}

export default {
  id: ID,
  name: 'Mode Toggles',
  register(ctx) {
    // restore last mode across reloads
    try {
      const saved = ctx.storage.get('active')
      if (saved && MODES.some(m => m.id === saved)) $active.set(saved)
    } catch {}

    $active.subscribe(v => {
      try {
        v ? ctx.storage.set('active', v) : ctx.storage.remove('active')
      } catch {}
    })

    // Perplexity-style segmented control, inline before the send/mic controls.
    ctx.register({
      id: 'selector',
      area: COMPOSER_AREAS.actions,
      order: 99,
      render: () => jsx(ModeSelector, {}),
    })

    // Middleware: enforce the mode at send time. Runs on every send (typed,
    // queued, voice). Rewrites the draft; never cancels the send.
    ctx.register({
      id: 'enforce',
      area: COMPOSER_AREAS.middleware,
      data: {
        handler: async draft => {
          const mode = $active.get()
          const text = (draft && draft.text) || ''

          if (mode === 'auto' || !text.trim()) {
            return draft
          }

          return { ...draft, text: modeDirective(mode, text) }
        },
      },
    })
  },
}
