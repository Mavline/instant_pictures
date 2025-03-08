import Providers from "@/app/providers";
import bgPattern from "@/public/bg-pattern-transparent.png";
import type { Metadata } from "next";
import { Anonymous_Pro } from "next/font/google";
import "./globals.css";

const anonymousPro = Anonymous_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-anonymous-pro",
});

let title = "Instantic - Real-Time AI Image Generator";
let description = "Create images in real-time with AI";
let url = "https://www.instantic.art/";
let ogimage = "https://www.instantic.art/og-image.png";
let sitename = "instantic.art";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${anonymousPro.variable} font-mono`}>
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className="dark h-full min-h-full bg-[length:6px] font-mono text-gray-100 antialiased"
        style={{ backgroundImage: `url(${bgPattern.src}` }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
