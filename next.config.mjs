/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['your-image-domain.com'],
    },
    env: {
      GOOGLE_CREDENTIALS: process.env.GOOGLE_CREDENTIALS,
    },
    // Add other configuration options as needed
}

export default nextConfig;