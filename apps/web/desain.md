---
name: Bandung Electric
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#3F4A3E'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#6f7a6d'
  outline-variant: '#becabb'
  surface-tint: '#006e2d'
  primary: '#005e26'
  on-primary: '#ffffff'
  primary-container: '#007a33'
  on-primary-container: '#a1ffad'
  inverse-primary: '#77dc88'
  secondary: '#745b00'
  on-secondary: '#ffffff'
  secondary-container: '#fecb00'
  on-secondary-container: '#6e5700'
  tertiary: '#0050a2'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e68c5'
  on-tertiary-container: '#e2eaff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#93f9a2'
  primary-fixed-dim: '#77dc88'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#ffe08b'
  secondary-fixed-dim: '#f1c100'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#d7e3ff'
  tertiary-fixed-dim: '#aac7ff'
  on-tertiary-fixed: '#001b3e'
  on-tertiary-fixed-variant: '#00458e'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  surface-bg: '#F8F9FC'
  glass-border: rgba(255, 255, 255, 0.6)
  glass-bg: rgba(255, 255, 255, 0.85)
  scrim-green: rgba(0, 122, 51, 0.4)
  scrim-yellow: rgba(255, 204, 0, 0.3)
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 80px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
  headline-md:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-sm:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 32px
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Outfit
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  section-gap-md: 64px
  section-gap-lg: 100px
---

## Brand & Style

The brand personality is energetic, youthful, and culturally vibrant, capturing the "electric pulse" of Bandung. It targets modern travelers and locals looking for curated, hype experiences rather than traditional sightseeing. 

The design style is a **sophisticated mix of Glassmorphism and Bold High-Contrast**. It utilizes frosted glass panels for interactive elements, vibrant background "blob" blurs for organic depth, and a strong, high-contrast color palette that balances deep greens with electric yellows. The aesthetic feels like a premium digital magazine crossed with a dynamic social discovery app—clean and professional, yet pulsing with raw energy and movement through subtle animations and asymmetrical layouts.

## Colors

The palette is rooted in the "Bandung Vibe" colors:
- **Bandung Green (Primary):** Representing the city's lush landscape and creative energy. Used for primary calls to action and branding.
- **Bandung Yellow (Secondary):** An electric, energetic accent used for highlighting "trending" items, ratings, and secondary interactive elements.
- **Bandung Blue (Tertiary):** Used sparingly for specialized categories (e.g., #CoffeeCulture) to add depth to the visual rhythm.
- **Bandung Black (Neutral):** A deep, off-black used for high-contrast typography and "heavy" UI elements like buttons and footers.

The background uses a slightly cool off-white (`#F8F9FC`) to allow the glass effects and vibrant blurs to pop without feeling clinical.

## Typography

The system exclusively uses **Outfit** to maintain a modern, geometric, yet friendly appearance. 
- **Headlines:** Use heavy weights (700-800) with tight tracking to create an "editorial" impact.
- **Display:** Reserved for hero sections, often utilizing color gradients or high-contrast combinations.
- **Body:** Uses medium weights (400-500) with generous line-heights to ensure readability against dynamic backgrounds.
- **Labels:** Uppercase styles with increased letter spacing are used for small metadata and "eyebrow" text.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop (`1280px` max-width) while utilizing a fluid, flexible approach for inner content modules. 

- **Breathing Room:** Large vertical gaps (`100px`) separate major sections to maintain the "premium magazine" feel.
- **Asymmetry:** Grid layouts (especially for destinations) use asymmetrical column spans (e.g., 8-column vs 4-column) to create visual interest.
- **Safe Zones:** A standard `24px` gutter is used between cards and grid elements, with `16px` horizontal margins on mobile devices.

## Elevation & Depth

Visual hierarchy is established through three primary methods:
1.  **Glassmorphism:** Interactive panels (like the Search bar) use a high-blur (`12px`) background with a semi-transparent white fill and a subtle, high-key border to appear floating above the organic "blob" background elements.
2.  **Colorful Shadows:** Instead of neutral grays, shadows are tinted with the primary or secondary color (e.g., `rgba(0, 122, 51, 0.3)`) to create a glowing, "electric" effect.
3.  **Physical Rotation:** Cards and badges use slight rotations (2 to 3 degrees) to break the digital grid and feel like physical stickers or photos pinned to a board.

## Shapes

The shape language is **Organic and Rounded**. 
- **Standard Radius:** Cards and input containers use a generous `1.5rem` (24px) to `2rem` (32px) radius.
- **Pill Shapes:** Buttons, tags, and navigation elements use `full` rounding (pill-shaped) to contrast against larger blocks.
- **Blobs:** Background decorative elements use non-geometric, morphing shapes to reinforce the "Vibe" theme.
- **The "Tilt":** A signature 3-degree rotation is applied to primary badges and icon containers to add character.

## Components

- **Buttons:** 
    - *Primary:* Pill-shaped, Primary Green background, bold white text, with a colorful green shadow.
    - *Action:* Pill-shaped, Bandung Black background, white text.
    - *Floating Action:* Perfectly circular, Secondary Yellow, large icon, with a high-intensity yellow shadow.
- **Cards:** 
    - *Event Cards:* Horizontal/vertical flexible layout, white background, `2px` subtle border, with high-quality imagery and "date stickers" in the top corner.
    - *Grid Cards:* Edge-to-edge imagery with bottom-aligned text overlays using high-contrast gradients (scrims).
- **Chips & Tags:** Small, pill-shaped, using `20%` opacity of the category color (Green, Yellow, or Blue) for the background and `100%` opacity for the text.
- **Input Fields:** Glassmorphism style; integrated search bars should have a blurred background, internal padding, and high-contrast action buttons inside the container.
- **Badges:** Small "eyebrow" tags use a high-contrast black border with a `4px` offset "hard shadow" for a brutalist-lite accent.