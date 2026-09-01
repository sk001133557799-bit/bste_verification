import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bste.edu.pk";

  const routes = [
    "",
    "/verify",
    "/programs",
    "/institutes",
    "/departments",
    "/news",
    "/about",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : route === "/verify" ? 0.9 : 0.8,
  }));

  return routes;
}
