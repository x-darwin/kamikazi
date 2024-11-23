import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ClientPostHogProvider } from './providers/ClientPostHogProvider';
import { headers } from 'next/headers';
import { ToasterProvider } from '@/components/providers/toaster-provider';

// Optimize font loading with specific subsets
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    template: '%s | StreamVault',
    default: 'StreamVault - Your Ultimate Entertainment Hub',
  },
  description: 'Access premium content, exclusive releases, and unlimited streaming with StreamVault.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'StreamVault',
    description: 'Your Ultimate Entertainment Hub',
    siteName: 'StreamVault',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = (await headersList).get('x-pathname') || '/';
  
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={inter.variable}
      data-pathname={pathname}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link 
          rel="preload" 
          href="/devices-mockup.webp" 
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
                document.documentElement.classList[theme === 'dark' ? 'add' : 'remove']('dark');
              } catch {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientPostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ToasterProvider />
          </ThemeProvider>
        </ClientPostHogProvider>
      </body>
    </html>
  );
}