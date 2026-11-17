# Responsive and Interaction Rules

## Mobile is not desktop at 60%

Design mobile as its own composition.

Common rules:
- one strong column;
- useful media width;
- compact metadata;
- clear touch targets;
- fewer persistent controls;
- safe-area awareness;
- no tiny desktop typography squeezed into mobile.

For media feeds, prefer one media item per row when that gives the work enough presence.

## Tablet and desktop

Do not undersize type, cards, and spacing on larger screens.

At ordinary laptop widths:
- fewer, wider columns can be stronger than many small cards;
- labels and controls should feel confident;
- active state should be obvious;
- content should have room to breathe.

## Touch and scrolling

Scrolling is a primary interaction.

Never let:
- idle animations;
- draggable mascots;
- hover mechanics;
- swipe gestures;
- floating interactions

fight the user's vertical scroll.

On touch devices:
- distinguish scroll from swipe;
- stop nonessential motion while the user is actively scrolling when appropriate;
- avoid accidental activation;
- use at least practical touch targets around 44px for key controls.

## Interaction states

Important interactive elements should account for:
- default;
- hover;
- focus-visible;
- pressed;
- selected/active;
- disabled;
- loading;
- success;
- error.

Hover is enhancement, not required functionality.

## Motion

Motion should explain:
- change;
- direction;
- state;
- continuity;
- cause/effect.

Good:
- restrained opacity/transform;
- tactile press;
- contextual hover;
- stable modal transition;
- playful editorial motion tied to the story.

Bad:
- every card floating;
- every icon spinning;
- decorative parallax on routine screens;
- motion that delays task completion;
- motion that breaks scrolling.

Respect `prefers-reduced-motion`.

## Media continuity

If the product contains video/audio/media, preserve continuity when possible across:
- feed;
- detail;
- navigation;
- tabs.

Do not restart media unnecessarily because the UI remounted it.

## Overlays and modals

A modal should:
- feel anchored to the current page;
- preserve page context behind it;
- lock or manage background interaction correctly;
- trap focus;
- close with Escape when appropriate;
- work cleanly on mobile.

Blur/frost is appropriate when it strengthens this "never left the page" feeling.
