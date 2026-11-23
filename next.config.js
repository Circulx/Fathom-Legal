/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
=======
  serverExternalPackages: ['pdfkit'],
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/aboutus',
        destination: '/about-us',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
