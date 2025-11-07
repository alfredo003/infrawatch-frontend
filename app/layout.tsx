import type React from 'react';
import type { Metadata } from 'next';
import { Geist_Mono as GeistMono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const geistMono = GeistMono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InfraWatch - Sistema de Monitoramento',
  description: ' Sistema de Monitoramento',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${geistMono.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
