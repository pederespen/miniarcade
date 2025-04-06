import Link from "next/link";

export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto p-4 flex-grow flex flex-col">
      <div className="mb-6">
        <Link
          href="/"
          className="text-indigo-300 hover:text-indigo-100 flex items-center gap-2"
        >
          <span>← Back to Games</span>
        </Link>
      </div>
      {children}
    </div>
  );
}
