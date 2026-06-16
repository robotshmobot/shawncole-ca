# Vibe Engine

The vibe engine is a generative layout system for shawncole.ca. Claude reads each piece of content and designs a unique layout by selecting a vibe, parameterizing it, choosing a font pairing, and writing custom CSS where needed. Every post gets its own composition. The site is a playground, a gallery wall where nothing matches and everything belongs.

## Architecture

Three layers, each more specific than the last:

```
vibe (structural template) → vibeProps (parameterization) → customStyles (escape hatch)
```

- **vibe**: Named layout template. Controls the structural skeleton of both the card (homepage) and detail page.
- **vibeProps**: Flat key-value map that parameterizes the vibe. Colors, ratios, scale, positioning. Each vibe defines its own prop vocabulary, plus shared compositional props available to all vibes.
- **customStyles**: Raw CSS injected into the detail page. Scoped to `.post__content` and siblings. Use for one-off treatments that don't fit the prop system.
- **cardCustomStyles**: Raw CSS injected into the card. Use `:card` as a selector; it gets replaced with `[data-post="slug"]` at render time.

A post can use any combination. A post with no vibe renders with the default card and post layout.

## Frontmatter

```yaml
---
title: "Post Title"
description: "Short description for the card."
date: 2026-06-15
tags: ["tag1", "tag2"]
color: "#hex"                    # accent color
vibe: "saturated-field"          # layout template
vibeProps:                       # vibe-specific parameters
  fieldColor: "#0f1419"
  textColor: "#d1d5db"
  titleScale: "3"
  contentGravity: "bottom-left"
fontPairing: "mono-sans"         # override auto-rotation
customStyles: |                  # detail page CSS
  .post__content blockquote { border-left-color: #1D37F9; }
cardCustomStyles: |              # card CSS (use :card selector)
  :card .card__title { font-size: 2.5rem; }
---
```

## Vibes

### Built

#### `saturated-field`

Bold saturated background IS the composition. The card is a slab of color with content floating in it. On the detail page, the entire viewport is immersed in the field color.

| Prop | Default | Description |
|------|---------|-------------|
| `fieldColor` | - | Background color (Claude picks per piece) |
| `textColor` | - | Text color (auto-corrected for WCAG AA contrast) |

#### `contained-box`

A visible bordered frame wraps the content. The container IS the design: thick borders, slight rotation, depth shadow. Feels physical, like a framed print or a card on a table.

| Prop | Default | Description |
|------|---------|-------------|
| `frameColor` | - | Border color (Claude picks per piece) |
| `frameWidth` | `6` | Border thickness in px |
| `rotation` | `-0.8` | Card rotation in degrees |
| `bgTexture` | `none` | Background treatment |

#### `binary-split`

Two unequal panels in direct juxtaposition. One panel holds color or image, the other holds text. The division is abrupt. No gradient, no transition. Asymmetric balance through weight.

| Prop | Default | Description |
|------|---------|-------------|
| `splitRatio` | `38` | Left panel width as percentage |
| `leftBg` | - | Left panel background (Claude picks per piece) |
| `rightBg` | - | Right panel background (Claude picks per piece) |
| `leftContent` | `color` | What the left panel shows |
| `flip` | `false` | Swap panel order |
| `leftRadius` | `24` | Border radius on the inner edge of the left panel |
| `splitAxis` | `vertical` | `vertical` or `diagonal-left` or `diagonal-right` for angled splits |

### Planned

#### `column-strips`

3-4 asymmetric vertical strips with no gutters. Each strip is a different register: color block, pattern, text. They sit in direct juxtaposition, creating visual rhythm through repetition and contrast. Inspired by Mac Premo's "Why Must I Fight My Inner Motherwell" column subdivisions and Daikoku's Musashino stripe gradients.

| Prop | Default | Description |
|------|---------|-------------|
| `stripCount` | `3` | Number of vertical strips (2-5) |
| `stripRatios` | `30,40,30` | Comma-separated width percentages |
| `stripColors` | - | Comma-separated hex colors, one per strip |
| `stripPattern` | `solid` | `solid`, `gradient`, `bars` per strip |
| `activeStrip` | `2` | Which strip holds the text content (1-indexed) |

#### `circle-reveal`

Content revealed through a geometric clip-path aperture on a contrasting surround. The shape cuts a viewport into what's beneath. Scale contrast between the geometric window and the raw background creates tension.

| Prop | Default | Description |
|------|---------|-------------|
| `maskShape` | `circle` | `circle`, `triangle`, `diamond`, `hexagon` |
| `maskSize` | `65` | Shape size as percentage of container |
| `maskPosition` | `center` | Where the aperture sits |
| `surroundColor` | - | Color of the area outside the mask (Claude picks per piece) |
| `revealColor` | - | Color/content visible through the mask (Claude picks per piece) |

#### `raw-frame`

Overlapping layers with visible z-depth. Outer frame with shadow, inner content offset. Physical layering over flat stacking. Inspired by Mac Premo's box constructions where paper overlaps paper and you see edges, shadows, thickness.

| Prop | Default | Description |
|------|---------|-------------|
| `layers` | `2` | Number of visible stacked layers (2-4) |
| `offsetX` | `12` | Horizontal offset between layers in px |
| `offsetY` | `8` | Vertical offset between layers in px |
| `shadowDepth` | `medium` | `subtle`, `medium`, `deep` |
| `layerColors` | - | Comma-separated colors for each layer |

### New Vibes (from poster research)

#### `type-wall`

Typography IS the composition. Text scales to fill the entire frame. The letterforms become architecture: stacked, overlapping, bleeding off edges. Content reads as graphic form first, language second. Inspired by Charlotte Rohde's Flint*ype (oversized stacked text filling the frame), Paul Farrell's Big Hand (single massive letterform dominating the field), Stockholm Design Lab's Post Books (overlapping oversized letters on red), and Pardoe Office's Slam Jam poster (massive bilingual type, pure hierarchy through scale).

| Prop | Default | Description |
|------|---------|-------------|
| `typeMode` | `stacked` | `stacked` (lines fill vertically), `single-glyph` (one letter dominates), `overlap` (letterforms layer) |
| `typeFill` | `true` | Whether type scales to fill available space |
| `typeColor` | - | Type color (Claude picks per piece) |
| `fieldColor` | - | Background color (Claude picks per piece) |
| `typeOpacity` | `1` | Opacity of the display type (0.1-1) |
| `lineCount` | `auto` | Force title to break across N lines for stacking control |

Best for: short punchy titles, single-word posts, manifestos. Pairs well with `mono-sans` or `mono-serif`.

#### `data-dense`

Information density as visual texture. The card becomes a field of tightly packed data: metadata, dates, tags, counts, all rendered at small scale in a monospaced grid. One element breaks the grid at massive scale as the focal point. Inspired by David Bennett's "This Year 2026" (dense data grid on neon yellow) and the SearchSystem studio index (monospaced list on black with green text).

| Prop | Default | Description |
|------|---------|-------------|
| `gridColor` | - | Color of the dense data text (Claude picks per piece) |
| `fieldColor` | - | Background color (Claude picks per piece) |
| `accentScale` | `4` | Scale multiplier for the focal element |
| `gridDensity` | `tight` | `tight`, `medium`, `loose` controls line spacing |
| `dataSource` | `meta` | What populates the grid: `meta` (post metadata), `content` (body text excerpt), `tags` |

Best for: technical content, data-heavy posts, lists, anything that benefits from a sense of volume.

#### `stripe-rhythm`

Repeating color strips as the primary composition. Vertical or horizontal bands in a gradient sequence or alternating pattern. Text floats on top, anchored to one edge. The stripes create optical rhythm and movement. Inspired by Daikoku's Musashino Art University series (vertical color gradients, horizontal pink stripes) and Sulki & Min's Gray Exercises (black/white bar patterns at varying widths).

| Prop | Default | Description |
|------|---------|-------------|
| `stripeDirection` | `vertical` | `vertical`, `horizontal`, `diagonal` |
| `stripeColors` | - | Comma-separated hex colors for the stripe sequence |
| `stripeWidths` | `equal` | `equal`, `progressive` (widening), `random`, or comma-separated px values |
| `stripeCount` | `8` | Number of stripes |
| `textAnchor` | `bottom-left` | Where the text block sits over the stripes |
| `textBackdrop` | `none` | `none`, `solid`, `blur` backing behind text for legibility |

Best for: visual/design content, music-adjacent writing, anything with rhythm or progression as a theme.

#### `dot-screen`

Generated halftone or dot-pattern texture as the visual field. The pattern itself is the composition. Text punches through in a contrasting color or sits above the pattern field. Inspired by Neubau's "Ambulo Ergo Sum" (halftone dot moiré) and Bonsma & Reist's "60 Years Uldry" (concentric spiral line art).

| Prop | Default | Description |
|------|---------|-------------|
| `patternType` | `halftone` | `halftone`, `concentric`, `moiré`, `grid-dots` |
| `patternScale` | `medium` | `fine`, `medium`, `coarse` controls dot/line size |
| `patternColor` | - | Pattern element color (Claude picks per piece) |
| `fieldColor` | - | Background color (Claude picks per piece) |
| `patternDensity` | `0.6` | Fill ratio (0.1 sparse to 1.0 packed) |
| `textTreatment` | `knockout` | `knockout` (text cuts through pattern), `overlay` (text sits above), `inline` (text follows pattern rhythm) |

Best for: abstract or conceptual writing, design commentary, pieces where mood matters more than illustration. Generated via CSS `background-image` with radial-gradient or repeating patterns.

## Font Pairing System

Three fonts, max two per piece, rotated automatically by slug hash (deterministic; card and detail always match). Override with the `fontPairing` field.

| Pairing | Display (headings) | Body | Character |
|---------|-------------------|------|-----------|
| `serif-sans` | Source Serif 4 | Geist | Classic editorial warmth |
| `mono-serif` | Geist Mono (uppercase) | Source Serif 4 | Technical brutalism meets old-world text |
| `mono-sans` | Geist Mono (uppercase) | Geist | Pure modern technical |

Geist Mono is always rendered uppercase via `text-transform`. The `--font-display-transform` CSS variable controls this automatically.

### Font pairing randomization

Any pairing can work with any vibe. The auto-rotation by slug hash already ensures variety. Claude should treat font pairing as a free variable, chosen per piece based on the content's character, not the vibe's identity. A `data-dense` card in `serif-sans` reads differently from one in `mono-sans`, and both are valid. Surprise pairings (a `contained-box` in `mono-sans`, a `type-wall` in `serif-sans`) often produce the most distinctive results.

The only hard constraint: legibility. At extreme `titleScale` values (5+), confirm the chosen typeface renders cleanly at that size. Geist Mono's uppercase transform gives poster energy at large scales; Source Serif 4 gives warmth. Neither is wrong.

## Compositional Props (shared across all vibes)

These props are available to every vibe. They turn vibes from "different boxes" into genuinely distinct compositions.

### Typography as composition

| Prop | Values | Effect |
|------|--------|--------|
| `titleScale` | `0.5`-`8` | Title font size multiplier. `1` is default, `4` is a statement, `6`+ is architecture. |
| `titlePosition` | `default`, `bottom-left`, `bottom-right`, `center`, `bleed-left`, `bleed-right`, `bleed-top`, `bleed-bottom` | Where the title sits. `bleed-*` lets it extend past the container edge. |
| `titleRotation` | degrees, e.g. `-3` | Rotate the title for diagonal energy. |
| `titleBlend` | CSS mix-blend-mode, e.g. `difference`, `overlay`, `multiply` | How the title composites against the background. `difference` is particularly effective on saturated fields. |
| `titleWeight` | `100`-`900` | Font weight override for the title. |
| `titleCase` | `preserve`, `upper`, `lower` | Text transform. `upper` paired with Geist at scale 5+ creates poster energy. |
| `titleLeading` | `tight`, `default`, `loose`, `crushed` | Line-height control. `crushed` (0.85) stacks lines so they nearly touch, creating density. |

### Layering primitives

| Prop | Values | Effect |
|------|--------|--------|
| `overlayText` | any string | Large background word rendered at massive scale, low opacity. The collage watermark. |
| `overlayScale` | `10`-`40` | Size of the overlay text in vw units. |
| `overlayColor` | hex | Color of the overlay text. |
| `overlayBlend` | CSS mix-blend-mode | How the overlay composites. Default `soft-light`. |
| `clipShape` | `none`, `circle`, `triangle`, `diagonal-left`, `diagonal-right`, `diamond`, `polygon` | Clip-path mask applied to the content area or image. |
| `clipSize` | `50`-`100` | Size of the clip shape as percentage. |

### Spatial tension

| Prop | Values | Effect |
|------|--------|--------|
| `contentGravity` | `top-left`, `top-right`, `bottom-left`, `bottom-right`, `center` | Where the text block anchors within the card. |
| `bleed` | `true`/`false` | Whether elements can visually break their container. |
| `density` | `packed`, `default`, `airy`, `dramatic` | Controls padding scale. `dramatic` = huge negative space. `packed` = tight. |
| `dividerStyle` | `none`, `line`, `dot`, `dash`, `gradient` | Visual separator between metadata and content. |
| `compositionRotation` | degrees, e.g. `2`, `-1.5` | Rotate the entire card or content block. Subtle (under 3°) creates energy. Over 5° is a statement. |

### Color temperature

| Prop | Values | Effect |
|------|--------|--------|
| `colorMode` | `analog`, `neon`, `muted`, `high-contrast` | Guides the overall color feel. `analog` = slightly warm/desaturated. `neon` = fluorescent/electric. `muted` = low saturation. `high-contrast` = pure black/white with one accent. |

## How Claude Should Design

When a new piece of content is added:

1. **Read the content.** Understand the mood, subject, tone, length.
2. **Pick a vibe** that matches the structural feel. See the decision guide below.
3. **Randomize colors.** Every color prop is a free variable. There are no default palettes. Pick colors that serve the content's mood, but draw from the full spectrum. A `saturated-field` can be neon pink, kraft brown, cobalt blue, or acid yellow. A `data-dense` card can be white-on-black, orange-on-navy, or lime-on-charcoal. The only constraint is WCAG AA contrast. Vary `colorMode` across pieces too: analog, neon, muted, and high-contrast should all appear on the homepage over time.
4. **Randomize the font pairing.** Any pairing works with any vibe. Pick based on content character, not vibe identity. If the last three pieces used `mono-sans`, reach for `serif-sans`.
5. **Push the composition.** Use the shared compositional props to make each piece visually distinct.
6. **Write customStyles** for anything unique to this piece. Keep it scoped and purposeful.

The goal is that no two pieces on the homepage look like they came from the same template, even when they share a vibe. Colors, type, and props are all independent variables. Vary them freely.

### Vibe decision guide

| Content signal | Good vibe candidates |
|---|---|
| Short, punchy, provocative | `type-wall`, `saturated-field` with high titleScale |
| Long narrative, essay | `binary-split`, `contained-box` |
| Technical, data-heavy | `data-dense`, `binary-split` |
| Visual/design subject | `stripe-rhythm`, `dot-screen`, `column-strips` |
| Abstract, conceptual, moody | `dot-screen`, `circle-reveal`, `saturated-field` |
| Personal, intimate | `contained-box`, `raw-frame` |
| Forceful, manifesto-like | `type-wall` with `typeMode: stacked`, `saturated-field` with scale 5+ |
| Playful, experimental | `stripe-rhythm`, `column-strips`, any vibe with `compositionRotation` |

### Design courage rules

Claude tends toward safe, centered, medium-everything compositions. Resist that. Follow these principles:

1. **Make one big move per piece.** Every composition needs a single bold decision: a title at scale 6, a 15-degree rotation, a neon yellow field, a circle mask at 80% of the viewport. If every parameter is moderate, the piece is forgettable.

2. **Asymmetry is the default.** Centered, evenly-padded layouts are the fallback, not the goal. Push content to corners. Let titles bleed off edges. Leave voids that feel intentional.

3. **Type can be architecture.** A title at scale 5+ in Geist Mono uppercase is a visual element as powerful as any image. Use titleScale, titleLeading, titleBlend, and titleRotation together to make type do compositional work.

4. **Colors and type are always random.** No vibe has a "default" palette or a "natural" font pairing. Every color is chosen fresh per piece from the full spectrum: neon greens, hot pinks, burnt oranges, cobalt blues, kraft browns, acid yellows, deep purples. Every font pairing is chosen fresh per piece based on content character. If you notice yourself reaching for the same palette or pairing twice in a row, that's a signal to change direction.

5. **Density is a tool, not a problem.** A card packed with small-scale metadata text (data-dense) creates as much visual interest as a card with one word at scale 8. Use the full range from `packed` to `dramatic`.

6. **Let vibes influence each other.** A `saturated-field` with `titleScale: 6` and `titleLeading: crushed` behaves almost like a `type-wall`. A `binary-split` with `compositionRotation: 3` feels completely different from the same vibe at 0°. Cross-pollinate.

7. **Rotation creates energy.** Even 1.5° of `compositionRotation` breaks the grid enough to feel alive. Reserve 5°+ for pieces that should feel disruptive.

8. **One strong vibe variation per homepage screen.** When designing a new piece, consider what's already on the homepage. If the last three pieces are all `saturated-field`, reach for `type-wall` or `data-dense` or `stripe-rhythm`. Variety across the page matters as much as quality within each card.

9. **The background participates.** A background is never just "the color behind the text." In `saturated-field`, the color IS the piece. In `dot-screen`, the pattern IS the piece. In `data-dense`, the metadata grid IS the piece. Design backgrounds as foreground elements.

## Accessibility

All compositions must maintain:

- **WCAG AA contrast** (4.5:1 minimum). The `ensureContrast()` utility auto-corrects text color against backgrounds. For `type-wall` and `data-dense`, contrast is critical since type carries so much visual weight.
- **Semantic HTML**. Every card has the same underlying structure: `<a>` wrapping type badge, `<h2>`, `<p>`, `<time>`. Screen readers see identical content regardless of vibe.
- **Responsive collapse**. Multi-column vibes collapse to single column at 720px. Bleeds, rotations, and extreme scales reduce on mobile. `type-wall` titles drop to a maximum scale of 3 on mobile. `stripe-rhythm` reduces to 3 stripes maximum.
- **`prefers-reduced-motion`**. All animations and transforms (including `compositionRotation` and `titleRotation`) are disabled.
- **Focus styles**. Visible outline on all interactive elements.
- **Pattern accessibility**. `dot-screen` and `stripe-rhythm` patterns must not create strobing or flickering effects. Minimum stripe width is 4px. Moiré patterns use `prefers-reduced-motion` to render as static.
- **Text over pattern legibility**. When text sits on `stripe-rhythm` or `dot-screen` backgrounds, use `textBackdrop: solid` or `textBackdrop: blur` to ensure readability. Never rely on the pattern gaps alone for contrast.
