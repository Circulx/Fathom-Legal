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

- **Vercel** 

## Environment Variables

Create a `.env.local` file for environment variables:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration (Required for Admin Authentication)
# IMPORTANT: Both variables are REQUIRED for production!
NEXTAUTH_SECRET=your_random_secret_key_here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000  # For local development
# In production, set NEXTAUTH_URL to your production URL (e.g., https://yourdomain.com)

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Google Cloud Storage (GCS) Configuration
# Option 1: Use service account JSON file path
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Option 2: Use service account JSON as environment variable (for platforms like Vercel)
# GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}

# GCS Bucket Name (for template documents only)
# Template preview images are stored in MongoDB as base64
GCS_BUCKET_NAME=your-gcs-bucket-name

# Vercel Blob Storage (for image uploads)
# Get your token from: https://vercel.com/dashboard/stores
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxx
```

### Google Cloud Storage Setup

To enable template uploads to Google Cloud Storage:

1. **Create a GCS Bucket:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new bucket or use an existing one
   - Note the bucket name

2. **Create a Service Account:**
   - Go to IAM & Admin > Service Accounts
   - Create a new service account
   - Grant it "Storage Object Admin" role for the bucket
   - Create a JSON key and download it

3. **Configure Environment Variables:**
   - **Option A (Local Development):** Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your service account JSON file
   - **Option B (Production/Cloud):** Set `GOOGLE_SERVICE_ACCOUNT_JSON` to the entire JSON content as a string (useful for platforms like Vercel)

4. **Set Bucket Name:**
   - Set `GCS_BUCKET_NAME` to your bucket name (for template documents only)
   - Template preview images are stored in MongoDB as base64 data URLs (no GCS needed for images)

**Note:** 
- Template documents (PDF/DOCX files) are uploaded to GCS
- Template preview images are stored in MongoDB as base64 data URLs (similar to gallery images)
- This approach simplifies deployment and avoids the need for public bucket configuration

## License

© 2024 Fathom Legal Advocates & Corporate Consultants. All rights reserved.











# Fathom-Legal
# Fathom-Legal
# Fathom-Legal
