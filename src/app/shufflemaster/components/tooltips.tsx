import Image from "next/image";

// HelpTooltip Component with combined functionality
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
          <div className="w-[380px] h-[380px] max-w-[90%] max-h-[90vw] relative mx-auto">
            <Image
              src={userImage}
              alt="Original image"
              fill
              className="object-contain rounded"
              sizes="(max-width: 768px) 90vw, 380px"
            />
          </div>
          <p className="text-indigo-100 text-xs">
            Hint: Try to complete one layer at a time from the top down. When
            you have two layers left, complete it from left to right.
          </p>
        </div>
      </div>
    </div>
  );
}

// GameplayControls Component (simplified)
export function GameplayControls({
  helpTooltipRef,
  helpButtonRef,
  toggleHelpTooltip,
  hideHelpTooltip,
  gameBoardSize,
  userImage,
  howToPlayTooltipRef, // We still need this ref for toggling
}: {
  helpTooltipRef: React.RefObject<HTMLDivElement | null>;
  helpButtonRef: React.RefObject<HTMLButtonElement | null>;
  toggleHelpTooltip: (
    otherTooltipRef?: React.RefObject<HTMLDivElement | null>
  ) => void;
  hideHelpTooltip: () => void;
  gameBoardSize: number;
  userImage: string;
  howToPlayTooltipRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className="mt-1 flex justify-end w-full mx-auto"
      style={{ maxWidth: `${gameBoardSize}px` }}
    >
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
