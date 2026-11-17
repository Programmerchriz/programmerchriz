# Step 2 review — projects, case studies and engineering impact

Step 2 is implemented. Step 3 has not been started. No commit, push or deployment was performed.

Step 1 is already committed as `b20c183`; its full message is saved in [STEP-1-COMMIT.txt](STEP-1-COMMIT.txt). The proposed Step 2 message is [COMMIT.txt](COMMIT.txt).

## Review the visual work

- [Homepage projects, dark](homepage-projects-dark.png)
- [Homepage projects, light](homepage-projects-light.png)
- [Homepage projects, mobile dark](homepage-projects-mobile-dark.png)
- [Selected Impact, dark](homepage-impact-dark.png)
- [Selected Impact, light](homepage-impact-light.png)
- [SwiftTopUp introduction, dark](swifttopup-desktop-dark.png)
- [SwiftTopUp introduction, light](swifttopup-desktop-light.png)
- [SwiftTopUp complete mobile page](swifttopup-mobile-dark.png)
- [SwiftTopUp architecture](swifttopup-architecture-dark.png)
- [Gallery with captions and controls](swifttopup-gallery-light.png)

Section-only exports hide floating navigation during capture so it does not cross the exported section. The normal viewport screenshots include the working header. Original product screenshots are copied unchanged.

The homepage has a full-width SwiftTopUp feature and four compact project cards. Review the description length, image presentation, impact hierarchy and mobile spacing. Inside the case studies, review the readable full-image gallery, contribution/status labels, section navigation, architecture detail, outcomes and evidence notes.

## Routes and content

Published routes, in featured order:

1. `/projects/swifttopup`
2. `/projects/vehicle-license-app`
3. `/projects/career-guidance-app`
4. `/projects/cryptocurrency-finance-app`
5. `/projects/inventory-management-app`

All existing slugs remain unchanged. Edit `order` in `lib/data/projects.ts` to change the homepage order. Repository entries are individually labeled; the public/private union requires a public URL and forbids private URLs. SwiftTopUp has three private-source labels and one public website action.

SwiftTopUp's six architecture topics cover the modular monolith and API/worker processes, wallet/concurrency, verified funding/idempotency, durable fulfillment/refunds/reconciliation, durable messaging/completion notifications and Redis optimization/recovery tradeoffs. Public/affiliate and admin React applications, supported services, optional AI interpretation and provider configuration limits are described separately from financial authorization.

## Evidence-qualified copy

- **Redis:** 212.9 → 28 commands/minute. The lower observation records 280 commands over ten minutes. The calculated reduction is approximately 86.8%, with proportional command-based Upstash cost reduction at the same unit rate. This does not claim a measured whole-month bill or an 86.8% reduction in all infrastructure costs.
- **Vehicle Recognition:** approximately 20% faster OCR, from roughly 16 seconds to under 13, is identified as CV-reported rather than an independently reproduced benchmark.
- **Career Compass:** saved progress addresses the CV-reported interrupted-assessment problem. No numerical conversion or completion-rate improvement is invented.
- **Coin Global / Inventory Management:** outcomes describe documented functionality. No adoption, revenue or operational savings figures are introduced.
- **SwiftTopUp imagery:** public-site chat content is identified as an illustration. Affiliate workspace figures are not presented as evidence of adoption.
- **SwiftTopUp operation:** source-supported capabilities are distinguished from verified live service. The supplied sandbox report updated 16 November 2026 did not complete authentication. The page does not claim verified end-to-end live funding/fulfillment, production transaction volumes, financial certification or exactly-once external messaging.

## Validation

Static checks passed:

```sh
node scripts/check-project-content.mjs
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

Lint has zero errors and nine pre-existing unused-variable/import warnings in contact, experience, footer, particles, reviews and skills. There are no new Step 2 lint warnings.

The focused content script checks stable slugs/order, local screenshot files, mixed public/private repository rendering, omission of stale private URLs, absent actions/media, a single-image gallery, social metadata fallbacks and the Redis calculation.

Firefox against the production build passed:

- Direct navigation and reload of all five project routes in both themes, with saved theme persistence.
- Fifty project combinations: five routes × two themes × 320, 390, 768, 1024 and 1440px. No horizontal page/main overflow after fonts and resize layout settled. [Route matrix](route-matrix.json)
- Ten corresponding homepage theme/width combinations. No horizontal overflow. [Homepage checks](homepage-review.json)
- Correct page titles, descriptions, canonical URLs and social images for each project; every case-index destination exists.
- Unknown project paths return HTTP 404 and display the existing not-found interface.
- A fresh-server check confirmed HTTP 200 for SwiftTopUp and HTTP 404 with normal not-found content for an unknown slug. Next.js 16.2.3 also logs `Internal: NoFallbackError` for that rejected dynamic path. The internal error is not exposed in the response. This framework log remains; no dependency or framework patch was introduced.
- All existing public repositories render as links; SwiftTopUp renders three noninteractive private labels with no repository links. A mixed-visibility fixture is exercised by the content script.
- Manual-default gallery, wraparound, Home/End/arrows, thumbnail choice, keyboard scope, opt-in playback, pause, hover pause, reduced motion and full-size original viewing.
- Synthetic horizontal touch navigation, vertical-scroll preservation and ignored multi-touch input. Physical mobile devices were not available.
- Injected image failure produces a readable fallback and the next screenshot still loads. Routing was restored after this check. [Gallery checks](gallery-checks.json)
- Cross-page project navigation and Selected Impact links leave targets 104px below the viewport top at the tested desktop width, clear of the 80px header.
- Actual CV download retains `Chris-Nwachukwu-CV.pdf`.
- No runtime or console errors during the final route matrix. Deliberately failed image requests in the recovery test are expected.

Read-only HTTP verification returned 200 for all five project websites and six public repository destinations. This verifies destinations, not authenticated workflows or provider operations. [External checks](external-links.json)

## Modified files

Source:

- `app/globals.css` — import the canonical project stylesheet.
- `app/projects.css` — theme-aware impact, cards, case studies, galleries and responsive layouts.
- `app/projects/[slug]/page.tsx` — shared case study, section navigation and static route boundary.
- `components/Home/Home.tsx` — compose Selected Impact near the top.
- `components/Hero/CredibilityStrip.tsx` — update the comment to reference the completed impact section.
- `components/Projects/Projects.tsx` — server-rendered, explicitly ordered project cards.
- `components/Projects/SelectedImpact.tsx` — linked, contextual results.
- `components/Projects/ProjectLinks.tsx` — independent public/private repository presentation.
- `components/Projects/ProjectGallery.tsx` — manual-first media controls and fallbacks.
- `lib/data/projects.ts` — extended typed model and evidence-qualified project content.
- `lib/project-metadata.ts` — canonical/social metadata and image fallback.
- `scripts/check-project-content.mjs` — focused content/rendering checks without new dependencies.

Assets: `public/images/swifttopup/website.png`, `how-it-works.png`, `services.png` and `affiliate.png`.

Review records are under `output/playwright/step-2/`. The already-modified `other-imp-docs/PHASES.md` was left untouched by this step. Dependencies, CV text and the downloadable PDF were not changed.

## Remaining content limits and approval boundary

The owner can update SwiftTopUp's provider activation and full live-journey status when those have been verified. Additional adoption figures, controlled benchmarks or monthly invoice comparisons would need supporting evidence before publication. No content question blocks review of this implementation.

Experience, skills, contact/footer polish, full-site heading/metadata audit and `PORTFOLIO-OVERVIEW.md` remain Step 3 work. Review Step 2 before authorizing that stage.
