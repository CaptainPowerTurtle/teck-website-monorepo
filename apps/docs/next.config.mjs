/** @type {import('next').NextConfig} */

import nextra from 'nextra';

const nextConfig = {
  transpilePackages: ['@repo/ui'],
  reactStrictMode: true,
};

const withNextra = nextra({
  defaultShowCopyCode: true,
});

export default withNextra(nextConfig);
