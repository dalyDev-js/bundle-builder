# Bundle Builder

A multi-step **bundle builder** with a live review panel, built as a React 19
prototype. The shopper assembles a home-security system through a 4-step
accordion on the left while a "Your security system" summary on the right
updates in real time — variant-aware quantities, in-sync steppers, live totals,
and client-side persistence.

---

## Quick start

Requires **Node 20.19+ or Node 22.12+** and npm.

```bash
npm install

# Recommended: run the app + the catalog API together (one command)
npm run dev:all      # web → http://localhost:5173 , api → http://localhost:3001
```

Then open **http://localhost:5173**.

Don't want the API process? Just run the web app — it falls back to the bundled
catalog automatically:

```bash
npm run dev
```

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server only (API optional — falls back to bundled JSON) |
| `npm run server` | The Express catalog API only (`tsx watch`) |
| `npm run dev:all` | Web + API together via `concurrently` |
| `npm run build` | Type-check (`tsc -b`) and production build |
| `npm run preview` | Preview the production build |
| `npm run test` / `npm run test:run` | Vitest (watch / once) |
| `npm run lint` | ESLint |

Builds and runs from a clean clone: `npm install && npm run dev:all`.

---

## Tech stack

- **React 19 + TypeScript** on **Vite 8**, with the **React Compiler** enabled
  (so there's no manual `useMemo`/`useCallback` — memoization is automatic).
- **Zustand** for state.
- **CSS Modules + design tokens** (`src/styles/tokens.css`) — no UI framework.
- **Express + tsx** for the optional catalog API (the brief's bonus).
- **Vitest + React Testing Library** for tests.

---

## How it works

**Data-driven.** Everything renders from `src/data/catalog.json` (steps,
products, variants, config, and the seeded selection). There is no per-product
markup — one `ProductCard` renders every product.

**State (`src/store/`).** A Zustand store holds:

- `lines: Record<lineKey, qty>` where `lineKey` is `productId:variantId` (or
  just `productId` for products without variants). This is what makes each
  variant track its own quantity.
- `activeVariant: Record<productId, variantId>` — the card's stepper binds to
  the active variant's line.
- `openStepId` — the accordion (one step open at a time).

Derived data (per-step "N selected" counts, the grouped review lines, and the
totals) lives in pure functions in `src/store/selectors.ts` and
`src/lib/pricing.ts`, so it's trivially testable and never stored redundantly.

**The shared stepper keeps things in sync.** The same `QuantityStepper`
component appears on product cards and on review lines; both read and write the
same store line, so changing one updates the other and the totals instantly.

**Persistence.** "Save my system for later" writes a snapshot
(`{ lines, activeVariant }`) to `localStorage`; on load the store hydrates from
it if present, otherwise it applies the seed. Saved lines are sanitized against
the current catalog so stale data can't break the UI.

**API + graceful fallback.** `src/data/catalogClient.ts` does
`fetch('/api/catalog')` (Vite proxies `/api` → the Express server) and falls
back to the bundled JSON on any failure. The server serves the *same*
`catalog.json` the client bundles, so there's a single source of truth.

---

## Project structure

```
server/index.ts            Express catalog API (bonus)
src/
  data/      catalog.json (source of truth) + catalogClient (loader + fallback)
  store/     bundleStore (Zustand), selectors, persistence
  lib/       types, pricing, lines (lineKey helpers), format
  hooks/     useCatalog (load + seed/hydrate)
  components/
    ui/      Button, QuantityStepper, PriceTag, Badge, Icon, ProductImage
    builder/ BundleBuilder, Accordion/AccordionStep, ProductCard/VariantSelector
    review/  ReviewPanel, ReviewLine/PlanLine, SummaryFooter
  styles/    tokens.css, globals.css
  test/      pricing, variant-quantity, QuantityStepper
```

---

## Decisions & tradeoffs

**Pricing was reconciled into one coherent model.** The Figma's product *cards*
and *review panel* disagree on Wyze Cam Pan v3 (the card reads `$34.98`, the
review line reads `$47.98` for qty 2). Static mocks aren't computed, so I
reverse-engineered unit prices that make the design's **headline numbers exact**
and keep card ↔ review ↔ total internally consistent:

- Total **$187.89**, pre-discount **$238.81**, savings **$50.92** — all derived
  live and verified in `src/test/pricing.test.ts`.
- The Pan v3 card therefore reads `$28.99 → $23.99` (its true unit price) rather
  than the mock's contradictory `$34.98`. Matching the documented grand total
  beats matching a number the mock disagrees with itself on.
- Money is summed in integer cents to avoid floating-point drift.
- **Badges** ("Save 22%") are content strings, not computed — the mock's
  percentages don't match the price deltas, and real promotions rarely do.

**Explicit save, not auto-persist.** I used Zustand but deliberately *not* its
`persist` middleware. The brief's "Save my system for later" is an explicit
action ("configure → save → leave → return"), so save happens on click and the
app hydrates on load. Auto-persisting every keystroke would make the link
meaningless. (Swapping in the `persist` middleware later is a few lines.)

**API is a bonus, kept low-risk.** It's a real Express server, but the client
never depends on it being up — the fallback means a clean clone always loads,
even with `npm run dev` alone or `vite preview`. Persistence stays client-side
per the brief; the API only serves catalog data.

**Steps 2–4 are extrapolated.** Only Step 1 (cameras) is in the Figma. The
plan, sensors, and accessories steps reuse the Step-1 card pattern and are
seeded to match the review panel. The **plan step is single-select** (pick one;
no quantity), which mirrors the review's stepper-less plan line.

**Responsive layout follows the supplied Figma frames.** Medium desktop uses the
builder/review two-column composition from Frame 1735. At 1440px and above, the
builder spans the page and the review becomes the full-width two-column panel
shown in Frame 1736. Camera cards use the vertical desktop composition while
the other steps retain the horizontal card pattern.

**Financing is an approximation.** "as low as $19.19/mo" doesn't divide cleanly
from any subtotal (it's an Affirm-style APR figure). It's computed live as
`total × monthlyFactor`, with the factor calibrated so the seeded system shows
`$19.19`. In production this would come from a financing provider.

**Variant chip highlight** is intentionally light — the brief said to focus on
the selection/quantity behavior over chip styling.

---

## Accessibility

Accordion headers are real buttons with `aria-expanded` / `aria-controls`;
panels are labelled regions. Steppers are buttons with `aria-label`s and proper
disabled states; variant chips are an ARIA `radiogroup`; compare-at prices use
`<s>` with an accessible "Was …" label; the checkout confirmation is a labelled
`role="dialog"` that closes on Escape; focus styles are visible throughout.

## Testing

Focused tests (16) covering the highest-value logic:

- `pricing.test.ts` — the seed reconciles to $187.89 / $238.81 / $50.92 and
  recalculates on quantity changes.
- `store.variant-quantity.test.ts` — variants track independently, every
  variant > 0 is its own review line, distinct-product counts, required-item
  locking, single-select plan, and decrement clamping.
- `QuantityStepper.test.tsx` — increment/decrement callbacks and disabled states.
- `ReviewLine.test.tsx` — selected variants always expose their label and
  variant-specific thumbnail in the review.
- `persistence.test.ts` — explicit saves restore quantities and active variants,
  and storage failures are reported accurately.

## Assets (images & palette)

- **Product images:** drop PNGs in `public/images/` — see
  [`public/images/README.md`](public/images/README.md) for the exact filenames.
  Missing images degrade gracefully to a placeholder.
- **Color palette:** shared brand and surface colors live in
  `src/styles/tokens.css`; a small number of Figma-specific component colors
  remain scoped in their CSS Modules.
- **Fonts:** Inter + Poppins via Google Fonts (linked in `index.html`).

## Possible next steps

Keyboard arrow-key navigation within variant chips, a "reset to default" /
clear-system affordance (the store already exposes `resetToSeed`), persisting
the open accordion step, image `srcset`, and a coverage report.
# bundle-builder
