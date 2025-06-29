// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="relative min-h-screen pb-16 bg-[#f9fafb]">
      <Component {...pageProps} />
      <Navbar />
    </div>
  );
}
