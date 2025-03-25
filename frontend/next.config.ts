import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		apihost: 'http://192.168.0.213:9119'
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '192.168.0.213',
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
