# Editing Factory website

Responsive Next.js website for Editing Factory. The seven pages are Home, Services, Packages, Portfolio, About, Process, and Contact.

## Run locally

```sh
npm install
npm run dev
```

The production site is a static export: `npm run build` writes `out/`.

## Update content

- Edit service and package details in `data/content.ts`.
- Replace the temporary `Brand` component in `components/site-page.tsx` with the original logo when it is supplied.
- Replace portfolio placeholders with real client videos when they are supplied.
- Add an approved business contact address or endpoint before enabling direct form submission.
