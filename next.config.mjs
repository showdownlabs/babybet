/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ["*"] } },
  // Enable standalone output for Docker
  output: 'standalone',
}
export default nextConfig

