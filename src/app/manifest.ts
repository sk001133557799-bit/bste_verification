import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Board of Science & Technical Education Islamabad",
    short_name: "BSTE Islamabad",
    description: "Official Academic Verification & Examination Results Portal",
    start_url: "/",
    display: "standalone",
    background_color: "#0B2545",
    theme_color: "#0B2545",
    icons: [
      {
        src: "/images/muhammad-sohail.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/images/muhammad-sohail.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
