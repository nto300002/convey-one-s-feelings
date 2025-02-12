import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/ui/header';
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
        <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex justify-center p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
