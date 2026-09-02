import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'Inter', system-ui, sans-serif",
              borderRadius: '12px',
              boxShadow: '0 1px 2px rgba(23,24,28,0.04), 0 8px 24px rgba(23,24,28,0.06)',
            },
          }}
        />
      </body>
    </html>
  );
}
