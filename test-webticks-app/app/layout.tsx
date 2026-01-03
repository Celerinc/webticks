import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import WebticksConfig from "./webticks-config";
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
  title: "WebTicks Test App",
  description: "Testing WebTicks analytics with yalc",
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
        <WebticksConfig />
        {children}
      </body>
    </html>
  );
}
