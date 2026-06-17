# Content-to-Publish Architecture

How content moves from Obsidian to the live site, and where Claude fits in the process.

## The Stack

```
Obsidian (writing + frontmatter) → Claude (style generation) → Astro (build) → GitHub Pages (deploy)
```

Obsidian is the CMS. Astro is the renderer. Claude is the art director.

## Roles

**Shawn controls:**
- Content (all writing, all imagery)
- Template choice (which vibe to use, set in frontmatter)
- Template creation (designed in Figma, translated to code with Claude)
- Override power (any Claude-generated style param can be manually set in frontmatter)

**Claude generates:**
- All style parameters for the assigned vibe (colors, typography, spatial props)
- `customStyles` and `cardCustomStyles` CSS
- Font pairing selection
- Compositional prop values (titleScale, contentGravity, density, etc.)

**The rule:** Shawn picks the skeleton. Claude dresses it. Shawn can veto any outfit.

## Obsidian Frontmatter Schema

Every piece of content lives in the Obsidian vault at `src/shawncole-ca/`. The frontmatter has two layers: what Shawn fills in, and what Claude fills in.

### Shawn's fields (required)

```yaml
---
title: "Open-wait for it"
description: "Short card description."
date: 2026-06-10
tags: ["futures", "fiction", "ai"]
vibe: "saturated-field"          # which template to use
image: "img/open-wait-for-it.jpg" # optional hero/card image
---
```

### Claude's fields (generated)

```yaml
# Claude adds these after reading the content + assigned vibe
vibeProps:
  fieldColor: "#e8443a"
  textColor: "#1a1a1a"
  # ... all vibe-specific props
fontPairing: "hand-serif"
customStyles: |
  .post__content blockquote { border-left-color: #e8443a; }
cardCustomStyles: |
  :card .card__title { letter-spacing: -0.02em; }
# Compositional props live inside vibeProps
# titleScale, contentGravity, density, compositionRotation, etc.
```

### Override pattern

If Shawn sets any Claude field manually, Claude respects it. Partial overrides work: Shawn can set `fieldColor` and let Claude pick everything else.

```yaml
# Shawn forces the color, Claude handles the rest
vibeProps:
  fieldColor: "#0f1419"
```

Claude sees that `fieldColor` is already set and generates the remaining props around it.

## The Publish Workflow

### 1. Write

Shawn writes in Obsidian. Adds title, description, date, tags. Chooses a vibe. Saves.

### 2. Style

Shawn opens a Cowork session (or a scheduled task runs). Claude reads the new/updated content file, sees the assigned vibe, and generates all style parameters. Claude writes the generated fields back into the frontmatter.

The generation process:

1. Read the content. Understand mood, subject, tone, length.
2. Check what Shawn has already set (overrides). Respect those.
3. Check what's already on the homepage. Avoid repeating the same color/font/density as the most recent pieces.
4. Generate vibeProps, fontPairing, customStyles, cardCustomStyles per the design courage rules in VIBES.md.
5. Write the generated fields into the frontmatter YAML block.
6. Commit with a message like `style: generate vibeProps for "Open-wait for it"`.

### 3. Review

Shawn previews locally (`astro dev`) or checks the GitHub Pages preview deployment. If something feels off, Shawn either:
- Tweaks a specific prop in the frontmatter (e.g., changes `fieldColor`)
- Tells Claude to regenerate with guidance ("make it darker" or "try a different font pairing")
- Overrides Claude entirely by filling in all fields manually

### 4. Deploy

Push to main. GitHub Actions builds Astro and deploys to GitHub Pages.

## Template Creation Workflow (Figma → Code)

When Shawn designs a new template (vibe) in Figma:

### 1. Design

Shawn creates a frame in the Figma file (`shawncole.com` → `testgrounds` page) showing:
- The card version (how it looks on the homepage)
- The detail page version (how it looks when opened)
- At least 2-3 color/content variations to show the template's range

### 2. Translate

In a Cowork session, Shawn shares the Figma frame. Claude and Shawn work through:

**a. Name the vibe.** Short, descriptive kebab-case. Goes into the `VibeName` type.

**b. Identify the structural skeleton.** What's fixed across all uses of this template? The layout grid, the element positioning, the responsive behavior. This becomes the Astro component's HTML and base CSS.

**c. Identify the variable props.** What changes per piece? Colors, ratios, scales, positions. Each variable becomes a prop in the vibe's prop table. Claude documents them with types and descriptions.

**d. Define responsive behavior.** How does the template collapse at 720px? What scales down, what reflows, what hides?

**e. Define accessibility requirements.** Which elements need contrast checking? Are there pattern-related concerns? Does anything need `prefers-reduced-motion` handling?

### 3. Build

Claude creates three files:

```
src/components/vibes/cards/{VibeName}Card.astro    # card component
src/components/vibes/details/{VibeName}Detail.astro # detail component
```

And updates:

```
src/components/vibes/vibeDefaults.ts  # add to VibeName type, add structural defaults
src/content.config.ts                 # add to vibe enum
src/components/vibes/VibeCard.astro   # add import + conditional render
src/components/vibes/VibePost.astro   # add import + conditional render
VIBES.md                              # document the new vibe, props, and usage guidance
```

### 4. Test

Claude generates 2-3 test pieces with different style parameters to verify the template works across its range. Shawn previews and approves.

## Style Parameter System

The system has three layers of parameters, from broadest to most specific:

### Layer 1: Vibe (structural)

The template skeleton. Fixed HTML structure, base CSS, responsive breakpoints. Set by Shawn in frontmatter as `vibe: "vibe-name"`.

### Layer 2: Vibe Props (parameterization)

Color, ratio, and mode values specific to this vibe. Each vibe defines its own prop vocabulary. Claude generates these per piece.

In `vibeDefaults.ts`, structural defaults (like `splitRatio: '38'` for binary-split) remain as fallbacks. Color defaults should be minimal or absent, forcing Claude to always make a deliberate choice.

### Layer 3: Compositional Props (shared)

Available across all vibes. These control typography (titleScale, titlePosition, titleRotation, titleBlend, titleWeight, titleCase, titleLeading, titleStyle), layering (overlayText, clipShape), spatial tension (contentGravity, bleed, density, compositionRotation), and color temperature (colorMode). Claude generates these per piece as part of vibeProps.

### Layer 4: Custom CSS (escape hatch)

`customStyles` for the detail page, `cardCustomStyles` for the card. Raw CSS for one-off treatments. Claude generates these when the prop system can't express what the piece needs.

## What Makes the Same Template Feel Different

Two pieces using `saturated-field` should look like siblings, not twins. The variation comes from:

| Parameter | Piece A | Piece B |
|-----------|---------|---------|
| fieldColor | #e8443a (cherry) | #0f1419 (near-black) |
| textColor | #1a1a1a | #d1d5db |
| fontPairing | hand-serif | mono-sans |
| titleScale | 5 | 1.2 |
| titlePosition | bleed-left | bottom-right |
| titleLeading | crushed | loose |
| contentGravity | top-left | center |
| density | dramatic | packed |
| compositionRotation | 0 | 2 |
| colorMode | neon | muted |

Same skeleton. Completely different presence. The compositional props, combined with random color and type choices, produce a combinatorial space large enough that repeats should never feel like repeats.

## Content Types and Their Folders

| Type | Folder | Typical vibes |
|------|--------|---------------|
| Case Studies | `case-studies/` | `binary-split`, `contained-box` |
| Futures | `futures/` | `saturated-field`, `data-dense` |
| Ideas | `ideas/` | Any. Match to tone. |

Content type is derived from the folder path. Claude should consider the type when generating style params but is free to break convention.

## Pages

The site has five page types:

### Home (`/`)

Reverse-chronological card feed of all content (case studies, futures, ideas). Opens with a SRC Marker intro paragraph. The card feed is the `CardFeed` component with no filter.

### About (`/about`)

Static page. SRC Marker intro bio, two photos, CV grid of past work. Not part of the template/vibe system.

### Futures (`/futures/[slug]`)

Detail pages for futures scenarios. Uses the vibe system. Template typically features saturated-field with large silhouette imagery, prose with full-bleed image breaks, and a disclaimer footer.

### Case Studies (`/case-studies/[slug]`)

Detail pages for case studies. Uses the vibe system. Template typically features binary-split or contained-box with hero imagery, alternating prose/highlight sections, and a results/outcomes block.

### Ideas (`/ideas/[slug]`)

Detail pages for shorter-form writing. Uses the vibe system. Any vibe, matched to tone.

### Playground (`/playground`)

Card feed of standalone interactive projects (Superfabric, Dot Fabric Generator, etc.). These are full-page experiences with their own designs, not part of the vibe/template system. The playground page is a simple grid of project cards linking to their standalone pages.

## Navigation

Floating pill, fixed to bottom center. Electric Lime (`#BFFF00`) background, dark text, rounded 16px, Geist Mono uppercase.

**Default state (bar):** SC monogram + "SHAWN_COLE" + hamburger toggle.

**Open state (expanded):** Menu items stacked vertically above the bar: ALL_THE_THINGS, ABOUT_SHAWN, FUTURES, IDEAS, PLAYGROUND, CASE_STUDIES.

**Detail page state:** Back arrow replaces monogram.

## Code Changes Needed

To bring the existing codebase in line with this architecture:

### content.config.ts

Update the `fontPairing` enum to include `hand-sans` and `hand-serif`. Add `titleStyle` to the schema if it's used as a top-level field rather than a vibeProps value.

```ts
fontPairing: z.enum(['serif-sans', 'mono-serif', 'mono-sans', 'hand-sans', 'hand-serif']).optional(),
```

### vibeDefaults.ts

1. Add `'hand-sans' | 'hand-serif'` to the `FontPairing` type.
2. Update the `fontPairings` array and `getFontPairing` hash to include all 5 pairings.
3. Strip hardcoded color defaults from vibes. Keep structural defaults (ratios, counts, modes). Replace color defaults with empty strings or remove them so Claude is forced to supply colors.
4. Add `titleStyle` to `CompositionProps` with default `'default'`.

### global.css

Add `@font-face` declarations for SRC Marker (WOFF2, subsetted Latin, `font-display: optional`). Add `.font-pair-hand-sans` and `.font-pair-hand-serif` class rules.

### Font files

Add subsetted WOFF2 files to `public/fonts/`:
- `source-serif-4-var.woff2`
- `geist-var.woff2`
- `geist-mono.woff2`
- `src-marker.woff2`

## File Map

```
shawncole-ca/
├── VIBES.md                          # Claude's instruction set (the enhanced version)
├── ARCHITECTURE.md                   # this document
├── src/
│   ├── shawncole-ca/                 # Obsidian vault (content lives here)
│   │   ├── case-studies/
│   │   ├── futures/
│   │   ├── ideas/
│   │   ├── templates/                # Obsidian templates (not built by Astro)
│   │   ├── img/                      # images referenced by content
│   │   └── .obsidian/                # Obsidian config + git plugin
│   ├── content.config.ts             # Astro content schema
│   ├── components/
│   │   ├── vibes/
│   │   │   ├── vibeDefaults.ts       # types, defaults, utilities
│   │   │   ├── VibeCard.astro        # card router
│   │   │   ├── VibePost.astro        # detail router
│   │   │   ├── cards/                # one card component per vibe
│   │   │   └── details/              # one detail component per vibe
│   │   ├── Card.astro                # default (no-vibe) card
│   │   ├── CardFeed.astro            # card stack (accepts optional filter prop)
│   │   └── Nav.astro                 # floating Electric Lime nav pill
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── Post.astro
│   ├── pages/
│   │   ├── index.astro               # home: intro + full card feed
│   │   ├── about.astro               # static about page
│   │   ├── playground.astro           # playground card grid (standalone projects)
│   │   ├── case-studies/[...slug].astro
│   │   ├── futures/[...slug].astro
│   │   └── ideas/[...slug].astro
│   └── styles/
│       └── global.css                # fonts, resets, composition classes
└── public/
    ├── fonts/                        # self-hosted WOFF2 files
    └── img/                          # published images (copied from vault at build)
```
