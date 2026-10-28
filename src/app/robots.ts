import type { MetadataRoute } from "next"
import { getSiteUrl } from "@root/src/lib/seo"

export default function robots(): MetadataRoute.Robots {
    const siteUrl = getSiteUrl()
    return {
        // /_next/ مسدود نمی‌شود: گوگل برای رندر به CSS/JS نیاز دارد. /uploads هم برای جست‌وجوی تصویر باز می‌ماند.
        rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/p-admin/", "/p-user/", "/checkout/", "/login-register"] }],
        sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
    }
}
