import Link from "next/link";

export default function Home() {
  const games = [
    {
      id: "game1",
      title: "Game 1",
      description:
        "This is a placeholder for game 1. Description would go here.",
      imageUrl: "/images/game1.png",
    },
    {
      id: "game2",
      title: "Game 2",
      description:
        "This is a placeholder for game 2. Description would go here.",
      imageUrl: "/images/game2.png",
    },
    {
      id: "game3",
      title: "Game 3",
      description:
        "This is a placeholder for game 3. Description would go here.",
      imageUrl: "/images/game3.png",
    },
  ];

  return (
    <div className="container mx-auto p-6 flex-grow flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="block h-full"
          >
            <div className="bg-indigo-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105 cursor-pointer flex flex-col h-full">
              <div className="h-60 bg-indigo-700 flex items-center justify-center">
                {/* Placeholder for game images */}
                <div className="text-7xl text-cyan-400">{game.title[0]}</div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">
                    {game.title}
                  </h3>
                  <p className="text-indigo-100 text-lg">{game.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
