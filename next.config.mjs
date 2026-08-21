/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript errors are checked separately via tsc — do not silence them in prod builds
  // typescript: { ignoreBuildErrors: true },  // disabled

  experimental: {
    // Only bundle icons that are actually imported — prevents the full lucide-react
    // barrel (which includes GraduationCap) from being instantiated by Turbopack
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    // Enable Next.js image optimisation (WebP/AVIF conversion, responsive sizes)
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'dibrugarhkoreanclub.online',
      },
      {
        protocol: 'https',
        hostname: 'api.dibrugarhkoreanclub.com',
      },
      {
        protocol: 'https',
        hostname: 'dibrugarhkoreanclub.shop',
      },
      {
        protocol: 'https',
        hostname: 'dibrugarhkoreanclub.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: http://localhost:8000 https://dibrugarhkoreanclub.online https://api.dibrugarhkoreanclub.com https://dibrugarhkoreanclub.shop https://dibrugarhkoreanclub.com",
              "connect-src 'self' http://localhost:8000 https://dibrugarhkoreanclub.online https://api.dibrugarhkoreanclub.com https://dibrugarhkoreanclub.shop https://dibrugarhkoreanclub.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      // Next.js manages Cache-Control for /_next/static/ automatically — no override needed
    ]
  },
}

export default nextConfig
