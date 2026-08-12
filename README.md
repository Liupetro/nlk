# NLK — Aluminum Precision Die Casting

Premium multi-page B2B manufacturing website for high-pressure aluminum die casting.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · React Three Fiber · Lucide icons

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve production build
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — motion Hero + 3D casting installation, trust, previews |
| `/capabilities` | Full capabilities / services |
| `/industries` | Industries & applications |
| `/process` | How we work + project estimator |
| `/about` | Company, pillars, why us, stats |
| `/projects` | Case studies / products, testimonials, insights |
| `/contact` | Contact form & details |

## Languages (EN / RU)

Full bilingual UI with a language switcher in the header and footer.

| Action | Result |
|--------|--------|
| Click **RU** | Entire site switches to Russian |
| Click **EN** | Entire site switches to English |
| Preference | Saved in `localStorage` (`nexcast-locale`) |

### Content file (single source of truth)

```
src/lib/content.ts   # ALL texts: EN + RU dictionaries, types, helpers
```

## Structure

```
src/
  app/
    layout.tsx          # Root: fonts, LanguageProvider, metadata
    (site)/
      layout.tsx        # Header + Footer shell
      page.tsx          # Home
      capabilities/
      industries/
      process/
      about/
      projects/
      contact/
  components/
    layout/             # Header, Footer
    sections/           # Page sections
    three/              # R3F Hero scene
    motion/             # PageHero, Parallax
    ui/                 # Button, Reveal, etc.
  lib/
    content.ts
```

## Hero 3D

Home Hero uses React Three Fiber (`src/components/three/`) with a procedural die-cast assembly:

- Mouse tilt (lerp)
- Scroll-linked rotation / scale
- Idle spin + orbiting satellite parts
- Paused when off-screen; respects `prefers-reduced-motion`

## Design notes

- Dark cinematic hero + clean light content sections + dark capability/CTA blocks
- Accent: electric cyan/teal (`--accent`) on charcoal — edit in `src/app/globals.css`
- Optional Zamak gold highlight (`--zamak`)
- Scroll reveals via Framer Motion
- Project Estimator is an interactive demo on `/process`

## Forms

Contact and estimator forms currently capture data client-side for demo only. Connect to your API / Formspree / CRM.

## License

Private project scaffold — replace brand assets and legal copy before go-live.
