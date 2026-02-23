import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Neu ToDo App',
  description: 'A Neumorphism ToDo app built with Next.js and bknd.io',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
