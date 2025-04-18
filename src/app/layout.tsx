import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-sky-900 to-sky-950 text-white">
        <header className="fixed top-0 left-0 right-0 w-full p-3 z-50 bg-sky-900 backdrop-blur-sm">
          <div className="container mx-auto flex justify-center items-center">
            <Link href="/">
              <Image
                src="./miniarcade-logo-with-text.png"
                alt="MiniArcade"
                width={300}
                height={100}
                className="mx-auto"
              />
            </Link>
          </div>
        </header>
        <main className="flex-grow flex flex-col pt-[70px]">{children}</main>
        <footer className="py-2 mt-auto">
          <div className="container mx-auto text-center">
            <p className="text-white text-sm">Peder Espen | © 2025</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
