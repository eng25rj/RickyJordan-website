# Design System — Brady Jordan / ClipPlayMedia

A working handbook, not a style guide. Every rule came out of a real build and
most came out of a real bug. All values are the ones actually shipped; every
contrast ratio in here was computed, not estimated.

Consolidated from two builds:

| | **Twin Fins Coffee** | **Drift Digital Media** |
|---|---|---|
| Voice | Beach/surf, warm, hand-made | Legacy brand, engraved plate, quiet confidence |
| Ground | Bone paper, navy ink | Ivory paper, near-black ink |
| Accent | Caramel + two-variant teal | Single bronze |
| Display | Fraunces (variable serif) | Cormorant (engraved serif) |
| Signature | Extruded slab headlines, liquid glass | Letterboxed film, wax-seal letter, film grain |

Different worlds, one system. **Part I is the system.** Parts II and III are two
proofs that it survives contact with opposite brand briefs.

**If you are a human:** read Part I, skim Part II for the brand you're working
in, keep §13 open while you build.

**If you are an AI agent:** §1 and §13 are the ones you will get wrong. Read them
first. They override defaults you'd otherwise reach for. Do not "improve" a
palette, invent tokens, or restyle what wasn't asked about — the odd choices here
are load-bearing and most are documented with the bug that caused them.

---

# PART I — THE SYSTEM

## 1. First principles

### 1.1 Contrast governs. Everything else negotiates.

Legibility is the constraint the design is built inside, not a finishing pass. If
a decision makes something harder to read, the decision loses — the decoration
changes, not the text.

Stated in the Drift tokens as: *"body text on dark sections is ivory (not a muted
gray), and every text-over-media surface gets a real scrim. No exceptions for
aesthetics."*

### 1.2 Measure, do not eyeball

Never claim a ratio you haven't computed. Never assume a photo is "dark enough."

```
lin(c) = c/12.92                    if c ≤ 0.03928   (c is 0–1 sRGB)
       = ((c + 0.055)/1.055)^2.4    otherwise
L      = 0.2126·lin(R) + 0.7152·lin(G) + 0.0722·lin(B)
ratio  = (L_lighter + 0.05) / (L_darker + 0.05)
```

Targets: **4.5:1** body, **3:1** large text (≥24px, or ≥19px bold) and meaningful
UI boundaries, **7:1** where cheap.

> Measuring the two shipped palettes for this document corrected two claims
> written in the code's own comments (see §5.2). Even careful estimates drift.
> Compute it.

### 1.3 A translucent surface has no color of its own

Glass, scrims, veils, and blurs transmit what's behind them — so their legibility
is a property of the page underneath, which changes as you scroll. A hard-coded
text color on a translucent surface is a bug waiting for the right background.
Sample the ground, or use a blend mode that cannot be wrong (§4).

### 1.4 Motion is transform and opacity

Animate `transform` and `opacity`. Nothing else. From Drift's motion library:
*"Animated `filter: blur()` is what made the first pass stutter — the compositor
has to re-rasterise every frame instead of just re-compositing a layer."*

### 1.5 The reduced-motion state must be a finished design

Not "turn it off and hope." The static end state has to look deliberate — the
ghost stays, the movement goes. Every effect ships with a designed still frame.

### 1.6 Earn every effect

Grain, glass, scanlines, parallax, extruded type — each costs performance and
attention. If it doesn't carry meaning or improve readability, cut it. The point
is never that the technique is clever.

### 1.7 Restraint is what makes emphasis work

Drift gives the magnetic hover pull **only** to primary CTAs — *"everything else
stays still so the pull keeps meaning something."* Same logic reserves Caveat to
one moment per Twin Fins site, and mono to true film metadata only. An effect
applied everywhere communicates nothing.

### 1.8 Rebuild from the client's own material

Both sites were rebuilt from what the client already had — Drift's parchment
envelope, engraved process sketches, and client lockups came out of the original
site; Twin Fins' palette was sampled from the physical logo, a turtle photograph,
and an espresso pour. Colors are sampled from real collateral, never picked off a
wheel. The redesign should feel like the brand finally rendered properly, not
like a different company.

### 1.9 Preserve fact, rewrite framing

Identical rule in both codebases: *"Everything factual — the email, the service
areas, the pricing tiers, the client stats, the FAQ answers — is preserved from
the original site. Only the framing around it has been rewritten."* Never
invent a testimonial, statistic, client, or credential.

---

## 2. Color

### 2.1 Structure (brand-agnostic)

Every palette in this system resolves to the same seven roles:

| Role | Purpose |
|---|---|
| **Paper** | Default light ground (`--bone`, `--ivory`) |
| **Paper-alt** | Alternating band, one step deeper (`--sand`, `--ivory-dim`) |
| **Ink** | Primary dark ground + primary text on light (`--navy`, `--ink`) |
| **Ink-deep** | Deepest ground, for anything playing footage (`--navy-deep`, `--ink-deep`) |
| **On-dark** | Body text on dark. **Always the paper color, never a gray.** |
| **Muted** | Secondary text. A floor, not a default. |
| **Accent** | One metallic. Decoration, not paragraphs (§2.3). |

Plus hairlines at ~0.14–0.16 alpha of the opposing ink.

### 2.2 The metallic-accent law

**Measured across both brands, the metallic accent fails AA body text on its own
paper ground:**

| Accent | On paper | Ratio | Body text |
|---|---|---:|:--:|
| Twin Fins caramel `#9b6d4d` | bone `#f7f3e9` | **4.04** | ❌ |
| Twin Fins caramel | navy `#2a3947` | **2.64** | ❌ (fails large too) |
| Drift bronze `#96793f` | ivory `#f2eee3` | **3.55** | ❌ |
| Drift bronze-deep `#7c6132` | ivory `#f2eee3` | **5.01** | ✅ |
| Drift bronze-deep | ivory-dim `#e7e1d1` | **4.45** | ❌ *(misses by 0.05)* |

Two conclusions, both non-negotiable:

1. **A metallic accent is for rules, fills, underlines, and large display type —
   never body copy.** Warm mid-tone metallics land at 3.5–4.5:1 on warm paper
   almost by definition.
2. **Ship a deepened variant of every accent** (`--bronze-deep`, `--sea-deep`)
   and use it for anything that must be read. Note that `bronze-deep` still fails
   on the *alternating* band by 0.05 — an accent verified on one ground is not
   verified on the other.

### 2.3 Two-variant accents

`--sea` (light, for dark grounds) and `--sea-deep` (dark, for light grounds) are
**not interchangeable** — picking the wrong one is the most common error in the
Twin Fins palette. Any accent used on both grounds needs both variants.

### 2.4 Rules

1. Text sits on a **named** ground. If you can't name it, you're in §4 territory
   and need a technique, not a color.
2. `--muted` passes with little headroom (5.03 / 5.40). Only on paper, never
   further reduced in opacity.
3. Body text on dark is the paper color at full strength. Muted-dark variants
   (`#b9b4a4`, 9.06:1 on ink-deep) are for labels, never paragraphs.
4. `::selection` uses accent-on-paper — one of the few places accent-as-fill is
   correct.

---

## 3. Typography

### 3.1 Roles

| Role | Twin Fins | Drift | Rule |
|---|---|---|---|
| Display | Fraunces (`SOFT`/`WONK` axes) | Cormorant 600 | Serif with real character; optical axes keep it hand-made |
| Body | DM Sans | System sans | Neutral, doesn't compete |
| Brand caps | — | Cormorant 700, `0.26em` | The wordmark's own face, promoted to a utility |
| Metadata | — | Mono `0.72rem`, `0.18em` | **Timecodes and reel numbers only** |
| Accent | Caveat | — | Exactly one moment per site |

**Self-host fonts.** Never fetch from Google at build time — it makes builds
network-dependent and fails opaquely in CI.

**Drift's best typographic idea:** promote the wordmark's typography to a
site-wide utility (`.brandcaps`) used on nav links, buttons, and labels, so the
logo's voice carries through everything. Eyebrows moved from mono to serif caps
specifically to keep mono meaningful as film metadata.

### 3.2 Fluid scale

No fixed sizes, no arbitrary values in components. Both projects use a
clamp-based scale; Drift's runs more dramatic at the top (`--step-5` to 8rem)
because its heroes are full-bleed film.

```css
/* Twin Fins */                        /* Drift */
--step-0: clamp(1rem, …, 1.12rem);     --step-0: clamp(1rem, …, 1.15rem);
--step-4: clamp(2.35rem, …, 4rem);     --step-4: clamp(3rem, …, 5.9rem);
--step-5: clamp(3rem, …, 5.75rem);     --step-5: clamp(3.6rem, …, 8rem);
```

Body line-height 1.6–1.62. Display line-height 0.98–1.0 with −0.01 to −0.03em
tracking. Uppercase always tracked (0.12–0.30em).

### 3.3 Measure and wrapping

- Body: `max-width: 46–62ch`. Never full-bleed paragraphs.
- `text-wrap: pretty` on body, `balance` on headings.

### 3.4 Word masks that release

Animated per-word reveals clip each word to its line box. **Drop the clip when
the animation finishes** — otherwise descenders and italic swashes are sheared
forever at rest:

```css
.word-mask      { overflow: clip; vertical-align: bottom;
                  padding-bottom: 0.12em; margin-bottom: -0.12em; }
.word-mask-done { overflow: visible; }
```

### 3.5 The extruded headline (Twin Fins)

Graded front face, stepped side faces, cast shadow.

```css
--headline-shadow: 0 0.018em 0 #6b563f, 0 0.036em 0 #56432f,
                   0 0.054em 0 #3f3123, 0 0.09em 0.12em rgba(42,57,71,0.3);
```

1. **`text-shadow`, never `drop-shadow()`.** A filtered layer inside a reveal
   mask (`overflow: hidden`) renders as *nothing at all*. Shadows survive the
   clip; filters don't.
2. **Offsets in `em`** so the slab scales with the type.
3. **Steps are absolute, not chained** — 0.018/0.036/0.054 all measured from the
   glyph, reading as three faces of one extrusion.
4. **Side faces always darker than the ground.** Lighter faces read as highlight,
   flattening the slab and hollowing the letters. Light comes from the face
   gradient, never a rim.

Provide a `-dark` variant for type over photography with a **tight** near-opaque
halo (~0.05em), not a wide glow — wide glows halo badly on the flat dark sections
sharing the token. Legal pages and secondary headings opt **out**; it's a hero
device.

---

## 4. Contrast engineering — the hard part

Four techniques, in order of preference. This section is the real value here.

### 4.1 Sample the ground (best, when the surface transmits)

For glass over unknown content, read what's genuinely underneath and flip the
whole treatment. **Drift's implementation is the refined one — use it:**

```
1. Hide the bar with `visibility: hidden` (NOT pointer-events — the pill's own
   pointer-events: auto still catches elementFromPoint). Hidden elements are
   skipped synchronously, so no frame ever paints without the bar.
2. elementFromPoint at the bar's midline.
3. Walk up until a node actually PAINTS a background (alpha > 0.4).
   → If you hit a <video> or <img> first, return "dark": media under the bar is
     always our own dark-scrimmed footage.
4. Luminance > 0.55 → light ground → ink text + ivory glass.
   Otherwise → dark ground → ivory text + ink glass.
5. Stamp `data-contrast` on the header; CSS does the rest, with transitions so
   the flip is soft.
```

Three things that will bite you:

- **Throttle it.** `elementsFromPoint` + `getComputedStyle` force layout. Run it
  per scroll frame and the whole page pays. **150ms is indistinguishable to the
  eye** — a tone flip is not a per-frame decision.
- **Parse both color syntaxes.** Chromium serializes `rgb()/rgba()`; Safari
  reports `color-mix()` backgrounds as `color(srgb r g b / a)` with 0–1 channels.
  Handle only the first and Safari silently never flips.
- **Never transition `backdrop-filter`.** From the Drift nav: *"animating it
  makes some engines drop the filter entirely, which is how nav text ends up
  colliding with page text through clear glass."* Transition color and
  background; leave the filter alone.

**The cheaper alternative:** Drift's nav is *ink* glass in both states, chosen so
it reads over both dark heroes and ivory sections without flipping at all. If one
treatment can work everywhere, that beats reactivity. Reach for sampling only
when it genuinely can't.

### 4.2 `mix-blend-mode: difference` (elements crossing two grounds)

When one element straddles two surfaces at once — a rotating badge half on a dark
page, half on a bright photo — no single color survives. White through a
difference blend inverts **per pixel**, continuously, with zero JavaScript.

### 4.3 Veils over media (text over photo/video)

Never text on raw media. Always a measured scrim.

- **Video needs more than stills.** Footage is busier and moves: use a flat base
  wash across the whole frame *plus* a heavier directional pour on the text side.
  A gradient alone is legible in one frame and gone the next.
- Lift the scrim through the band where the type sits — sampling found highlights
  at 0.72 luminance directly under headline type.
- Shipped values: `rgba(19,30,39,0.55)` flat + gradient to 0.3, or ~0.82 for a
  full-section veil under body copy.
- **Letterboxing is a legitimate scrim.** Drift's hero grades footage like a
  master with bars top and bottom, giving type a guaranteed ground.

### 4.4 Give the type its own edge (last resort, additive)

A tight text-shadow halo. Use *with* a scrim, never instead of one.

---

## 5. Data visualization

From Drift's social case studies — the discipline that keeps charts honest.

### 5.1 Series color must pass a validator

A chart series color has three constraints at once: **chroma floor** (it must
stay identifiable as a hue), **lightness band** (it must sit in a usable range on
its ground), and **contrast** against that ground. Brand accents rarely satisfy
all three unmodified.

Drift's bronze `#96793f` was **re-stepped to `#b3852f`** to pass on ink —
measured **5.20:1 on ink, 5.65:1 on ink-deep**, versus the raw bronze's failing
4.20:1. Re-step the accent; don't force the original through.

**Labels and values are text tokens, never the series color.** The series color
identifies the line. It does not have to be readable as type, and shouldn't be
asked to.

### 5.2 Honesty rules

- **Endpoints are real; interpolation is labeled.** Drift's charts plot published
  analytics endpoints (74,784 engagements ↑943%; 1,153 net follows ↑35%) with an
  interpolated month-to-month shape between them — **and the cards say so.**
- **Print sources like footnotes.** Researched figures carry visible attribution.
- **Numbers over screenshots.** Set statistics typographically rather than
  cropping dashboard screenshots — it's sharper, accessible, and doesn't leak
  someone's UI.

> Two claims in these codebases' own comments were wrong when measured: "ivory on
> ink-deep is ~14:1" is actually **16.20**, and "muted-dark 7.2:1 on ink-deep" is
> actually **9.06**. Both erred safe, but §1.2 exists for a reason.

---

## 6. Space, rhythm & texture

```css
/* Twin Fins */                    /* Drift */
--gutter: clamp(1.25rem,4vw,3.5rem);  --shell: min(92vw, 82rem);
--section-y: clamp(5rem,10vw,9rem);   --section-y: clamp(5rem,11vw,9.5rem);
--maxw: 82rem;                        --radius: 10px; --radius-sm: 6px;
--radius: 1.25rem; --radius-lg: 2rem;
```

- One `.shell` wrapper owns width and gutters. Components never set outer margins;
  sections own vertical rhythm.
- Breakpoints are content-driven — chosen where a layout actually broke
  (`40/48/56/62/64rem`), not at device sizes.
- `scroll-padding-top: 6rem` so sticky nav never covers anchors.

### 6.1 Radius encodes register

Drift's radius moved **2px → 10px** when the brief shifted from *luxury* toward
*polished*: *"10px card corners read product, not etching."* Radius is a
positioning decision, not a default. Twin Fins runs much rounder (20–32px)
because it's warm and hand-made.

### 6.2 Optical spacing beats mathematical spacing

Underlined links need more space below than above — the rule hangs below the
baseline, so equal padding *looks* wrong even when it measures right.

### 6.3 Grain

One texture tying flat paper to footage. Fixed, non-interactive, cheap, **not
animated**: a tiled SVG `feTurbulence` (fractalNoise, baseFrequency 0.82, 4
octaves, desaturated), `opacity: 0.05`, `mix-blend-mode: multiply`, 220px tile,
inlined as a data URI.

---

## 7. Motion

```css
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1);   /* default */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--dur-fast: 0.25s;  --dur: 0.45s;  --dur-slow: 0.7s;
```

- Entrances 0.6–1.15s, `--ease-out`, staggered 0.04–0.11s between siblings.
- Springs for physical things (`stiffness: 90–120, damping: 26–32`).
- Stagger creates a **wave** — travelling across a row reads as one gesture;
  everything at once reads as noise.
- Reveals `once: true` with negative viewport margin (~−10 to −15%) so they fire
  slightly *after* entry.
- Shared `.lift` for card hover: `translateY(-6px)` + shadow, transform/opacity
  only, disabled under reduced motion.
- Marquees pause on hover; static under reduced motion.

---

## 8. Component patterns worth reusing

**Floating glass bar.** A pill inset from the top edge, not a full-bleed strip.
Translucent fill (~30–45%), `backdrop-filter: blur() saturate() brightness()`,
and **all edge treatment confined to ~2px** — hairline bright top lip, faint dark
under-edge, soft lift shadow. Thicker reads as brushed metal, not glass. If
refracting via an SVG displacement map, **warp before you blur** (bending
already-blurred pixels is invisible) and put the falloff in the map via a
feathered neutral core — a hard mask edge reads as a stroke.

**Film player.** Letterbox, poster → play, hairline progress, timecode, mute
toggle. **Native `<video>` underneath** so keyboard and assistive tech get the
real element. A live timecode HUD reading off the actual element sells "graded
master" better than any static overlay.

**Normalize third-party logos.** They arrive in clashing colors and lockups.
Pre-composite onto an identical canvas, then render as a **CSS mask** rather than
`<img>`: the file supplies the silhouette, the color underneath is yours to
animate — muted in the row, flooding to the owner's brand color on hover. One
asset, no crossfade. Where a client's real lockup doesn't exist in the capture,
use a typographic tile rather than a bad trace.

**Marquees.** Render the list twice, translate exactly `-50%` — the seam lands on
an identical frame. Drive with a CSS animation (constant rate, no per-frame cost)
and steer speed via `animation.playbackRate`: a control knob, not a transform
rewrite, so the loop never leaves the compositor.

**Scroll-linked drawing.** Generate paths from measured layout
(`ResizeObserver`, so it re-lays when images load), never hardcoded coordinates.
Quantize the animated value (`Math.round(v * 250) / 250`) so a section-sized SVG
repaints a few hundred times across the whole scroll instead of every frame.

**Compositing real scanned assets.** Layer order matters (envelope back → letter
→ envelope front). Scanned halves rarely align pixel-perfectly: growing the front
pane ~2.5% covers the back layer's edge everywhere, leaving only what's *supposed*
to show. Expect to fudge; document the fudge.

**Per-client theming.** Tint a section toward a client's world while staying in
the system: `wash` (background), `accent` (replaces the house accent locally),
and **`inkOn` — a guaranteed-contrast text color for that wash.** Never let a
client tint set text color implicitly.

**Forms without a backend.** Both sites compose a structured `mailto:` — no
server to stand up, and the client keeps the email workflow they already had.
Perfectly legitimate for a brochure site.

**Media discipline.** Gate every background video behind `IntersectionObserver` —
play on enter, pause on exit. Never decode offscreen video.

---

## 9. Accessibility floor

Non-optional:

- Contrast per §2 and the brand tables in Part II.
- Per-word/letter animated headings need an `sr-only` copy of the full string;
  animated glyphs get `aria-hidden`.
- Every icon-only control gets `aria-label`. Decorative SVG gets `aria-hidden`.
- Visible focus states; never `outline: none` without a replacement.
- Custom media players wrap **native elements**, never replace them.
- Modals: `role="dialog"`, `aria-modal`, Escape closes, backdrop click closes,
  body scroll locks and **unlocks on unmount**.
- Skip link to `#main`.
- `scroll-behavior: smooth` must be reverted to `auto` under reduced motion.
- Semantic landmarks, honest heading order.

---

## 10. Performance budget

- **~1MB or less** for a landing page. Reference: Twin Fins ships 1.06MB, TTFB
  64ms, FCP 416ms, fully loaded 440ms.
- Video: scale ≤1600px wide, CRF 26–30, `-movflags +faststart`, strip decorative
  audio. A 4K source at 3MB becomes ~170KB.
- Images through the framework optimizer; declare every quality level used.
- Third-party scripts load **on interaction**, not on page load.
- No unthrottled layout reads on scroll (§4.1).
- Pin `browserslist` (`chrome ≥111, edge ≥111, safari ≥16.4, firefox ≥128`) so
  modern CSS (`oklch`, `overflow: clip`, `color-mix`) compiles predictably.

---

## 11. Attribution & legal hygiene

- **Nominative fair use:** naming a venue or client to say "we worked here" is
  allowed, but you must disclaim affiliation. **Generate the disclaimer from the
  same data that renders the logos**, so it can't drift out of sync when someone
  adds a client.
- Fan/tribute work: name the trademark holder explicitly; state no affiliation,
  sponsorship, or endorsement.
- Be honest about assets you didn't make. Using a rights-holder's actual audio or
  artwork is a **copyright** question, not a trademark one — a disclaimer doesn't
  fix it.
- Never fabricate testimonials, ratings, press, or client lists. If a fact can't
  be sourced, it doesn't ship. Interpolated data is labeled as interpolated
  (§5.2).

---

## 12. Voice & code conventions

**Voice.** Specific beats generic — real dates, real numbers, real gear. Tease,
don't spoil, when the reveal is the product. Short declaratives; cut adjectives
before nouns. No exclamation-mark enthusiasm; the design carries the energy.

**Code.**
- CSS Modules per component; tokens in one `globals.css`.
- **Comment the why, never the what.** Every non-obvious rule carries the reason
  it exists — usually the bug that caused it. That is what makes the system
  survivable by the next person, human or agent.
- No magic numbers. Unusual value → name the constraint in a comment.
- Content in one data module, not scattered through components.
- Types on data structures; no `any`.
- Typecheck **and** production-build before pushing. A dev server passing is not
  evidence the build passes.

---

# PART II — BRAND IMPLEMENTATIONS

## 13. Twin Fins Coffee

Beach/surf, warm, hand-made. Navy + cream sampled from the palm monogram, teal
from a turtle photograph, caramel from an espresso pour.

```css
--navy: #2a3947;  --navy-deep: #1b2933;  --navy-soft: #3f5265;
--cream: #eee9d7; --bone: #f7f3e9;       --sand: #d9c3a8;
--sea: #75c1b3;   --sea-deep: #26695f;   /* ON DARK / ON LIGHT — not interchangeable */
--caramel: #9b6d4d;  --espresso: #4a3426;
--muted: #5b6a76;    --surface: #ffffff;
--hairline: rgba(42,57,71,0.16);  --hairline-dark: rgba(238,233,215,0.2);
```

| Foreground | Background | Ratio | Body | Large |
|---|---|---:|:--:|:--:|
| navy | bone | **10.68** | ✅ | ✅ |
| navy | cream | **9.73** | ✅ | ✅ |
| navy | white | **11.83** | ✅ | ✅ |
| navy | sand | **6.94** | ✅ | ✅ |
| espresso | bone | **10.47** | ✅ | ✅ |
| muted | bone | **5.03** | ✅ | ✅ |
| sea-deep | bone | **5.80** | ✅ | ✅ |
| cream | navy | **9.73** | ✅ | ✅ |
| cream | navy-deep | **12.24** | ✅ | ✅ |
| cream | navy-soft | **6.63** | ✅ | ✅ |
| sea | navy | **5.65** | ✅ | ✅ |
| sea | navy-deep | **7.11** | ✅ | ✅ |
| sand | navy | **6.94** | ✅ | ✅ |
| **caramel** | **bone** | **4.04** | ❌ | ✅ |
| **caramel** | **navy** | **2.64** | ❌ | ❌ |

Signatures: extruded slab headlines (§3.5), liquid-glass nav with runtime tone
sampling, CSS-mask logo wall, scroll-drawn SVG trails.

## 14. Drift Digital Media

Legacy brand, engraved plate. Ink on ivory, one bronze accent, mono reserved for
film metadata, near-black sections for anything playing footage.

```css
--ink: #191b1c;      --ink-deep: #101213;   /* cinema sections */
--ivory: #f2eee3;    --ivory-dim: #e7e1d1;  /* alternating band */
--bronze: #96793f;   --bronze-deep: #7c6132;
--text: #23262a;     --muted: #5c6165;
--text-dark: var(--ivory);  --muted-dark: #b9b4a4;
--hairline: rgba(25,27,28,0.14);  --hairline-dark: rgba(242,238,227,0.16);
--radius: 10px;      --radius-sm: 6px;
```

| Foreground | Background | Ratio | Body | Large |
|---|---|---:|:--:|:--:|
| ivory | ink-deep | **16.20** | ✅ | ✅ |
| ivory | ink | **14.91** | ✅ | ✅ |
| text | ivory | **13.11** | ✅ | ✅ |
| text | ivory-dim | **11.64** | ✅ | ✅ |
| muted-dark | ink-deep | **9.06** | ✅ | ✅ |
| muted-dark | ink | **8.34** | ✅ | ✅ |
| gold `#b3852f` | ink-deep | **5.65** | ✅ | ✅ |
| gold `#b3852f` | ink | **5.20** | ✅ | ✅ |
| muted | ivory | **5.40** | ✅ | ✅ |
| bronze-deep | ivory | **5.01** | ✅ | ✅ |
| muted | ivory-dim | **4.80** | ✅ | ✅ |
| bronze | ink-deep | **4.57** | ✅ | ✅ |
| **bronze-deep** | **ivory-dim** | **4.45** | ❌ | ✅ |
| **bronze** | **ink** | **4.20** | ❌ | ✅ |
| **bronze** | **ivory** | **3.55** | ❌ | ✅ |

Type: Cormorant 600 display (`line-height: 0.98`), `.brandcaps` at `0.26em`,
`.eyebrow` serif caps at `0.3em` in bronze-deep, `.mono` at `0.72rem`/`0.18em`
**for timecodes and reel numbers only**.

Signatures: letterboxed film player with live timecode, wax-seal opening letter
(seal cracks off on scroll, letter rises between scanned envelope halves), film
grain, engraved fleuron marquee, per-client chapter theming, validator-passed
chart gold.

---

# PART III — TRAPS & CHECKLIST

## 15. Known traps

Real failures from real builds. An agent working in this system will hit these.

1. **Inline animated transforms silently replace stylesheet transforms.** An
   element centered with `transform: translateX(-50%)` loses centering the instant
   an animation writes `transform: scale()`, and jumps half its width. **Center
   with `margin` when the transform is animated.**
2. **Never transition `backdrop-filter`.** Some engines drop the filter entirely
   mid-transition — nav text then collides with page text through clear glass.
3. **React StrictMode invokes state updaters twice.** Side effects inside an
   updater (playing a sound, incrementing a counter) fire twice. Effects belong in
   the effect, not the updater.
4. **Floating-point differs between Node and browser engines.** `Math.cos()` in
   SSR'd SVG produces a hydration mismatch on the last digit. Round computed
   geometry: `Math.round(v * 100) / 100`.
5. **Safari serializes `color-mix()` as `color(srgb …)`.** See §4.1.
6. **`backdrop-filter` order matters.** Displacement before blur, or the warp is
   invisible.
7. **`drop-shadow()` inside `overflow: hidden` reveal masks renders nothing.**
   See §3.5.
8. **Word masks shear descenders if the clip never releases.** See §3.4.
9. **`elementFromPoint` catches your own bar** if you hide it with
   `pointer-events` instead of `visibility`. See §4.1.
10. **Scanned asset halves don't align.** Scale the front layer ~2.5% to cover the
    back's edge. See §8.
11. **Third-party embeds:** a "helpful" option like iframe-resizer's
    `bodyBackground: transparent` overrides the embed's own working styles and
    lets your page bleed through. Load the embed top-level first to see it
    unaided, then add only what's missing. Also set a CSS `min-height` floor — a
    client-rendered embed measured before it mounts reports near-zero height and
    freezes there.
12. **User preferences must persist and must not leak.** A mute toggle should
    survive replays (`sessionStorage`), but one feature's mute must not silence an
    unrelated feature. Separate sound sources are separate preferences.
13. **Timed reveals: 6 seconds is too long.** Users leave. ~1.8s is the ceiling
    for anything that must be noticed.
14. **Browser-automation screenshots lie.** Pre-paint captures come back blank or
    stale. Trust measured DOM geometry and computed styles over a screenshot.
15. **Don't trust a dev server for CSS specificity.** Verify computed styles in
    the browser; a rule that "should" win often doesn't.

## 16. Review checklist

- [ ] Every text/background pair checked against the brand table — **no metallic
      accent on body text**, and accents verified on the *alternating* band too
- [ ] Two-variant accents: correct variant for the ground
- [ ] Text over media has a measured scrim, verified on the **brightest** frame
- [ ] Translucent surfaces tested over both light and dark sections
- [ ] `backdrop-filter` is not transitioned
- [ ] Chart series colors pass chroma/lightness/contrast; labels use text tokens
- [ ] Any interpolated or estimated data is labeled; sources printed
- [ ] `prefers-reduced-motion` produces a finished-looking still; smooth scroll
      reverts to auto
- [ ] Keyboard: focus visible, tab order sane, Escape closes overlays
- [ ] Icon-only controls have `aria-label`; decorative SVG `aria-hidden`
- [ ] Animated headings have an `sr-only` full-text copy; word masks release
- [ ] Custom players wrap native elements
- [ ] Offscreen video paused; heavy scripts deferred to interaction
- [ ] Page weight ≤ ~1MB; no unthrottled layout reads on scroll
- [ ] Third-party marks disclaimed from the same data that renders them
- [ ] `tsc --noEmit` clean **and** production build passes
- [ ] Mobile checked at 375px, not a narrowed desktop window
