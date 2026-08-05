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
- End-to-end QA found Vercel's generated deployment URL was authentication-protected. A second QA build exposed Vercel alias truncation. The deployer now reads the actual production alias, probes it anonymously before returning, and fails explicitly on Vercel API or public-alias errors.
