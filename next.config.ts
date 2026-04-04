import dotenv from "dotenv";
import type { NextConfig } from "next";

// Carregar variáveis de ambiente explicitamente
dotenv.config();

const nextConfig: NextConfig = {
	output: "standalone",
	cacheComponents: true,
	reactCompiler: true,

	images: {
		remotePatterns: [new URL("https://lh3.googleusercontent.com/**")],
	},
	devIndicators: {
		position: "bottom-right",
	},
	experimental: {
		prefetchInlining: true,
		turbopackFileSystemCacheForDev: true,
	},

	// Headers for Safari compatibility
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Content-Security-Policy",
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline' https://umami.felipecoutinho.com",
							"style-src 'self' 'unsafe-inline'",
							"img-src 'self' https://lh3.googleusercontent.com data: blob:",
							"font-src 'self'",
							"connect-src 'self' https://umami.felipecoutinho.com",
							"frame-ancestors 'none'",
						].join("; "),
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "X-Permitted-Cross-Domain-Policies",
						value: "none",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		];
	},
};

export default nextConfig;
