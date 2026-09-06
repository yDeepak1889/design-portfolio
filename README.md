# Richa Chaturvedi — Portfolio

A single-page product design portfolio built from the "Website changes" Figma file.
No build step, no dependencies: plain HTML, CSS and a small progressive-enhancement script.

## Run locally

```sh
python3 -m http.server 4173
# open http://localhost:4173
```

Any static host works for deployment (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
Point it at the repo root.

## Structure

```
index.html          all content lives here, sections are commented
css/tokens.css      design tokens: colour, type scale, spacing, motion
css/styles.css      layout and components, references tokens only
js/main.js          optional enhancements (nav highlight, reveal, copy email, clock)
assets/work/        project images, 1152×896 (9:7)
assets/about/       portrait, 896×1152 (4:5)
assets/resume.pdf   add the resume here (linked from the About section)
```

## Editing content

Everything editable is in `index.html`.

| What | Where |
| --- | --- |
| Name, nav labels | `<header class="site-header">` |
| Headline, intro, location | `<section class="hero">` |
| Projects | `<ul class="work-grid">`, one `<li>` per project. Swap the image, client, year, title, tags and `href`. |
| Skills | `<ul class="skills-grid">` |
| Bio, recognitions, current role | `<section id="about">` |
| Email, social links | `<section id="contact">`. Update both the `mailto:` link and the `data-copy` attribute. |
| Footer time zone | `data-clock="Asia/Kolkata"` on the `<time>` element (any IANA zone). |

Section numbers (01–04) are static text in each `section__head`. Renumber if a section is added or removed.

## Design decisions

- **Type**: Cormorant Garamond (light/regular) for display, Inter for UI text. Fluid sizes via `clamp()` so the hero scales between 360px and 1440px without breakpoints.
- **Colour**: warm off-white ground, near-black ink, terracotta accent used sparingly for numbers, client names and calls to action.
- **Layout**: single 1440px container, hairline dividers, 2-up work grid collapsing to 1-up under 720px, 3-up skills, asymmetric about and contact splits.
- **Motion**: reveal-on-scroll, image scale on hover, arrow nudges. All disabled under `prefers-reduced-motion`.
- **Accessibility**: skip link, landmarks, visible focus rings, descriptive alt text, `aria-current` on the active nav item, live region for the copy confirmation.
- **Performance**: first project image is eager with `fetchpriority="high"`, the rest lazy-load. Images carry width/height to avoid layout shift. Fonts preconnected and swapped.
