/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // This is the critical part for the undici error
  transpilePackages: ['undici', 'firebase', '@firebase/auth'],
};

export default nextConfig;