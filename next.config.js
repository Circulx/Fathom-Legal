/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
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
