---
name: chris-ui-design
description: Apply Chris's learned product UI style: editorial and architectural, product-first, premium neutral, information-dense without crowding, strong hierarchy, real product imagery, deliberate mobile behavior, restrained motion, factual copy, and no generic AI-startup aesthetics.
---

# Chris UI Design

Use this skill when designing, redesigning, auditing, or implementing product UI in Chris's visual language.

This is not a generic "make it pretty" skill. It encodes recurring design decisions Chris has repeatedly enforced across portfolio, analytics, marketplace, social, media, hiring, and utility products.

## Core intent

The interface should feel designed by someone who understands the product, not decorated by someone who found a trend.

Aim for:
- editorial confidence;
- architectural structure;
- premium restraint;
- product-first composition;
- strong hierarchy;
- useful density without crowding;
- real visual proof;
- fast, quiet interactions;
- deliberate mobile behavior.

The content and product should dominate. The surrounding UI should recede.

## Non-negotiables

### 1. Start with the real product
Inspect the actual product, data, workflow, constraints, and current UI before designing.

Do not invent fake metrics, fake labels, fake journeys, fake product states, fake thumbnails, or generic dashboard content merely to make a composition look complete.

If a product has real names, screens, categories, states, data, or workflows, use those.

### 2. Hierarchy before decoration
Fix reading order with:
1. type scale;
2. spacing;
3. alignment;
4. contrast;
5. density;
6. imagery;
7. borders/surfaces.

Do not reach for gradients, glows, glass, shadows, pills, or cards before the hierarchy works without them.

### 3. Product-first, not theme-first
Do not make every product look the same.

Keep the same design taste while adapting to the product:
- portfolio/editorial pages can be more typographic;
- dashboards should be denser and quieter;
- media products should let media dominate;
- workflow tools should prioritize task clarity and stable action placement;
- playful motion is acceptable when it adds narrative, not decoration.

### 4. Reference is inspiration, not a stencil
When given a reference:
- identify the underlying composition, hierarchy, density, motion, or interaction idea;
- preserve only what solves the current product problem;
- change placements, styling, proportions, and details so the result is not a copy;
- do not copy another product's UI language wholesale.

Never reproduce someone else's layout just because it was supplied as inspiration.

### 5. Use real visuals
Prefer:
- real product screenshots;
- actual media;
- real avatars/logos;
- actual charts/data;
- real product states.

Do not fabricate thumbnails, fake app screenshots, stock UI, AI-looking filler graphics, or decorative collages.

If a trustworthy visual does not exist, leave the area text-only rather than inventing one.

### 6. Copy must sound human and factual
UI copy should be:
- short;
- literal;
- specific;
- useful;
- outcome-led;
- source-first.

Prefer facts, numbers, product behavior, and concrete consequences over adjectives.

Avoid vague copy such as:
- "Unlock inspiration";
- "Supercharge your workflow";
- "AI-powered insights";
- "Next-level";
- "Seamless experience".

Do not make the user read five competing messages at once.

## Design method

### Step 1 — Audit
Before changing the interface, identify:
- the primary job of the screen;
- the primary action;
- the most important proof or visual;
- current hierarchy problems;
- content density problems;
- mobile failure points;
- interaction/state gaps;
- what must remain unchanged.

### Step 2 — Choose the screen mode
Use the closest mode:

**Editorial / portfolio**
- strong type-led hierarchy;
- restrained metadata;
- real project proof;
- large visual moments separated by breathing room.

**Product landing**
- clear problem/outcome;
- one dominant claim;
- compact support copy;
- real product UI as proof;
- concise CTA.

**Dashboard / analytics**
- useful density;
- real labels;
- quiet chrome;
- clear primary/secondary metrics;
- no decorative dashboard cards.

**Media / inspiration**
- media dominates;
- metadata stays compact;
- fewer columns at ordinary widths;
- full-width or near-full-width mobile media;
- preserve media continuity.

**Workflow / utility**
- task clarity first;
- stable action placement;
- controls never cover important text;
- destructive and secondary actions clearly separated;
- predictable progress and error states.

### Step 3 — Establish hierarchy
Build a hierarchy with at least three readable levels:
- dominant;
- supporting;
- metadata.

On large screens, do not undersize everything in the name of minimalism.

On mobile, do not simply shrink desktop. Recompose the screen.

### Step 4 — Apply Chris's visual language
Read:
- `references/style-language.md`
- `references/layout-hierarchy.md`

### Step 5 — Build responsive and interaction behavior
Read:
- `references/responsive-interaction.md`

### Step 6 — Remove generic UI slop
Read:
- `references/anti-slop.md`

### Step 7 — Verify
Read:
- `references/qa-checklist.md`

Do not call a UI finished from source code alone when browser verification is available.

## Implementation discipline

Prefer one canonical component/style path.

Avoid:
- duplicate responsive markup unless necessary;
- patch-layer CSS;
- broad substring selectors;
- specificity wars;
- excessive `!important`;
- magic offsets used to fake alignment;
- decorative JS;
- unnecessary client state;
- interaction logic that breaks scrolling.

Preserve semantics, keyboard access, focus visibility, theme parity, safe areas, reduced motion, and stable layout.

## Default completion standard

A design is not complete until:
- its hierarchy is obvious at a glance;
- content is not crowded;
- mobile is intentionally composed;
- visuals are real;
- required states exist;
- interactions do not fight scrolling;
- the UI works in the actual product context;
- no generic AI/startup visual language has slipped in;
- browser QA confirms the result.
