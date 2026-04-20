# Makimono — Obsidian Redesign Handoff

## Overview
A full visual overhaul of the Makimono sushi companion app.  
Design direction: **Obsidian** — dark glass, animated gradient orbs, Cormorant Garamond display type, coral + gold accents, count-up stats, staggered entry animations, and glassmorphism cards throughout.

The interactive prototype is at `Makimono Redesign v3.html` in the root of this project.

---

## Fidelity
**High-fidelity.** The prototype matches the intended final appearance precisely.  
Recreate it pixel-for-pixel using the existing Next.js / Tailwind / TypeScript stack.

---

## Files to copy into the repo

| Source (this folder)                           | Destination in repo                              | Action  |
|------------------------------------------------|--------------------------------------------------|---------|
| `app/globals.css`                              | `app/globals.css`                                | Replace |
| `app/page.tsx`                                 | `app/page.tsx`                                   | Replace |
| `components/layout/Sidebar.tsx`                | `components/layout/Sidebar.tsx`                  | Replace |
| `components/layout/AppLayout.tsx`              | `components/layout/AppLayout.tsx`                | Replace |
| `components/layout/MobileNav.tsx`              | `components/layout/MobileNav.tsx`                | Replace |
| `components/shared/GlassCard.tsx`              | `components/shared/GlassCard.tsx`                | **New** |
| `components/shared/BgBlobs.tsx`                | `components/shared/BgBlobs.tsx`                  | **New** |
| `components/shared/StatCard.tsx`               | `components/shared/StatCard.tsx`                 | Replace |
| `components/shared/PageHeader.tsx`             | `components/shared/PageHeader.tsx`               | Replace |
| `lib/hooks/useCountUp.ts`                      | `lib/hooks/useCountUp.ts`                        | **New** |

---

## Design Tokens

All values live in `app/globals.css` as CSS custom properties.

### Color
| Token              | Value (HSL)       | Role                        |
|--------------------|-------------------|-----------------------------|
| `--background`     | `250 35% 9%`      | Page background             |
| `--foreground`     | `40 15% 92%`      | Primary text                |
| `--card`           | `250 28% 13%`     | Solid card surface          |
| `--primary`        | `20 65% 50%`      | Coral — CTA, active states  |
| `--accent`         | `50 58% 70%`      | Gold — ratings, scores      |
| `--muted-foreground`| `40 8% 55%`      | Secondary text              |
| `--border`         | `250 25% 20%`     | Subtle dividers             |
| `--sidebar-bg`     | `250 42% 7%`      | Sidebar background          |

### Glass extras (not in Tailwind — use directly in `style={}`)
| Variable               | Value                            |
|------------------------|----------------------------------|
| `--glass-surface`      | `rgba(255,255,255,0.055)`        |
| `--glass-border`       | `rgba(255,255,255,0.09)`         |
| `--glass-border-hover` | `rgba(255,255,255,0.16)`         |
| `--glow-primary`       | `rgba(204,88,62,0.32)`           |
| `--glow-accent`        | `rgba(196,168,90,0.25)`          |

### Typography
| Role         | Font                              | Size       | Weight |
|--------------|-----------------------------------|------------|--------|
| Display      | Cormorant Garamond                | 48–80px    | 600    |
| Body         | DM Sans                           | 12–15px    | 400–600|
| Labels       | DM Sans, all-caps, letter-spacing | 10px       | 600    |

Import in `globals.css` (already included):
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
```

### Spacing & Radius
- Card padding: `20–48px` depending on card size
- Border radius: `0.75rem` (12px) via `--radius`
- Gap between cards: `14–20px`

---

## Key New Components

### `<GlassCard>` 
```tsx
<GlassCard hover glow className="p-6">...</GlassCard>
```
- `hover` — enables lift + glow on hover (default `true`)
- `glow` — always-on glow state (for hero/featured cards)
- Uses `backdrop-filter: blur(24px)` + `var(--glass-surface)`

### `<BgBlobs>`
```tsx
// In AppLayout, renders three slow-moving radial gradient orbs
<BgBlobs />
```
CSS animations `blob1/2/3` in `globals.css`. No JS.

### `<StatCard>`
```tsx
<StatCard emoji="🌙" label="Evenings" value={23} delay={0} />
```
Wraps `useCountUp` — the number animates from 0 on mount.

### `useCountUp(target, duration?, delay?)`
```ts
const count = useCountUp(23, 1400, 0)   // integer
const count = useCountUp('4.7', 1400, 200) // preserves decimal
```

### `<PageHeader>`
```tsx
<PageHeader
  badge="Ratings"
  title="The"
  titleAccent="Scoreboard"
  subtitle="Optional description"
  action={<button className="btn-gradient">+ Add</button>}
/>
```

---

## CSS Utility Classes (new in globals.css)

| Class               | Effect                                              |
|---------------------|-----------------------------------------------------|
| `.glass-card`       | Frosted glass surface + border                      |
| `.glass-card.hoverable` | Adds lift + glow on hover                       |
| `.glass-card.glow`  | Always-on glow shadow                               |
| `.gradient-text`    | Coral → gold gradient text clip                     |
| `.page-enter`       | Fade-up entrance animation (applied per page)       |
| `.stagger-children` | Children fade up with cascading delays              |
| `.list-stagger`     | Children slide in from left with cascading delays   |
| `.float`            | Slow vertical bob animation (used on logo + emojis) |
| `.btn-gradient`     | Coral gradient button with glow shadow              |
| `.sidebar-link`     | Dark sidebar nav link with hover translate          |
| `.sidebar-link-active` | Gradient active state                            |
| `.badge-easy/medium/hard` | Tinted difficulty badges                    |

---

## Animations (all in globals.css)

| Name        | Duration | Used for                          |
|-------------|----------|-----------------------------------|
| `blob1/2/3` | 16–22s   | Background gradient orbs          |
| `fadeSlide` | 0.5s     | Page + card entry                 |
| `slideRight`| 0.45s    | List item stagger                 |
| `floatBob`  | 6s       | Sushi logo, watermark emoji       |
| `barFill`   | 0.8s     | Rating bars fill from left        |
| `checkPop`  | 0.2s     | Checkbox check icon               |
| `glowBurst` | 0.5s     | Challenge completion              |

---

## Remaining Pages to Implement

The following pages are shown in `Makimono Redesign v3.html` and need to be ported. Use the same `GlassCard` / `PageHeader` / `BgBlobs` primitives — the patterns are consistent.

| Page              | Key visual elements                                                     |
|-------------------|-------------------------------------------------------------------------|
| `roll-generator`  | 4-column style picker, ingredient toggle chips, animated generate btn   |
| `shopping-list`   | Animated checkbox, progress bar, category groups, add-item form         |
| `calculator`      | Two range sliders, 6 result cards with animated numbers                 |
| `ratings`         | 3-up podium, all-ratings list with dual animated bars (Alex vs Sam)     |
| `challenges`      | 2-column grid, difficulty badges, `glowBurst` on complete               |
| `journal`         | Timeline with gradient vertical line, expand/collapse entries           |
| `settings`        | Name inputs, language picker, accent color swatches                     |

---

## Tailwind Config changes needed

Add `fontFamily` and ensure `darkMode` is `'class'`:

```ts
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
    },
    // ... rest unchanged
  }
}
```

---

## Notes
- The app is **dark-only** — `AppLayout` always applies `class="dark"` to `<html>`.  
  If you want to support a light mode later, the design system will need a separate set of CSS variables.
- The `--glass-surface` and `--glow-*` variables are **not** routed through Tailwind — use them via `style={{}}` props or the `.glass-card` CSS class.
- Cormorant Garamond is a web font — ensure it loads before First Contentful Paint by keeping the Google Fonts `@import` at the top of `globals.css`.

---

*Generated from the Makimono Obsidian prototype · April 2026*
