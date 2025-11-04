import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Suggerimenti Soci - Play Golf 54",
  description: "Scatola dei suggerimenti online per Play Golf 54",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

