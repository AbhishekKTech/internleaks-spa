import { OAuthSync } from '@/components/oauth-sync'
import { Providers } from './providers'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner' // Sonner Toaster import
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'InternLeaks | AI-Powered Fake Internship & Scam Checker',
    template: '%s | InternLeaks',
  },
  description:
    'Upload your offer letter and use our advanced AI to detect fake internships, HR frauds, and advance-fee scams. 100% free and anonymous for students.',
  keywords: [
    // 🔍 Scanner Keywords
    'fake internship checker',
    'offer letter scam',
    'HR fraud detection',
    'student job scams',
    'AI offer letter analyzer',
    'verify offer letter',
    // 🧱 Scam Wall Keywords
    'community reported scams',
    'fake HR companies list',
    'internship fraud database',
    'scam wall',
    // 🏢 Brand
    'InternLeaks',
  ],
  authors: [{ name: 'Abhishek Kumar Sharma' }],
  creator: 'Abhishek Kumar Sharma',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://internleaks.in',
    title: 'InternLeaks | Expose Fake Internships with AI',
    description:
      "Verify your offer letter instantly using AI. Don't fall for HR scams and fake job offers.",
    siteName: 'InternLeaks',
    images: [
      {
        url: 'https://internleaks.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InternLeaks Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InternLeaks | Expose Fake Internships with AI',
    description:
      'Verify your offer letter instantly using AI. Protect yourself from job scams.',
    images: ['https://internleaks.in/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0B0F19',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased bg-[#0B0F19] text-white">
        <Providers>
          <OAuthSync />
          {children}
          {/* Toaster component added globally */}
          <Toaster theme="dark" position="bottom-right" richColors />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
      </body>
    </html>
  )
}