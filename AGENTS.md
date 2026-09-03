# GGames — UI rules

Before creating or changing any visual component, read `DESIGN.md` in full and use it as the source of truth.

- Use Inter, Paper White surfaces, True Black body text, Ink Black filled actions, and Mint Green (`#0c8c5e`) only for functional accents. Honour `prefers-color-scheme`: in dark mode, use near-black canvas, restrained dark surfaces, light text, and the same Mint Green functional accent.
- Keep buttons and inputs at 4px radius; cards at 16px; large containers at 24px. Do not use pill shapes, gradients, glass effects, or colored shadows.
- Use the specified spacing, typography, borders, and restrained shadows. Semantic success/error feedback may use subdued green/red only for game outcomes.
- Build accessible, keyboard-operable UI; honour `prefers-reduced-motion` for every animation.
