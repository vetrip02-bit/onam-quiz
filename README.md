# 🌼 Onam Quiz

A festive 10-question quiz about Kerala's Onam festival, built with **plain HTML, CSS and vanilla JavaScript** — no React, no Bootstrap, no Tailwind, no jQuery, no build step.

Open `index.html` in any browser to play.

## Features

- **Three screens** — welcome, quiz and results — switched entirely in JavaScript, with no page reloads
- **10 questions** covering Mahabali, Pookalam, Onam Sadya, Vallam Kali, Thiruvonam, Pulikali and more
- **Progress tracking** — question counter, live percentage and an animated progress bar
- **No spoilers** — your pick is recorded but never marked right or wrong during the quiz
- **Arrow navigation** — `← Previous` revisits earlier questions with your answer restored; `Next →` unlocks only after you answer
- **Results screen** — a CSS score ring, a message based on your score band, and falling flower petals
- **Show Answers** — the full review of all 10 questions stays hidden until you ask for it
- **Play Again** — resets score, answers and progress without reloading the page

## Design

- Light green Onam theme with gold accents, defined as CSS variables
- Pookalam and score ring drawn with `conic-gradient` — no image files anywhere
- Poppins (self-hosted in `fonts/`) for questions and buttons; a decorative face for headings
- Responsive: two-column answers on wide screens, single column and full-width buttons on mobile

## Accessibility

- Real `<button>` elements throughout, so keyboard navigation works
- Visible focus outlines, `aria-live` status messages, `aria-expanded` on the answers toggle
- Results never rely on colour alone — ✓ / ✕ icons and text as well
- Honours `prefers-reduced-motion`

## Files

```
index.html   structure — three screens, no inline CSS or JS
style.css    theme, layout, animations, responsive rules
script.js    quiz data, state, and all behaviour
fonts/       self-hosted Poppins (works offline)
```
