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
        "Navigate your paper airplane through office obstacles and collect powerups! How far can you fly?",
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
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105 cursor-pointer h-full relative group min-h-[250px] sm:min-h-[300px] border border-sky-600">
              <div className="absolute inset-0 bg-sky-900/60">
                <Image
                  src={game.imageUrl}
                  alt={`${game.title} screenshot`}
                  fill
                  priority
                  className="object-cover opacity-75 mix-blend-normal"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30"></div>
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div className="flex-grow"></div>
                <div>
                  <h3 className="text-2xl font-bold text-sky-600 mb-2">
                    {game.title}
                  </h3>
                  <p className="text-white text-lg group-hover:text-sky-100 transition-colors">
                    {game.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
