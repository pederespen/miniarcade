import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiniArcade",
  description: "Play games in your browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
