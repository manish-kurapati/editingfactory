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
- The Adobe product icon PNGs in `public/logos` were converted from Adobe-hosted SVG assets. The DaVinci Resolve PNG was converted from [Blackmagic Design's press logo](https://www.blackmagicdesign.com/media/images/davinci-resolve-logo-square), and the Final Cut Pro PNG comes from [Apple's App Store listing](https://apps.apple.com/us/app/final-cut-pro/id424389933).
- Package details in `data/content.ts` follow `Editing Factory Packages.docx`.
- Replace portfolio preview spaces with approved project videos when they are supplied.
- The Contact form opens WhatsApp with a prefilled project enquiry to +91 95055 55277. The visitor reviews and sends the message in WhatsApp.
