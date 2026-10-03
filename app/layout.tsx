import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'lenis/dist/lenis.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hrudai Nirmal — Portfolio',
  description: 'An immersive portfolio. Static binary peacock hero preview.',
};

/** Provide the document shell for the portfolio. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
