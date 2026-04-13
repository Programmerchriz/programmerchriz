import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReponsiveNav from "@/components/Navbar/ReponsiveNav";

const fonts = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chris Nwachukwu | Software Engineer",
  description: "Portfolio website for Chris Nwachukwu, built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fonts.className} h-full antialiased bg-[#0d0d1f] text-white`}
    >
      <body className="min-h-full flex flex-col">
        <ReponsiveNav />
        {children}
      </body>
    </html>
  );
}
