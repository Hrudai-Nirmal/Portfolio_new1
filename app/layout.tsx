import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hrudai Nirmal — Portfolio',
  description: 'An immersive portfolio. Peacock hero background preview.',
};

/** Provide the document shell for the portfolio. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
