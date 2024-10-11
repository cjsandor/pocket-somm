/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['your-image-domain.com'],
    },
    env: {
      NEXT_PUBLIC_GOOGLE_CREDENTIALS: process.env.NEXT_PUBLIC_GOOGLE_CREDENTIALS,
    },
    // Add other configuration options as needed
}

export default nextConfig;
