# Editing Factory website

Responsive Next.js website for Editing Factory. The seven routes are Home, Services, Packages, Portfolio, About, Process, and Contact.

## Run locally

```sh
npm install
npm run dev
```

The production build is a static export: `npm run build` writes `out/`.

## Update content

- Edit service and package details in `data/content.ts`.
- The supplied logo is in `public/logos/editing-factory.png` and used across the site.
- The Adobe product icon PNGs in `public/logos` were converted from Adobe-hosted SVG assets.
- Replace portfolio preview spaces with approved project videos when they are supplied.
- Add a business contact address or endpoint before enabling direct form submission.
