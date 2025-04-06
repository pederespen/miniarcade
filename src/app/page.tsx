export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-8">
        MiniArcade
      </h1>
      <div className="grid gap-6">{/* Game content will go here */}</div>
    </main>
  );
}
