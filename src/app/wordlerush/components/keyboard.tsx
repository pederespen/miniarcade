"use client";

import { KEYBOARD_LAYOUT, LETTER_COLORS } from "../constants";
import { KeyboardProps } from "../types";

export default function Keyboard({ keyboardState, onKeyPress }: KeyboardProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-4">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {row.map((key) => {
            const status = keyboardState[key] || "unused";
            const isSpecialKey = key === "ENTER" || key === "BACKSPACE";

            return (
              <button
                key={key}
                className={`
                  ${isSpecialKey ? "w-16" : "w-10"} 
                  h-12 
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
                  text-sm
                  sm:text-base
                  ${status !== "unused" ? "border-2 border-white" : ""}
                `}
                onClick={() => onKeyPress(key)}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
