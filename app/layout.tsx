import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { FlagProvider } from '@/components/FlagProvider';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {' '}
        <FlagProvider>{children}</FlagProvider>
      </body>
    </html>
  );
}
