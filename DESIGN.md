# Sofitel Residences Downtown Dubai

## Overview

**Product:** Sofitel Residences Downtown Dubai
**URL:** https://projects.remdubai.com/sofitel-downtown/?gad_source=1&gad_campaignid=24253720235&gbraid=0AAAABEo9SzhjP7iD3qDSlzlp_07rj99un&gclid=Cj0KCQjwlNPVBhCMARIsAPZ5RqhsL6bYY4fG7cYGotBKsq_VaYdb2dB_qw8bjbFA97rnxskdT6NeR4UaAgZrEALw_wcB
**Surface type:** marketing
**Audience:** Business decision-makers and potential customers
**Brand character:** Conversion-focused marketing presence with a rich, diverse color palette and 3 typefaces.

### Design Principles

- Consistency over novelty — reuse existing patterns before inventing new ones.
- Token-driven — every visual decision references a token, not a magic number.
- Accessible by default — compliance is a baseline, not a feature.

## Colors

| Token | Value | Role |
|-------|-------|------|
| color-1 | `#1B1916` | Text Primary |
| color-2 | `#C6A668` | Text Light |
| color-3 | `#EFE9DB` | Text Light |
| color-4 | `#F6F2E9` | Text Light |

## Typography

**Font stack:** Cormorant Garamond, Manrope, Times New Roman

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 13px | Captions, metadata |
| text-sm | 15px | Labels, secondary text |
| text-base | 16px | Body text (default) |
| text-lg | 18px | Subheadings, emphasis |
| text-xl | 24px | Section headings |
| text-2xl | 32px | Section headings |
| text-3xl | 34px | Section headings |
| text-4xl | 74px | Section headings |

**Weight scale:** 400 · 500 · 600 · 700
**Line heights:** 76.96px · 37.2px · 19.375px · 27.9px · 25.575px · 23.25px · 20.15px · 24.8px · 20.925px · 22.475px · 52.7px · 49.6px

## Spacing

**Base unit:** 4px

`space-1: 4px` · `space-2: 10px` · `space-3: 13px` · `space-4: 14px` · `space-5: 15px` · `space-6: 16px` · `space-7: 18px` · `space-8: 20px` · `space-9: 22px` · `space-10: 28px` · `space-11: 30px` · `space-12: 34px` · `space-13: 40px` · `space-14: 52px` · `space-15: 70px` · `space-16: 75px` · `space-17: 78px` · `space-18: 108px` · `space-19: 170px`

## Shapes

**Border radius:** _None detected._

## Elevation

_None detected._

## Motion

- **duration-fast:** `all`
- **duration-fast:** `none`
- **duration-base:** `opacity 0.2s`
- **duration-base:** `background 0.25s, transform 0.25s`
- **duration-base:** `background 0.3s, padding 0.3s, border-color 0.3s`

## Components

- **Buttons:** 13 detected
- **Links:** 15 detected
- **Inputs:** 6 detected
- **Navigation:** 2 elements
- **Lists:** 2 detected
- **Forms:** 1 detected
- **Images:** 14 detected

## Do's and Don'ts

### Do

- Reference tokens by name, not raw values — agents and developers should use `color.text.primary`, not `#171717`.
- Define all interactive states: default, hover, focus-visible, active, disabled.
- Use the spacing scale for all padding, margin, and gap values.
- Write content in sentence case. Reserve ALL CAPS for acronyms only.
- Test every component at the smallest and largest breakpoint before shipping.

### Don't

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not use full-uppercase text for body or paragraph content.
- Do not nest interactive elements (e.g. buttons inside links).
- Do not ship components without defining hover, focus-visible, and disabled states.

## Writing Tone

Concise, confident, implementation-focused. Avoid filler preambles.

## Authoring Workflow

When creating or updating a component guideline for this system, follow this sequence:

1. **State the intent** — one sentence on what the component does and why it exists.
2. **Map tokens** — list every color, spacing, typography, and radius token the component uses. No raw values.
3. **Define anatomy** — break the component into named parts (container, label, icon, etc.) with their token assignments.
4. **Specify states** — document every state: default, hover, focus-visible, active, disabled, loading, error, empty.
5. **Describe interactions** — keyboard, pointer, and touch behavior, including edge cases (long content, overflow, truncation).
6. **Add accessibility criteria** — write testable pass/fail checks (e.g. "focus ring must be visible at 3:1 contrast").
7. **List anti-patterns** — concrete examples of misuse with a brief explanation of why each is wrong.
8. **Close with a QA checklist** — a mechanical list of verifiable items (see Definition of Done below).

## Required Output Structure

Every component guideline produced from this system must contain these sections, in order:

1. Overview — purpose, when to use, when not to use.
2. Tokens and foundations — all referenced tokens from the tables above.
3. Anatomy and variants — named parts, variant matrix, responsive behavior.
4. States and interactions — full state table, keyboard/pointer/touch behavior.
5. Accessibility — ARIA attributes, contrast requirements, focus management, screen reader behavior.
6. Content guidelines — copy length, tone, capitalisation, placeholder text rules.
7. Anti-patterns — explicit examples of what not to build, with reasoning.

## Component Requirements

Every component built against this system must:

- Reference only tokens defined in the tables above — no hardcoded hex, px, or font values.
- Define all interactive states: default, hover, focus-visible, active, disabled, loading, error.
- Specify responsive behavior at the smallest and largest supported breakpoint.
- Handle edge cases: empty state, overflow / truncation, maximum content length.
- Include keyboard navigation (Tab, Enter, Escape, Arrow keys where applicable).
- Document ARIA roles, labels, and live-region behavior where relevant.
- Include known page component density: - **Buttons:** 13 detected
- **Links:** 15 detected
- **Inputs:** 6 detected
- **Navigation:** 2 elements
- **Lists:** 2 detected
- **Forms:** 1 detected
- **Images:** 14 detected

## Definition of Done

A component is not complete until every item below is checked:

- Renders correctly in its default state (smoke test).
- All states documented and visually verified (hover, focus, disabled, loading, error, empty).
- All visual values use design tokens — zero hardcoded values.
- Keyboard navigation works without a pointer.
- No critical accessibility violations (contrast, ARIA, focus order).
- Tested at smallest and largest breakpoint.
- Anti-patterns section lists at least one concrete misuse example.
- Documentation covers purpose, usage, props/API, and limitations.
