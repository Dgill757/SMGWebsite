# Premium Demo Generator Upgrade

- Replaced the legacy generator that fabricated testimonials, BBB ratings, guarantees, certifications, project counts, hours, and response-time promises.
- Added extraction of real image and logo candidates from Firecrawl output, including relative image URLs.
- Routed brand extraction and audit writing through the configured provider router; deterministic evidence-safe fallbacks keep preview building available during provider outages.
- Added three design directions and a responsive premium layout with source-first imagery, accessible mobile navigation, restrained scroll reveals, and reduced-motion support.
- Added a visible concept disclaimer and clear labels for curated concept imagery.
- Made the preview estimate form inert so it cannot send prospect/customer information.
- Added a deployment quality gate and generator regression tests.
- Updated the SummitOS Demos interface. Delivery remains disabled and outreach remains paused.
- Rendered desktop and narrow-screen QA captures locally. Corrected preview/navigation overlap and narrow-screen stat layout discovered during rendering.
- End-to-end QA found Vercel's generated deployment URL was authentication-protected. Further QA exposed Vercel alias truncation and that aliases live on the project's production target rather than the initial deployment record. The deployer now reads that authoritative alias, probes it anonymously before returning, and fails explicitly on Vercel API or public-alias errors.
- Production timing QA showed a newly created public alias can take more than 60 seconds to route after the deployment reports ready. The readiness gate now allows 180 seconds and never publishes a dead link prematurely.
- Repeat-build QA confirmed the create-deployment response can contain protected aliases. Those are now ignored; only aliases from the project's production target are eligible for delivery.
