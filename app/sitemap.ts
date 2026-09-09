import type { MetadataRoute } from "next";
import {siteUrl} from "@/app/utils/constants";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: siteUrl,
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${siteUrl}/terms`,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${siteUrl}/privacy`,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${siteUrl}/privacy/detailed`,
            changeFrequency: "yearly",
            priority: 0.2,
        },
    ];
}
