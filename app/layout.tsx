import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReponsiveNav from "@/components/Navbar/ReponsiveNav";
import ScrollToTop from "@/components/Helper/ScrollToTop";

const fonts = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Christian Nwachukwu | Software Engineer & Frontend Developer",
  description:
    "Dedicated Software Engineer with over 4 years of experience specializing in front-end development. Building high-performance web applications with React.js, Next.js, and TypeScript.",
  keywords: [
    "Software Engineer",
    "Frontend Developer",
    "React.js",
    "Next.js",
    "TypeScript",
    "Web Developer",
    "Portfolio",
  ],
  authors: [{ name: "Christian Nwachukwu" }],
  creator: "Christian Nwachukwu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://programmerchriz.vercel.app",
    siteName: "Christian Nwachukwu - Software Engineer",
    title: "Christian Nwachukwu | Software Engineer & Frontend Developer",
    description:
      "Dedicated Software Engineer with over 4 years of experience specializing in front-end development.",
    images: [
      {
        url: "/images/s1-og.jpg",
        width: 1200,
        height: 630,
        alt: "Christian Nwachukwu",
        type: "image/jpeg",
      },
      {
        url: "/images/s1-thumbnail.jpg",
        width: 400,
        height: 400,
        alt: "Christian Nwachukwu",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Nwachukwu | Software Engineer & Frontend Developer",
    description:
      "Dedicated Software Engineer with over 4 years of experience specializing in front-end development.",
    creator: "@Programmerchriz",
    images: ["/images/s1-twitter.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/s1-thumbnail-premium.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fonts.className} h-full antialiased bg-[#0d0d1f] text-white overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ReponsiveNav />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
