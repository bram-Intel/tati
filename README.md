# Tati — *Carry a little personality.*

Official Next.js 16 e-commerce storefront and interactive 3D atelier for **Tati** (`bytatistudio.com`).

> **Colourful. Confident. Expressive.**

## Stack
- **Framework**: Next.js 16 (App Router, Turbopack, Cache Components) & React 19
- **Styling**: Custom Vanilla CSS design system (`src/app/globals.css`) built strictly to Tati’s brand palette (`#DB2850`, `#F57971`, `#F27F49`, `#FFF1DD`, `#D9A078`, `#432C2A`, `#392B2B`)
- **3D & Motion**: Three.js PBR WebGL handbag & charm ateliers synchronized with Lenis smooth scroll and GSAP ScrollTrigger
- **Database & Analytics**: Firebase Client SDK + Analytics + Cloud Firestore via `firebase-admin`
- **Mailer & Newsletter**: Zoho Mail SMTP (`nodemailer`) + optional Zoho Campaigns list sync
- **Hosting**: Vercel (`vercel.json`)

## Local Development
1. Copy `.env.example` to `.env.local` and add your Firebase and Zoho credentials.
2. Install and run:
   ```bash
   npm install
   npm run dev
   ```

## Deployment
See [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) for complete **Vercel + Firebase + Zoho Mail / Campaigns** setup instructions.
