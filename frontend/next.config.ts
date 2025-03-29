import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		apihost: 'http://localhost:9119'
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '9119',
				pathname: '**',
				search: ''
			}
		]
	},
	eslint: {
		ignoreDuringBuilds: true
	},
	typescript: {
		ignoreBuildErrors: true
	}
};

export default nextConfig;
