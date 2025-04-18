import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const games = [
    {
      id: "shufflemaster",
      title: "ShuffleMaster",
      description:
        "Solve sliding tile puzzles with your own images! Rearrange the tiles to complete the picture.",
      imageUrl: "./shufflemaster/screenshot.png",
    },
    {
      id: "cubiclecrash",
      title: "CubicleCrash",
      description:
        "Navigate your paper airplane through office obstacles! How far can you fly?",
      imageUrl: "./cubiclecrash/screenshot.png",
    },
    {
      id: "wordlerush",
      title: "WordleRush",
      description:
        "Race against time to solve as many word puzzles as you can! Each correct word adds more time.",
      imageUrl: "./wordlerush/screenshot.png",
    },
  ];

  return (
    <div className="container mx-auto p-6 flex-grow flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
        {games.map((game) => (
          <Link key={game.id} href={`/${game.id}`} className="block h-full">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105 cursor-pointer h-full relative group">
              <div className="absolute inset-0 bg-sky-800/50 z-0">
                {game.imageUrl ? (
                  <Image
                    src={game.imageUrl}
                    alt={`${game.title} screenshot`}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-7xl text-cyan-400">
                      {game.title[0]}
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="relative z-20 p-6 h-full flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                  {game.title}
                </h3>
                <p className="text-white text-lg opacity-90 group-hover:opacity-100 transition-opacity">
                  {game.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
