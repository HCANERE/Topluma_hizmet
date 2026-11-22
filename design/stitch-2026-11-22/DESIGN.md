---
name: Tıklamadan Önce Düşün
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#005e6e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00788c'
  on-tertiary-container: '#d7f6ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system powers **Tıklamadan Önce Düşün**, a modern cybersecurity and digital literacy education platform. The brand personality is **trustworthy, clear, approachable, and empowering**. Rather than relying on fear-inducing, dark "hacker" tropes, the interface fosters calm confidence and intellectual clarity—helping everyday users, students, and professionals build safer digital habits.

The target audience spans curious beginners, educators, and everyday internet users seeking practical, jargon-free guidance on phishing, privacy, and online safety. The UI should evoke a sense of **safety, transparency, and effortless learning**.

The design style blends **Minimalism** with **Subtle Glassmorphism** and **Corporate / Modern** precision:
- **Generous Whitespace:** Ample breathing room around educational content to reduce cognitive load and improve reading comprehension.
- **Subtle Glassmorphism:** Translucent, frosted navigation bars and floating callouts that maintain context without feeling heavy.
- **Crisp Hierarchy:** Clear typographic contrast and purposeful, restrained use of color to guide attention to interactive lessons, quizzes, and safety alerts.

## Colors

The palette replaces heavy dark-mode aesthetics with a crisp, approachable **light-mode** foundation built for long-form reading and high-trust educational interactions.

- **Primary (`#2563EB` - Electric Blue):** Used for primary actions, active navigation states, key links, and interactive lesson progress. It communicates reliability, clarity, and digital authority.
- **Secondary (`#10B981` - Emerald):** Reserved for positive reinforcement, verified safety indicators, completed modules, and "safe" examples in phishing simulations.
- **Tertiary (`#06B6D4` - Cyan):** Used sparingly for subtle accents, secondary badges, informational highlights, and gentle gradient transitions alongside Electric Blue.
- **Neutral (`#0F172A` - Deep Slate/Indigo):** Anchors all primary typography and high-contrast UI elements. Paired with pure white (`#FFFFFF`) for elevated cards and soft slate (`#F8FAFC` / Slate-50) for page backgrounds to prevent eye strain.

## Typography

The typographic pairing balances **Plus Jakarta Sans** for welcoming, contemporary headlines with **Inter** for neutral, highly legible body copy and UI labels.

- **Headlines (`Plus Jakarta Sans`):** Geometric yet soft and approachable, giving section headers and lesson titles an inviting, human tone. Tight negative letter-spacing (`-0.01em` to `-0.02em`) keeps large display text cohesive.
- **Body & Labels (`Inter`):** Engineered for screen legibility, ensuring that dense cybersecurity concepts, URLs, and quiz instructions remain effortless to scan.
- **Responsive Scaling:** Display and large headline roles (`display-lg`, `headline-lg`) step down on mobile viewports (`display-lg-mobile`, `headline-lg-mobile`) to preserve hierarchy without overwhelming narrow screens.

## Layout & Spacing

The layout uses a **12-column fluid grid** on desktop and tablet, collapsing to a **4-column fluid grid** on mobile. Content is constrained to a comfortable maximum reading width (e.g., `1200px` for dashboards and `720px` for long-form articles) centered within the viewport.

- **Breakpoints:**
  - **Mobile (`< 640px`):** 4 columns, `1rem` (`16px`) outer margins and gutters. Cards stack vertically.
  - **Tablet (`640px – 1024px`):** 8 columns, `1.5rem` (`24px`) margins and gutters. Two-column card grids.
  - **Desktop (`> 1024px`):** 12 columns, `1.5rem` (`24px`) gutters, generous outer margins. Supports side-by-side lesson navigation and content panes.
- **Rhythm:** Generous vertical spacing (`space-xl` and multiples thereof) separates distinct educational modules, ensuring the interface never feels cramped.

## Elevation & Depth

Hierarchy is communicated through a combination of **Tonal Layers**, **Subtle Glassmorphism**, and **Ambient Shadows**:

- **Tonal Layers:** The base canvas uses soft Slate-50 (`#F8FAFC`), while primary content cards sit on pure white (`#FFFFFF`), creating natural separation without heavy borders.
- **Low-Contrast Outlines:** Cards and containers use crisp, `1px` ghost borders (`rgba(15, 23, 42, 0.08)`) to define edges cleanly on light backgrounds.
- **Ambient Shadows:** Interactive cards and floating elements use extra-diffused, low-opacity shadows tinted with deep slate (`0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 4px 10px -6px rgba(15, 23, 42, 0.03)`).
- **Glassmorphism:** Sticky top navigation bars and floating quick-tip overlays use `rgba(255, 255, 255, 0.8)` with a `12px` backdrop blur (`backdrop-filter: blur(12px)`) and a subtle bottom border.

## Shapes

The design system uses a **Rounded (`2`)** shape language (`0.5rem` / `8px` base radius, `1rem` / `16px` for large cards, `1.5rem` / `24px` for hero containers). This strikes a balance between modern geometric precision and approachable friendliness, avoiding both harsh sharp corners and overly playful pill shapes for structural containers.

## Components

- **Navigation Bar:** Refined, minimalist sticky header with subtle glassmorphism (`backdrop-blur-md`, `80%` white opacity). Contains clear, spaced links, a subtle search trigger, and a primary CTA button.
- **Buttons:**
  - *Primary:* Solid Electric Blue (`#2563EB`) with white `label-lg` text, `0.5rem` radius, and a subtle hover lift.
  - *Secondary:* Soft Slate-100 background with Slate-900 text, or ghost-bordered white.
  - *Semantic:* Emerald (`#10B981`) for "Verify / Complete" actions.
- **Cards:** Pure white (`#FFFFFF`) surface, `1rem` (`16px`) border radius, `1px` low-contrast slate border, and generous `space-lg` (`1.5rem`) internal padding. Used for lesson modules, phishing case studies, and resource previews.
- **Chips & Badges:** Pill-shaped (`9999px` radius) with `label-md` typography. Used for topic tags (e.g., "Phishing", "2FA", "Privacy") using soft tinted backgrounds (e.g., `10%` opacity Electric Blue or Cyan with full-opacity text).
- **Lists:** Clean vertical stacks with `space-md` (`1rem`) gaps, subtle dividers, and leading icons (e.g., shield, check-circle) to aid scannability in safety checklists.
- **Input Fields:** `0.5rem` radius, `1px` slate border, pure white background, and a clear `2px` Electric Blue focus ring (`rgba(37, 99, 235, 0.25)`).
- **Checkboxes & Radio Buttons:** `0.25rem` radius for checkboxes, full circle for radios, transitioning to solid Electric Blue with crisp white checkmarks when selected.
- **Interactive Security Callouts:** Specialized educational blocks (e.g., "Red Flag" vs. "Safe Practice") using subtle tinted backgrounds (Emerald for safe, Amber/Red for warnings) with a `4px` left accent border.