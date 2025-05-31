/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export', // ✅ This tells Next.js to generate static HTML
  trailingSlash: true, // Optional: for better compatibility with some shared hosts
}

export default nextConfig
