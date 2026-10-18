# CLAUDE.md — polyris-app-test

Marketing site + future entry point for the Polyris platform (login, docs).
Read this before writing any code.

---

## Stack (fixed — do not change without discussion)

- **Next.js** (App Router, TypeScript, strict mode)
- **Tailwind CSS** with CSS variables for theming (same token system as `../polyris/ui`)
- **shadcn/ui** for every UI primitive — Button, Input, Card, Dialog, Sheet, etc.
- `clsx` + `tailwind-merge` via a single `cn()` helper
- `lucide-react` for icons
- Node ≥ 20

Future (not now): auth (Cognito, same as polyris console), MDX for docs.

---

## Core principles (adopted from `../polyris/CLAUDE.md`)

1. **No duplication.** `grep` before writing. One source of truth per concept.
2. **Follow existing patterns.** If something is already done one way in this repo
   or in `../polyris/ui`, do it the same way.
3. **Stability first.** Don't break what works. `tsc --noEmit` + `next build`
   - `eslint` must stay green before any commit.
4. **No fix on top of a fix — do it right.** If the solution is unclear, ask first.
5. **Align on architectural decisions.** Routing structure, auth flow, docs
   pipeline, deployment target — explicit approval before implementation.
6. **Finish what you start.** Code + types + lint + build. No half-wired pages.
7. **Asked a question — answer. Asked to do — do.** No jumping to code when
   a question is on the table.
8. **English only** in code, comments, commits, docs.
9. **No stubs or "make it pass" workarounds** in production code. No dummy
   content, no `TODO: wire this later` in shipped routes.
10. **Build must be clean — zero errors, zero warnings.** `tsc`, `eslint`,
    `next build` — all green.
11. **Every fix produces a rule.** After fixing a non-trivial bug, write the
    rule in this file in the same commit.

---

## UI rules — shadcn-first, no custom CSS until forced

**Rule 1 — Use shadcn primitives as-is.**
Every button, input, card, dialog, dropdown, tooltip, badge, etc. comes from
`src/components/ui/*` installed via `npx shadcn@latest add <component>`.
Do not re-implement them. Do not wrap them in a project-specific abstraction
"for consistency" — the shadcn component _is_ the consistency.

**Rule 2 — Style with Tailwind utilities + shadcn tokens, nothing else.**
Allowed: Tailwind classes, `cn()` combinations, shadcn's CSS variables
(`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, …).
Forbidden: hand-rolled color hex values in components, raw `style={{ … }}`
objects for anything a utility class covers, `.module.css` files for one-off
styling.

**Rule 3 — Custom components require explicit permission.**
Before building a new component, check: does shadcn have it? Does a shadcn
primitive compose into it in <20 lines? If yes, use that.

If nothing in shadcn fits, **stop and ask the user before writing code.**
State: (a) what the component needs to do, (b) why no shadcn primitive
(or composition of primitives) works, (c) the proposed approach. Wait for
explicit approval. Do not write custom components speculatively, do not
"draft it first and we'll see" — ask first, build after approval.

This applies to any component that is not a direct shadcn install or a thin
composition of installed shadcn primitives. Marketing section components
(Hero, Features, etc.) that are just layouts of shadcn Card/Button/Badge
do **not** need permission — those are compositions, not custom primitives.

**Rule 4 — Layout = Tailwind flex/grid. Spacing = Tailwind scale.**
No arbitrary pixel values (`w-[137px]`) unless matching a design asset.
Use the scale (`gap-4`, `p-6`, `space-y-8`).

**Rule 5 — Dark mode works out of the box.**
Every page must render correctly in light and dark. Verify by toggling
`class="dark"` on `<html>` before declaring a page done.

---

## Project structure (initial)

```
src/
  app/
    layout.tsx          # root layout, fonts, theme provider
    page.tsx            # landing page
    (marketing)/        # future marketing routes (pricing, about)
    (platform)/         # future: login, dashboard, docs
  components/
    ui/                 # shadcn primitives — do not edit by hand
    marketing/          # landing-specific sections (Hero, Features, CTA)
  lib/
    utils.ts            # cn() and friends
```

Marketing sections (Hero, Features, Pricing, CTA, Footer) are plain
components composing shadcn primitives — not a design system.

---

## Commit / PR hygiene

- One logical change per commit.
- Commit message: imperative, English, ≤72 chars subject line.
- Before any commit: `npm run lint && npm run typecheck && npm run build`.
