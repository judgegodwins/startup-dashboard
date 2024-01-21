/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/cms-dashboard/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-east-1.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'landpay-staging.s3.us-east-1.amazonaws.com'
      }
    ],
  },
}

module.exports = nextConfig
