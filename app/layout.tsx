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
  metadataBase: new URL("https://www.programmerchriz.xyz"),
  title: "Chris Nwachukwu | Software Engineer & Fullstack Engineer",

  description:
    "Results-driven Software Engineer with over 4 years of experience building and shipping scalable full-stack web applications using TypeScript, React, Next.js, Node.js, Python, and FastAPI.",

  keywords: [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "React.js",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "Web Developer",
    "Portfolio",
  ],

  authors: [{ name: "Chris Nwachukwu" }],
  creator: "Chris Nwachukwu",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.programmerchriz.xyz",
    siteName: "Chris Nwachukwu - Software Engineer",

    title: "Chris Nwachukwu | Software Engineer & Fullstack Engineer",
    description:
      "Results-driven Software Engineer with over 4 years of experience building and shipping scalable full-stack web applications using TypeScript, React, Next.js, Node.js, Python, and FastAPI.",

    images: [
      {
        url: "/images/s1-og-premium-img.jpg",
        width: 1200,
        height: 630,
        alt: "Chris Nwachukwu - Software Engineer",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Chris Nwachukwu | Software Engineer & Fullstack Engineer",

    description:
      "Results-driven Software Engineer with over 4 years of experience building and shipping scalable full-stack web applications using TypeScript, React, Next.js, Node.js, Python, and FastAPI.",
    creator: "@Programmerchriz",

    images: [
      {
        url: "/images/s1-twitter-premium-img.jpg",
        width: 1200,
        height: 630,
        alt: "Chris Nwachukwu - Software Engineer",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/images/s1-thumbnail-premium-img.jpg",
    shortcut: "/images/s1-thumbnail-premium-img.jpg",
    apple: "/images/s1-thumbnail-premium-img.jpg",
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