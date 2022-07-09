/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: [],
  },
  reactStrictMode: true,
  webpack: {
    target: "web",
    resolve: {
      mainFields: ["browser", "module", "main"]
    }
  }
}