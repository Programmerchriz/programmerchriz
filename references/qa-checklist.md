# UI QA Checklist

Use this before calling the design finished.

## Hierarchy
- Can a new user identify the primary message/task in under a few seconds?
- Are dominant, supporting, and metadata levels visibly different?
- Is any copy competing unnecessarily?
- Is important type too small on tablet/desktop?

## Content truth
- Is every metric real?
- Is every screenshot/thumbnail real?
- Are names/labels from the actual product?
- Did any placeholder or generated filler survive?
- Did inspiration become copying?

## Layout
- Does the composition still work with long titles?
- Does it work with missing metadata?
- Do controls stay out of content?
- Are cards/grids doing real work?
- Is spacing consistent without feeling mechanically uniform?

## Mobile
Test at narrow widths, including around 320px.

Check:
- no horizontal overflow;
- safe areas;
- touch targets;
- text legibility;
- media width;
- one-handed reach where relevant;
- no desktop-only assumptions;
- scroll remains uninterrupted;
- modals fit the viewport;
- fixed controls do not obscure content.

## Desktop/tablet
Check:
- type is not timid;
- layout is not excessively sparse;
- cards are not unnecessarily small;
- active states are visible;
- there is enough room for content to feel premium.

## Interaction
Verify:
- hover;
- focus-visible;
- pressed;
- active/selected;
- disabled;
- loading;
- success;
- error.

Keyboard:
- logical tab order;
- no focus traps except deliberate modal traps;
- Escape closes modal/dialog when expected;
- visible focus.

## Motion
- motion has a reason;
- no scroll interference;
- no long delays;
- reduced-motion mode works;
- media continuity is preserved where applicable.

## Theme
If light/dark exist:
- both have real contrast;
- neither feels like an afterthought;
- icons/media remain legible;
- surfaces and overlays adapt correctly.

## Technical verification
Run available:
- format;
- lint;
- typecheck;
- unit tests;
- smoke tests;
- production build;
- browser checks;
- responsive screenshots.

Inspect the actual rendered result. Source code passing is not sufficient for subjective visual quality.
