/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optional webpack configuration if needed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webpack: (config, { isServer }) => {
    // Add any custom webpack configurations here
    return config
  },
  
  // Optional module aliases
  typescript: {
    // Optionally enable type checking during production builds
    ignoreBuildErrors: process.env.NODE_ENV === 'production'
  },
  
  // Optional redirects or rewrites
  async redirects() {
    return [
      // Example redirect
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // }
    ]
  },
  
  // Environment variables configuration
  env: {
    // Add any environment-specific variables here
    // NEXT_PUBLIC_EXAMPLE_API_URL: process.env.NEXT_PUBLIC_EXAMPLE_API_URL
  },
  
  // Disable x-powered-by header for security
  poweredByHeader: false
}

module.exports = nextConfig
