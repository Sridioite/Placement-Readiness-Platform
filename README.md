# KodNest Premium Build System

A calm, intentional design system for serious B2C product companies.

## Design Philosophy

Calm. Intentional. Coherent. Confident.

This is not a flashy startup. This is not a hackathon project. This is a professional product design system built for clarity and purpose.

## Color System

- **Background**: `#F7F6F3` (off-white)
- **Primary Text**: `#111111`
- **Accent**: `#8B0000` (deep red)
- **Success**: `#4A6741` (muted green)
- **Warning**: `#B8860B` (muted amber)

Maximum 4 colors across the entire system.

## Typography

- **Headings**: Crimson Pro (serif), large, confident, generous spacing
- **Body**: Inter (sans-serif), 16px, line-height 1.7, max-width 720px
- No decorative fonts. No random sizes.

## Spacing System

Consistent scale only:
- `8px` (xs)
- `16px` (sm)
- `24px` (md)
- `40px` (lg)
- `64px` (xl)

Never use random spacing like 13px or 27px. Whitespace is part of the design.

## Global Layout Structure

Every page follows this structure:

```
[Top Bar]
↓
[Context Header]
↓
[Primary Workspace (70%) + Secondary Panel (30%)]
↓
[Proof Footer]
```

### Top Bar
- Left: Project name
- Center: Progress indicator (Step X / Y)
- Right: Status badge (Not Started / In Progress / Shipped)

### Context Header
- Large serif headline
- One-line subtext
- Clear purpose, no hype language

### Primary Workspace (70%)
- Main product interaction area
- Clean cards, predictable components
- No crowding

### Secondary Panel (30%)
- Step explanation (short)
- Copyable prompt box
- Action buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot
- Calm styling

### Proof Footer
Persistent bottom section with checklist:
- □ UI Built
- □ Logic Working
- □ Test Passed
- □ Deployed

Each checkbox requires user proof input.

## Component Rules

- **Primary button**: Solid deep red
- **Secondary button**: Outlined
- Same hover effect and border radius everywhere
- **Inputs**: Clean borders, no heavy shadows, clear focus state
- **Cards**: Subtle border, no drop shadows, balanced padding

## Interaction Rules

- **Transitions**: 150–200ms, ease-in-out
- No bounce, no parallax

## Error & Empty States

- **Errors**: Explain what went wrong + how to fix. Never blame the user.
- **Empty states**: Provide next action. Never feel dead.

## Implementation

Open `index.html` to see the design system in action.

All styles are in `design-system.css`.

Everything must feel like one mind designed it. No visual drift.
