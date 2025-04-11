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

    // We'll use the container's width and height directly
    // since our container now has a fixed aspect ratio
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Always enforce the 4:3 aspect ratio (this is already ensured by the container's CSS)
    const aspectRatio = 4 / 3;

    // Determine appropriate size based on the container
    let width, height;

    // Use the container's dimensions, but cap at a maximum size for desktop
    const maxWidth = 640;
    width = Math.min(containerWidth, maxWidth);
    height = width / aspectRatio;

    // Ensure the height fits within the container
    if (height > containerHeight) {
      height = containerHeight;
      width = height * aspectRatio;
    }

    // Ensure minimum dimensions
    width = Math.max(width, 300);
    height = Math.max(height, 225);

    const newSize = {
      width: Math.floor(width),
      height: Math.floor(height),
    };

    setBoardSize(newSize);
    setSizeCalculated(true);

    if (onSizeChange) {
      onSizeChange(newSize);
    }
  };

  useEffect(() => {
    // Initial calculation
    calculateBoardSize();

    const handleResize = () => {
      calculateBoardSize();
    };

    // Calculate on resize and orientation change
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Set up a mutation observer to detect changes to the container
    const resizeObserver = new ResizeObserver(() => {
      calculateBoardSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return {
    boardSize,
    sizeCalculated,
    containerRef,
  };
}
