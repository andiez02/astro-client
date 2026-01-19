import type { Metadata } from 'next'
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Web3Provider } from '@/src/components/providers/Web3Provider'
import { Toaster } from 'sonner'
import Header from '@/src/components/layout/Header'
import { SuppressLitWarning } from '@/src/components/SuppressLitWarning'
import Sidebar from '@/src/components/layout/Sidebar'
import { ModalProvider } from '../components/providers/ModalProvider'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-poppins',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
    title: 'Astro Marketplace',
    description: 'Astro Marketplace',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body
                className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} font-sans antialiased`}
            >
                <SuppressLitWarning />
                <ThemeProvider>
                    <Web3Provider>
                        <ModalProvider>
                            <Analytics />
                            <SpeedInsights />
                            <Toaster position='bottom-right' richColors closeButton />

                            {children}
                        </ModalProvider>
                    </Web3Provider>
                </ThemeProvider>
            </body>
        </html>
    )
}
