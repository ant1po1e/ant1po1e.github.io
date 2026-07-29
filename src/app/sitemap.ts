import type { MetadataRoute } from "next";

const BASE_URL = "https://www.antipole.my.id";

const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
    {
        path: "/contributed-beatmaps",
        priority: 0.8,
        changeFrequency: "monthly",
    },
    { path: "/staffing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/how-to-map", priority: 0.8, changeFrequency: "monthly" },
    { path: "/tools", priority: 0.8, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    {
        path: "/tools/snap-calculator",
        priority: 0.6,
        changeFrequency: "monthly",
    },
    {
        path: "/tools/bbcode-generator",
        priority: 0.6,
        changeFrequency: "monthly",
    },
    { path: "/tools/skill-card", priority: 0.6, changeFrequency: "monthly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return routes.map((route) => ({
        url: `${BASE_URL}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
