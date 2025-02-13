import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/ui/header';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';
export const metadata: Metadata = {
  title: 'convey-one-s-feelings',
  description: '思いを伝えることに特化したチャットアプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <ToastProvider>
          <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex justify-center p-4">
            <Toaster />
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
