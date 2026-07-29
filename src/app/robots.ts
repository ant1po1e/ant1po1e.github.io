import type { MetadataRoute } from "next";

const BASE_URL = "https://www.antipole.my.id";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
