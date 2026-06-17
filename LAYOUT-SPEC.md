# Layout Spec: How Frontmatter Becomes a Page

This document traces how a piece of content moves from a markdown file in Obsidian to a rendered card on the homepage and a detail page when clicked. It covers the exact component path, what each parameter controls visually, and how the same vibe produces different-feeling results.

## The Short Version

```
Markdown frontmatter
  → Astro page route (futures/[...slug].astro)
    → VibePost (router)
      → SaturatedFieldDetail (or whichever vibe component)
        → Base layout (wraps in HTML shell, applies font pairing to <body>)
```

For cards on the homepage:

```
CardFeed (collects all content, sorts by date)
  → VibeCard (router)
    → SaturatedFieldCard (or whichever vibe component)
```

The `vibe` field in frontmatter picks which card and detail component renders. Everything else in frontmatter parameterizes that component's appearance.

## Traced Example: "Open-wait for it"

Here's the frontmatter:

```yaml
vibe: saturated-field
vibeProps:
  fieldColor: "#FAD6D6"
  textColor: "#1a1a1a"
fontPairing: mono-sans
image: /img/open-wait-for-it_20260610A.jpg
footer: >-
  This scenario is part of a broader strategic foresight project...
customStyles: |
  .post__title { letter-spacing: 0.05em; }
  .post__content blockquote { ... }
```

### Step 1: CardFeed collects it

`CardFeed.astro` calls `getCollection('futures')` and merges it with case-studies and ideas into a single reverse-chronological array. Each entry gets a `type` string ("futures") and an `href` ("/futures/open-wait-for-it").

CardFeed passes every frontmatter field to `VibeCard`:

```
title, description, date, type, href, slug,
image, color, tags, vibe, vibeProps, span,
fontPairing, hideTitle, cardCustomStyles
```

### Step 2: VibeCard routes to the right card component

`VibeCard.astro` reads the `vibe` prop. Since it's `"saturated-field"`, it renders `SaturatedFieldCard`. If `vibe` were undefined, it would fall back to the default `Card.astro`.

Before routing, VibeCard does two things:

1. **Resolves vibeProps.** Calls `getVibeProps('saturated-field', rawVibeProps)` which merges the frontmatter's vibeProps on top of any structural defaults from `vibeDefaults.ts`. For saturated-field, the defaults are empty (`{}`), so the frontmatter values pass through unchanged.

2. **Wraps in a font pairing class.** The outer `<div>` gets `class="font-pair-mono-sans"`, which sets CSS custom properties on everything inside:
   - `--font-display` → `'Geist Mono', monospace`
   - `--font-body` → `'Geist', system-ui, sans-serif`
   - `--font-display-transform` → `uppercase`

### Step 3: SaturatedFieldCard renders the card

The card component receives `vibeProps` and extracts what it needs:

```
fieldColor = vibeProps.fieldColor → "#FAD6D6"
textColor  = ensureContrast("#FAD6D6", vibeProps.textColor ?? "#f5f0eb") → "#1a1a1a"
```

`ensureContrast` checks WCAG AA contrast ratio (4.5:1 minimum). If the provided text color doesn't meet the threshold against the background, it snaps to either `#1a1a1a` (dark) or `#f5f0eb` (light) depending on the background's luminance. In this case, `#1a1a1a` on `#FAD6D6` passes, so it stays.

The card renders as a link (`<a>`) with inline CSS variables:

```css
--field-color: #FAD6D6;   /* becomes the background */
--text-color: #1a1a1a;    /* colors all text */
```

The card's CSS uses these variables:

```css
.vibe-saturated-field-card {
  background: var(--field-color);
  color: var(--text-color);
  min-height: 320px;
  border-radius: 48px;        /* var(--radius) */
  cursor: crosshair;
}
```

Since `hideTitle` is not set (defaults to false), the card shows the title ("Open-wait for it"), the type pill ("futures"), the date, and the tags. If `hideTitle` were `true`, the card would be a blank pink rectangle, clickable but with no visible text. Useful for image-only posts like "We are not God."

### Step 4: Clicking through to the detail page

The card links to `/futures/open-wait-for-it`. Astro's page route at `src/pages/futures/[...slug].astro` catches this, fetches the content entry, and passes everything to `VibePost`.

`VibePost.astro` does the same routing as VibeCard: reads the `vibe` prop, resolves vibeProps, and renders `SaturatedFieldDetail`. The `footer` prop travels through `...rest` (the spread of all non-vibe, non-vibeProps, non-fontPairing props).

### Step 5: SaturatedFieldDetail renders the page

The detail component builds a full-page layout:

```html
<Base title="Open-wait for it — shawncole.ca" fontPairing="mono-sans">
  <article style="--field-color: #FAD6D6; --text-color: #1a1a1a;">
    <!-- header (hidden if hideTitle) -->
    <!-- hero image -->
    <!-- content (the markdown body) -->
    <!-- tags -->
    <!-- footer box -->
  </article>
  <style>/* customStyles injected here */</style>
</Base>
```

**Base.astro** wraps the page in the HTML shell. It applies `class="font-pair-mono-sans"` to `<body>`, which cascades the font variables to every element on the page. It also renders the Nav component (the Electric Lime floating pill).

**The background** fills the entire viewport: `background: var(--field-color)` on the article, with `min-height: 100vh`. The pink (#FAD6D6) covers everything.

**The hero image** renders at full content width (max 720px) with rounded corners. The image path `/img/open-wait-for-it_20260610A.jpg` resolves from the `public/img/` directory.

**The body content** (the markdown) renders inside `.post__content` at max-width 720px, centered. Inline images in the markdown (the second and third illustrations) render as block elements within the content flow. Blockquotes, horizontal rules, and bold text are all styled by the component's scoped CSS, then overridden where needed by the injected `customStyles`.

**The footer** renders as a white rounded box with SRC Marker text (uppercase). The markdown link syntax `[Check out the project](/futures)` gets regex-replaced into an `<a>` tag. The footer sits at full width (max 1432px), breaking out of the content column to create visual contrast.

**customStyles** inject last as a `<style>` tag, letting them override any component styles. For this post, they adjust blockquote styling (background tint, border radius) and heading color to work with the light pink background.

## What Each Frontmatter Field Controls

### Fields you set

| Field | What it does | Example |
|-------|-------------|---------|
| `title` | Card heading + detail page heading + page `<title>` | "Open-wait for it" |
| `description` | Card subtext (default Card only; vibe cards vary) | "Graduating from college..." |
| `date` | Sort order in feed + displayed date | 2026-06-10 |
| `tags` | Pill badges on card and detail page | ["futures", "ai"] |
| `vibe` | Which card + detail component pair renders | "saturated-field" |
| `image` | Hero image on detail page; some vibes show it on card | /img/filename.jpg |
| `alt-text` | Alt attribute for the hero image | "A high contrast silhouette..." |
| `hideTitle` | Suppresses title/type/date/tags on both card and detail | true |
| `footer` | White box with SRC Marker text below content; supports `[text](url)` links | "This scenario is part of..." |
| `span` | Card width in feed: "1" (default), "2" (wide), "3" (full) | "2" |

### Fields Claude generates (or you override)

| Field | What it does | Example |
|-------|-------------|---------|
| `vibeProps` | Key-value map parameterizing the vibe's appearance | `fieldColor: "#FAD6D6"` |
| `fontPairing` | Which two fonts the piece uses (display + body) | "mono-sans" |
| `customStyles` | Raw CSS injected into the detail page | `.post__content blockquote { ... }` |
| `cardCustomStyles` | Raw CSS injected into the card (use `:card` selector) | `:card .card__title { font-size: 2.5rem; }` |

### How vibeProps flow

vibeProps is a flat `Record<string, string>`. Each vibe component destructures the keys it cares about and ignores the rest. The shared compositional props (titleScale, contentGravity, density, etc.) are available to any vibe through the `getCompositionProps()` utility, which reads them from the same vibeProps map.

```
vibeProps in frontmatter
  → getVibeProps() merges with vibeDefaults
    → vibe component destructures what it needs
    → remaining compositional props processed by getCompositionProps()
    → both become CSS variables or class names on the rendered element
```

## The 10 Vibes: What Makes Each One Distinct

Each vibe has a card component and a detail component. The card appears in the homepage feed. The detail is the full page.

### saturated-field

A slab of color. The background IS the design. Content floats in it.

**Card:** Solid color fill, centered title, no image.
**Detail:** Full-viewport color wash, content column at 720px.
**Key props:** `fieldColor` (background hex), `textColor` (auto-contrast-checked).

### contained-box

A visible frame wraps everything. Feels like a framed print or a postcard pinned to a wall.

**Card:** Thick border, slight rotation, depth shadow.
**Detail:** Bordered container with configurable frame width.
**Key props:** `frameWidth` (border thickness), `rotation` (tilt in degrees), `bgTexture` (background pattern).

### binary-split

The card or page splits into two zones. One side gets color/image, the other gets text.

**Card:** Two-column or two-row split with configurable ratio.
**Detail:** Split layout with one region dominating.
**Key props:** `splitRatio` (percentage for left side), `leftContent` ("color" or "image"), `flip` (swap sides), `splitAxis` ("vertical" or "horizontal").

### type-wall

Typography dominates. The title repeats, scales, or fills the space to become the visual element.

**Card:** Title text as the primary visual, possibly stacked or filling the card.
**Detail:** Large-scale typographic header.
**Key props:** `typeMode` ("stacked", "fill", "cascade"), `typeFill` (whether text fills available space), `typeOpacity`, `lineCount`.

### data-dense

Information-heavy layout. Metadata, tags, dates, and structured data are the design.

**Card:** Grid of data points, accent-colored highlights.
**Detail:** Dense information layout.
**Key props:** `accentScale` (size of accent elements), `gridDensity` ("tight", "normal", "loose"), `dataSource` ("meta", "tags", "custom").

### stripe-rhythm

Vertical or horizontal stripes of alternating color or content.

**Card:** Striped background pattern with text anchored to one position.
**Detail:** Striped sections or backgrounds.
**Key props:** `stripeDirection`, `stripeWidths` ("equal" or custom ratios), `stripeCount`, `textAnchor` (where title sits), `textBackdrop`.

### dot-screen

Halftone or dot-pattern overlay. Gives a print/risograph quality.

**Card:** Dot pattern over image or color.
**Detail:** Pattern treatment on hero or background.
**Key props:** `patternType` ("halftone", "grid", "random"), `patternScale`, `patternDensity`, `textTreatment` ("knockout", "overlay", "inset").

### column-strips

Content divided into vertical strips, with one strip "active" (holding the main content).

**Card:** Multi-column strips with one highlighted.
**Detail:** Column-based layout.
**Key props:** `stripCount`, `stripRatios` (comma-separated percentages), `stripPattern`, `activeStrip` (which column holds content).

### circle-reveal

Content revealed through a circular (or shaped) mask.

**Card:** Circular viewport into an image or color.
**Detail:** Masked hero area.
**Key props:** `maskShape` ("circle", "ellipse"), `maskSize` (percentage), `maskPosition`.

### raw-frame

Layered, offset frames creating depth. Feels like stacked paper or a collage.

**Card:** Multiple offset borders creating shadow-box depth.
**Detail:** Layered frame effect.
**Key props:** `layers` (number of frames), `offsetX`/`offsetY` (pixel offset between layers), `shadowDepth`.

## The 5 Font Pairings

Each pairing sets two CSS variables that cascade through the entire page:

| Pairing | `--font-display` (titles, headings) | `--font-body` (prose, UI) | Title transform |
|---------|--------------------------------------|---------------------------|-----------------|
| `serif-sans` | Source Serif 4 | Geist | none |
| `mono-serif` | Geist Mono | Source Serif 4 | uppercase |
| `mono-sans` | Geist Mono | Geist | uppercase |
| `hand-sans` | SRC Marker | Geist | uppercase |
| `hand-serif` | SRC Marker | Source Serif 4 | uppercase |

If no `fontPairing` is set in frontmatter, `getFontPairing()` hashes the post's slug and picks one deterministically. The same slug always gets the same pairing, but the distribution across posts looks random.

## The Compositional Props

These are shared across all vibes. They live inside `vibeProps` alongside vibe-specific props.

### Typography

| Prop | Default | What it does |
|------|---------|--------------|
| `titleScale` | 1 | Multiplier for title font size |
| `titlePosition` | default | Where the title sits: `bleed-left`, `bleed-right`, `bleed-top`, `bleed-bottom` |
| `titleRotation` | 0 | Degrees of tilt on the title |
| `titleBlend` | normal | CSS mix-blend-mode for the title |
| `titleWeight` | inherit | Font weight override |
| `titleCase` | preserve | `upper` or `lower` (overrides pairing's transform) |
| `titleLeading` | default | Line height: `tight` (1.0), `crushed` (0.85), `loose` (1.4) |
| `titleStyle` | default | `italic` for italic titles |

### Spatial

| Prop | Default | What it does |
|------|---------|--------------|
| `contentGravity` | default | Flexbox alignment: `top-left`, `top-right`, `bottom-left`, `bottom-right`, `center` |
| `bleed` | false | Allows content to overflow its container |
| `density` | default | Padding intensity: `packed` (0.5rem), `airy` (4rem), `dramatic` (8rem) |
| `compositionRotation` | 0 | Rotates the entire card/container |

### Layering

| Prop | Default | What it does |
|------|---------|--------------|
| `overlayText` | (empty) | Large background text behind content |
| `overlayScale` | 20 | Size of overlay text in vw units |
| `overlayColor` | (empty) | Color of overlay text |
| `overlayBlend` | soft-light | Blend mode for overlay text |
| `clipShape` | none | CSS clip-path: `circle`, `triangle`, `diamond`, `diagonal-left`, `diagonal-right` |
| `clipSize` | 80 | Size of clip region (percentage) |

These props become CSS classes and variables applied to the card or detail wrapper. For example, setting `contentGravity: "bottom-left"` adds class `comp-gravity-bottom-left`, which applies `justify-content: flex-end; align-items: flex-start; text-align: left;` via global.css.

## How Two Posts With the Same Vibe Look Different

Take two `saturated-field` posts:

**Post A: "Open-wait for it"**
```yaml
vibeProps:
  fieldColor: "#FAD6D6"
  textColor: "#1a1a1a"
fontPairing: mono-sans
```

Pink background, dark text, Geist Mono titles in uppercase, Geist body text. Soft, editorial, almost pastel.

**Post B: (hypothetical dark version)**
```yaml
vibeProps:
  fieldColor: "#0f1419"
  textColor: "#d1d5db"
  titleScale: "4"
  contentGravity: "bottom-left"
  density: "dramatic"
fontPairing: hand-serif
```

Near-black background, light gray text, SRC Marker titles at 4x scale pushed to the bottom-left, Source Serif 4 body text, dramatic padding (8rem). Intense, brooding, poster-like.

Same HTML skeleton. Same component. Completely different presence. The variation comes from the combination of vibe-specific props (colors), compositional props (scale, gravity, density), font pairing, and custom CSS.

## The Fallback Path

When `vibe` is not set in frontmatter:

**Card:** `VibeCard` renders the default `Card.astro`. White background, standard layout with type pill, title, description, date, and tags.

**Detail:** `VibePost` renders the default `Post.astro`. White page with a hero image header, content column at 720px, and either a footer box (if `footer` is set) or a default callout CTA ("If this sparked something, let's talk about it").

Posts with no vibe look clean and conventional. Posts with a vibe look like someone designed them individually.

## The customStyles Escape Hatch

When the prop system can't express what a piece needs, `customStyles` injects raw CSS into a `<style>` tag on the detail page. These styles render after the component's scoped styles, so they win specificity ties.

For "Open-wait for it," customStyles override blockquote appearance (adding a background tint and border radius that the default saturated-field component doesn't have) and adjust heading color for the light background.

`cardCustomStyles` works the same way but for the card in the feed. Use the `:card` pseudo-selector, which gets replaced at render time with `[data-post="slug"]` to scope styles to that specific card.

## File Map: Following the Code Path

```
Content file
  src/shawncole-ca/futures/open-wait-for-it.md

Page route (detail)
  src/pages/futures/[...slug].astro
    → imports VibePost

Component routers
  src/components/vibes/VibePost.astro    (detail router)
  src/components/vibes/VibeCard.astro    (card router)

Vibe components
  src/components/vibes/cards/SaturatedFieldCard.astro
  src/components/vibes/details/SaturatedFieldDetail.astro

Defaults + utilities
  src/components/vibes/vibeDefaults.ts
    - VibeName type (enum of 10 vibes)
    - FontPairing type (enum of 5 pairings)
    - vibeDefaults (structural defaults per vibe)
    - getVibeProps() (merge defaults + overrides)
    - getFontPairing() (explicit or hash-based)
    - ensureContrast() (WCAG AA check)
    - getCompositionProps() / compositionStyles() / compositionClasses()

Layouts
  src/layouts/Base.astro     (HTML shell, font pairing class, nav)
  src/layouts/Post.astro     (default detail layout, no vibe)

Feed
  src/components/CardFeed.astro  (collects all content, sorts, renders cards)

Styles
  src/styles/global.css      (font-face, CSS variables, font pairings,
                               card styles, compositional utility classes)

Schema
  src/content.config.ts      (Zod validation for all frontmatter fields)
```
