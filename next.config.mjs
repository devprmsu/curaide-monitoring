/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // This tells Next.js NOT to bundle these, avoiding the parsing bug
  serverExternalPackages: ['undici', 'firebase', '@firebase/auth'],
};

export default nextConfig;