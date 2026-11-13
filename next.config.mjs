/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  // O WordPress vive em /cms no mesmo domínio e é servido pelo servidor web, não pelo Next.
  skipTrailingSlashRedirect: false,
};
export default nextConfig;
