import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/ui/header';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'convey-one-s-feelings',
  description: '思いを伝えることに特化したチャットアプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-bl from-pink-100 to-white">
        <AuthProvider>
          <ToastProvider>
            <Toaster />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
