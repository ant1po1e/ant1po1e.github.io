import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Robots-Tag", value: "noindex, nofollow" },
                ],
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/i/:path*",
                destination: "/api/img?p=:path*",
            },
        ];
    },
};

export default nextConfig;
