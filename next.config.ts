import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Render metadata blocking in <head> for every user agent. Next 15
  // streams dynamic-route metadata into <body> for full browsers, which
  // breaks Lighthouse/SEO tooling (and any parser that only reads <head>).
  // Our metadata is cheap static strings — there is nothing to stream.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
