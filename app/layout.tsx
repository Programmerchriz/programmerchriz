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
  title: "Chris Nwachukwu | Software Engineer & Fullstack Engineer",
  description:
    "Dedicated Software Engineer with over 4 years of experience specializing in front-end development. Building high-performance web applications with React.js, Next.js, and TypeScript.",
  keywords: [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "React.js",
    "Next.js",
    "TypeScript",
    "Web Developer",
    "Portfolio",
  ],
  authors: [{ name: "Chris Nwachukwu" }],
  creator: "Chris Nwachukwu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://programmerchriz.vercel.app",
    siteName: "Chris Nwachukwu - Software Engineer",
    title: "Chris Nwachukwu | Software Engineer & Fullstack Developer",
    description:
      "Dedicated Software Engineer with over 4 years of experience specializing in front-end development.",
    images: [
      {
        url: "/images/s1-og-premium.jpg",
        width: 1200,
        height: 630,
        alt: "Chris Nwachukwu",
        type: "image/jpeg",
      },
      {
        url: "/images/headline-2.jpg",
        width: 400,
        height: 400,
        alt: "Chris Nwachukwu",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chris Nwachukwu | Software Engineer & Fullstack Engineer",
    description:
      "Results-driven Software Engineer with over 4 years of experience building and shipping scalable full-stack web applications. Experienced with the TypeScript and Python ecosystems (React, Next.js, Node.js, FastAPI), delivering production-ready features from frontend to backend while improving system performance by up to 35%. Passionate about clean architecture, reliable software, and solving real customer problems",
    creator: "@Programmerchriz",
    images: ["/images/s1-twitter-premium.jpg"],
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
