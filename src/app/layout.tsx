import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrediMotos ROLCA C.A. - Sistema de Gestión de Créditos",
  description: "Sistema de gestión de créditos y financiamiento de motocicletas CrediMotos ROLCA C.A.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen bg-gray-950 text-gray-100 antialiased`}>
        {children}
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
