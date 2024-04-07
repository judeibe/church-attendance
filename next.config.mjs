// @ts-check
import createJiti from "jiti";

const jiti = createJiti(new URL(import.meta.url).pathname);
jiti("./env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
