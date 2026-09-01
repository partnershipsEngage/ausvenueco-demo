/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static export: every route prerenders and all Supabase calls
  // happen client-side, so no server runtime is needed on Cloudflare Pages.
  output: "export",
  images: { unoptimized: true }
};

export default nextConfig;
