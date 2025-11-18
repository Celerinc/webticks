import { Inter } from 'next/font/google'
import WebTicksAnalytics from '@webticks/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'WebTicks Next.js Example',
    description: 'Example integration of WebTicks with Next.js',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <WebTicksAnalytics />
                {children}
            </body>
        </html>
    )
}
