# Editing Factory website

Responsive Next.js website for Editing Factory. Routes: Home, Services, Packages, Portfolio, About, How It Works / FAQs, Contact, Become an Editor, Privacy, Service Terms, Cancellation & Refunds, and File Handling.

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
- The portfolio plays six vertical reels listed in `data/portfolio-videos.ts`. Web-ready H.264 files live in `public/videos/portfolio/`, with matching poster frames in `public/videos/posters/`. Original uploads remain local and are ignored by Git; for future uploads, add only complete playable videos to the manifest and create a poster frame.
- The four policy pages follow the supplied policy documents. Contact placeholders are replaced with the known WhatsApp number and an on-page note that email, grievance contact and business address details are still pending.
- The client inquiry and editor application forms open WhatsApp with their answers addressed to +91 95055 55277. The visitor reviews and sends the message in WhatsApp. No form answers are stored by this static website.
- The testimonial wall contains clearly marked sample layout cards until verified client reviews are provided.
- Nine unique generated service images live in `public/images/services/`; see `SERVICE_IMAGES.md` for the prompt set.
