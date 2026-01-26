import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import WebticksAnalytics from "@webticks/react";
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
        <WebticksAnalytics
          serverUrl="http://localhost:3002/api/track"
          appId="97069816-8b25-4640-833f-f17259208a42"
        />
        {children}
      </body>
    </html>
  );
}
