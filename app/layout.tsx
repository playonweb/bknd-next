import type { Metadata } from 'next';
import './globals.css';
import { ClientProvider as BkndProvider } from "bknd/client";

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
      <body>
        <BkndProvider>
          {children}
        </BkndProvider>
      </body>
    </html>
  );
}
