"use client";

import { KEYBOARD_LAYOUT, LETTER_COLORS } from "../utils/constants";
import { KeyboardProps } from "../types";

export default function Keyboard({ keyboardState, onKeyPress }: KeyboardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {row.map((key) => {
            const status = keyboardState[key] || "unused";
            const isSpecialKey = key === "ENTER" || key === "BACKSPACE";
            const isEnter = key === "ENTER";
            const isBackspace = key === "BACKSPACE";

            return (
              <button
                key={key}
                className={`
                  ${
                    isSpecialKey
                      ? "px-2 w-auto min-w-[3rem] sm:min-w-[4rem]"
                      : "w-8 sm:w-10"
                  } 
                  h-11 sm:h-12 
                  m-0.5 
                  rounded-md 
                  font-bold 
                  text-white 
                  ${LETTER_COLORS[status]} 
                  transition-colors 
                  duration-200 
                  flex 
                  items-center 
                  justify-center
                  ${
                    isSpecialKey ? "text-xs sm:text-sm" : "text-sm sm:text-base"
                  }
                  ${status !== "unused" ? "border border-white/50" : ""}
                  touch-manipulation
                `}
                onClick={() => onKeyPress(key)}
                aria-label={key}
              >
                {isBackspace ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z" />
                  </svg>
                ) : isEnter ? (
                  "Enter"
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
