import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@medlens/logger", "@medlens/types"],
};

export default nextConfig;
