import { useState, useEffect, useRef } from "react";
import { GameBoardSize } from "../types";

interface UseBoardSizeProps {
  onSizeChange?: (size: GameBoardSize) => void;
}

export default function useBoardSize({ onSizeChange }: UseBoardSizeProps = {}) {
  const [boardSize, setBoardSize] = useState<GameBoardSize>({
    width: 640,
    height: 480,
  });
  const [sizeCalculated, setSizeCalculated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateBoardSize = () => {
    if (!containerRef.current) {
      setSizeCalculated(true);
      return;
    }

    const containerWidth = containerRef.current.clientWidth;

    const maxWidth = 640;
    const width = Math.min(containerWidth || maxWidth, maxWidth);

    const height = Math.floor(width * 0.75);

    const newSize = { width, height };
    setBoardSize(newSize);
    setSizeCalculated(true);

    if (onSizeChange) {
      onSizeChange(newSize);
    }
  };

  useEffect(() => {
    calculateBoardSize();

    const handleResize = () => {
      calculateBoardSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    boardSize,
    sizeCalculated,
    containerRef,
  };
}
