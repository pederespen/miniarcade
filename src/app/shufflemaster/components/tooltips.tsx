import Image from "next/image";

// HowToPlayTooltip Component
export function HowToPlayTooltip({
  tooltipRef,
  buttonRef,
  toggleTooltip,
  hideTooltip,
  otherTooltipRef,
}: {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  toggleTooltip: (
    otherTooltipRef?: React.RefObject<HTMLDivElement | null>
  ) => void;
  hideTooltip: () => void;
  otherTooltipRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="text-cyan-400 underline cursor-pointer text-sm hover:text-cyan-300 focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          toggleTooltip(otherTooltipRef);
        }}
      >
        How to Play
      </button>
      <div
        ref={tooltipRef}
        className="hidden opacity-0 scale-95 fixed inset-0 flex items-center justify-center z-50 transition duration-300 ease-out"
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={hideTooltip}
        ></div>
        <div
          className="relative bg-indigo-900/80 backdrop-blur-sm text-white p-5 rounded-lg shadow-lg max-w-md mx-auto border border-cyan-500/30 z-10"
          style={{ maxWidth: "min(500px, 90vw)" }}
        >
          <button
            className="absolute top-2 right-2 text-white hover:text-cyan-300 focus:outline-none cursor-pointer"
            onClick={hideTooltip}
          >
            ✕
          </button>
          <h3 className="font-bold text-cyan-400 mb-3 text-center text-xl">
            How to Play
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Click on tiles adjacent to the empty space to move them</li>
            <li>Rearrange the tiles to recreate the original image</li>
            <li>The empty space should end up in the bottom-right corner</li>
            <li>Complete the puzzle in as few moves as possible</li>
          </ul>
          <p className="text-xs text-cyan-300/70 mt-4 italic text-center">
            Hint: Try to complete one layer at a time from the top. When you
            have two layers left, complete it from left to right.
          </p>
        </div>
      </div>
    </div>
  );
}

// HelpTooltip Component
export function HelpTooltip({
  tooltipRef,
  buttonRef,
  toggleTooltip,
  hideTooltip,
  otherTooltipRef,
  userImage,
}: {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  toggleTooltip: (
    otherTooltipRef?: React.RefObject<HTMLDivElement | null>
  ) => void;
  hideTooltip: () => void;
  otherTooltipRef: React.RefObject<HTMLDivElement | null>;
  userImage: string;
}) {
  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="text-cyan-400 underline cursor-pointer text-sm hover:text-cyan-300 focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          toggleTooltip(otherTooltipRef);
        }}
      >
        Help
      </button>
      <div
        ref={tooltipRef}
        className="hidden opacity-0 scale-95 fixed inset-0 flex items-center justify-center z-50 transition duration-300 ease-out"
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={hideTooltip}
        ></div>
        <div
          className="relative bg-indigo-900/80 backdrop-blur-sm text-white p-5 rounded-lg shadow-lg mx-auto border border-cyan-500/30 z-10"
          style={{ width: "90%", maxWidth: "450px" }}
        >
          <button
            className="absolute top-2 right-2 text-white hover:text-cyan-300 focus:outline-none cursor-pointer"
            onClick={hideTooltip}
          >
            ✕
          </button>
          <h3 className="font-bold text-cyan-400 mb-3 text-center text-xl">
            Reference Image
          </h3>
          <div className="w-[380px] h-[380px] max-w-[90%] max-h-[90vw] relative mx-auto">
            <Image
              src={userImage}
              alt="Original image"
              fill
              className="object-contain rounded"
              sizes="(max-width: 768px) 90vw, 380px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// GameplayControls Component
export function GameplayControls({
  howToPlayTooltipRef,
  howToPlayButtonRef,
  toggleHowToPlayTooltip,
  hideHowToPlayTooltip,
  helpTooltipRef,
  helpButtonRef,
  toggleHelpTooltip,
  hideHelpTooltip,
  gameBoardSize,
  userImage,
}: {
  howToPlayTooltipRef: React.RefObject<HTMLDivElement | null>;
  howToPlayButtonRef: React.RefObject<HTMLButtonElement | null>;
  toggleHowToPlayTooltip: (
    otherTooltipRef?: React.RefObject<HTMLDivElement | null>
  ) => void;
  hideHowToPlayTooltip: () => void;
  helpTooltipRef: React.RefObject<HTMLDivElement | null>;
  helpButtonRef: React.RefObject<HTMLButtonElement | null>;
  toggleHelpTooltip: (
    otherTooltipRef?: React.RefObject<HTMLDivElement | null>
  ) => void;
  hideHelpTooltip: () => void;
  gameBoardSize: number;
  userImage: string;
}) {
  return (
    <div
      className="mt-1 flex justify-between w-full mx-auto"
      style={{ maxWidth: `${gameBoardSize}px` }}
    >
      <HowToPlayTooltip
        tooltipRef={howToPlayTooltipRef}
        buttonRef={howToPlayButtonRef}
        toggleTooltip={toggleHowToPlayTooltip}
        hideTooltip={hideHowToPlayTooltip}
        otherTooltipRef={helpTooltipRef}
      />

      <HelpTooltip
        tooltipRef={helpTooltipRef}
        buttonRef={helpButtonRef}
        toggleTooltip={toggleHelpTooltip}
        hideTooltip={hideHelpTooltip}
        otherTooltipRef={howToPlayTooltipRef}
        userImage={userImage}
      />
    </div>
  );
}
