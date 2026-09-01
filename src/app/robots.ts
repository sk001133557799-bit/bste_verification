import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bste.edu.pk";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/verify", "/programs", "/institutes", "/about", "/contact"],
        disallow: ["/portal/admin", "/portal/login", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
