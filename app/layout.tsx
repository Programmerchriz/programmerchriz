import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReponsiveNav from "@/components/Navbar/ReponsiveNav";
import ScrollToTop from "@/components/Helper/ScrollToTop";
import MotionProvider from "@/components/Helper/MotionProvider";
import { themeInitScript } from "@/lib/theme";
import Footer from "@/components/Footer/Footer";
import { SITE } from "@/lib/site";

const fonts = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website", locale: "en_US", siteName: SITE.name,
    title: SITE.title, description: SITE.description,
    images: [{ url: "/images/s1-og-premium-img.jpg", width: 1200, height: 630, alt: "Chris Nwachukwu — Software Engineer" }],
  },
  twitter: {
    card: "summary_large_image", title: SITE.title, description: SITE.description,
    creator: "@Programmerchriz",
    images: [{ url: "/images/s1-twitter-premium-img.jpg", width: 1200, height: 630, alt: "Chris Nwachukwu — Software Engineer" }],
  },
  robots: { index: true, follow: true },
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
      suppressHydrationWarning
      className={`${fonts.className} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <a href="#main-content" className="skip-link">Skip to content</a>
          <ReponsiveNav />
          {children}
          <Footer />
          <ScrollToTop />
        </MotionProvider>
      </body>
    </html>
  );
}
