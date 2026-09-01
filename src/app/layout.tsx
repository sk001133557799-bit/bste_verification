import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Outfit, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BSTE Islamabad | Board of Science & Technical Education",
  description:
    "Official Enterprise Portal of Board of Science and Technical Education (BSTE) Islamabad. Statutory examination authority, instant cryptographic student result verification, verified transcripts, and institutional registry.",
  keywords: [
    "BSTE Islamabad",
    "Board of Science and Technical Education",
    "Student Result Verification",
    "DAE Result",
    "Technical Education Islamabad",
    "Transcript Verification",
    "Official Educational Certificate",
  ],
  authors: [{ name: "BSTE Examination Authority" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${outfit.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans antialiased bg-slate-50 text-slate-900 selection:bg-bste-gold/30 selection:text-bste-navy-950 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
