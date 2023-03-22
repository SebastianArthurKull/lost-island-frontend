/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    socketURL: process.env.SOCKET_URL || "localhost"
  }
};

module.exports = nextConfig;
