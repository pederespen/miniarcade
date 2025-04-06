export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto p-4 flex-grow flex flex-col">
      {children}
    </div>
  );
}
