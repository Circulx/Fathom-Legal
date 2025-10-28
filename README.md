# Fathom Legal - Next.js Application

A modern legal services website built with Next.js, React, and Tailwind CSS.

## Features

- **Modern Tech Stack**: Built with Next.js 15, React 19, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful UI/UX
- **SEO Optimized**: Server-side rendering and meta tags for better search visibility
- **Fast Performance**: Optimized images and code splitting
- **Contact Forms**: Integrated email functionality with EmailJS
- **Multiple Pages**: Home, About, Services, Contact, and more

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about-us/          # About page
│   ├── services/          # Services pages
│   ├── contact/           # Contact page
│   └── ...
├── components/            # Reusable components
│   ├── Navbar/           # Navigation component
│   └── Footer/           # Footer component
└── assets/               # Static assets
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **EmailJS** - Email service integration

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **DigitalOcean App Platform**

## Environment Variables

Create a `.env.local` file for environment variables:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## License

© 2024 Fathom Legal Advocates & Corporate Consultants. All rights reserved.











# Fathom-Legal
