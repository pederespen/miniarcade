export default function Home() {
  const games = [
    {
      id: "snake",
      title: "Snake",
      description:
        "Classic snake game. Eat the food and grow longer without hitting the walls or yourself.",
      imageUrl: "/images/snake.png",
    },
    {
      id: "tetris",
      title: "Tetris",
      description:
        "Arrange falling blocks to create complete lines and score points.",
      imageUrl: "/images/tetris.png",
    },
    {
      id: "pong",
      title: "Pong",
      description:
        "Classic two-player game. Hit the ball back and forth without missing.",
      imageUrl: "/images/pong.png",
    },
  ];

  return (
    <div className="container mx-auto p-6 flex-grow flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-indigo-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105 cursor-pointer flex flex-col h-full"
          >
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
              <button className="mt-6 bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-md transition-colors">
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
