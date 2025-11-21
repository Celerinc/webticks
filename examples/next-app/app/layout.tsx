import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import WebTicksAnalytics from "@webticks/reactjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js + WebTicks",
  description: "Example Next.js app with WebTicks analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebTicksAnalytics />
        {children}
      </body>
    </html>
  );
}
