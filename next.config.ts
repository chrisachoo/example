import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		agentFeedback: true
	},
	reactCompiler: true,
	reactStrictMode: true
}

export default nextConfig
