import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CREDIMOTOS ROLCA — Sistema de Gestión",
  description: "Sistema de gestión de créditos y cobranzas para CREDIMOTOS ROLCA C.A.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${sora.variable} ${jetbrains.variable} font-sans`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-inter)',
              borderRadius: '12px',
              boxShadow: '0 1px 2px rgba(23,24,28,0.04), 0 8px 24px rgba(23,24,28,0.06)',
            },
          }}
        />
      </body>
    </html>
  );
}
