# ECFC Fast Feet Training PWA

A mobile-friendly Progressive Web App for ECFC players to practice soccer skills at home.

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Customization Guide

### Adding YouTube Videos

Edit `src/App.jsx` and find the `skills` array at the top. Add YouTube video IDs to each skill:

```javascript
{
  id: 1,
  name: "Toe Taps",
  icon: "👟",
  youtubeId: "ABC123XYZ", // <- Add your YouTube ID here
},
```

**To get a YouTube video ID:**
- From URL: `https://www.youtube.com/watch?v=ABC123XYZ`
- The ID is: `ABC123XYZ`

### Adding More Skills

Add new entries to the `skills` array:

```javascript
{
  id: 7,
  name: "New Skill Name",
  icon: "⚽", // Pick an emoji
  youtubeId: "your-video-id",
},
```

### Adding the Skills Guide PDF

1. Place your PDF file in the `public/` folder
2. Name it `skills-guide.pdf`
3. It will automatically be available!

### Replacing the Logo and Icons

Replace these placeholder files in the `public/` folder:

| File | Size | Purpose |
|------|------|---------|
| `ecfc-logo.png` | ~200x200px | Header logo |
| `pwa-192x192.png` | 192x192px | PWA icon (Android) |
| `pwa-512x512.png` | 512x512px | PWA splash icon |
| `apple-touch-icon.png` | 180x180px | iOS home screen icon |
| `favicon.ico` | 32x32px | Browser tab icon |

**Tip:** Use a tool like [favicon.io](https://favicon.io/) to generate all icon sizes from one image.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` folder, ready to deploy.

## Deploying

### Option 1: Netlify (Recommended - Free)
1. Push to GitHub
2. Connect to Netlify
3. Auto-deploys on every push!

### Option 2: Vercel (Free)
1. Push to GitHub
2. Import to Vercel
3. Done!

### Option 3: GitHub Pages
1. Add `base: '/repo-name/'` to vite.config.js
2. Run `npm run build`
3. Deploy the `dist/` folder

## PWA Features

- **Installable:** Players can "Add to Home Screen" on their phones
- **Offline Support:** After first load, the app works without internet
- **Fast:** Optimized for mobile devices

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- vite-plugin-pwa

## Colors

- ECFC Green: `#166534` (primary)
- ECFC Gold: `#fbbf24` (accent)
