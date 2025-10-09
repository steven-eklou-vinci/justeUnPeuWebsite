import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Juste Un Peu - Vêtements modernes et élégants",
  description: "Découvrez notre collection de vêtements modernes et élégants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
