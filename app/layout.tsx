import './globals.css';
import '@lib/tokens/design-tokens.css';
import { I18nProvider } from '@lib/i18n';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'WO/WNSC PWA Dashboard',
  description: 'Offline-first summary app for Oman Oil & NAMA',
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/apple-touch-icon.png' },
  applicationName: 'WO/WNSC Dashboard',
  themeColor: '#0b5fff'
};

export const viewport: Viewport = { themeColor: '#0b5fff', viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <I18nProvider>
          <div className="main">
            <header className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="row" style={{ gap: 10 }}>
                <a href="/dashboard">Dashboard</a>
                <a href="/wo">WO</a>
                <a href="/wnsc">WNSC</a>
                <a href="/settings">Settings</a>
              </div>
              <a href="/offline" style={{ opacity: 0.7 }}>Offline</a>
            </header>
            {children}
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
