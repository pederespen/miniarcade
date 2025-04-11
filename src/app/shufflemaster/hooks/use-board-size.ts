import { useState, useEffect, useCallback, useRef } from "react";

interface UseBoardSizeProps {
  onSizeChange?: (size: number) => void;
}

export default function useBoardSize({ onSizeChange }: UseBoardSizeProps = {}) {
  const [boardSize, setBoardSize] = useState(0);
  const [sizeCalculated, setSizeCalculated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate responsive board size
  const updateBoardSize = useCallback(() => {
    if (!containerRef.current) return;

    // Get the parent container width
    const parentElement = containerRef.current.parentElement;
    if (!parentElement) return;

    // Get the actual available width from the parent element
    const containerWidth = parentElement.offsetWidth;

    // Set minimum and maximum sizes
    const minSize = Math.min(300, containerWidth * 0.9);
    const maxSize = 500;

    // Ensure board size stays within bounds
    const newSize = Math.max(minSize, Math.min(containerWidth * 0.95, maxSize));

    // Update the board size if it's significantly different
    if (Math.abs(newSize - boardSize) > 5 || !sizeCalculated) {
      setBoardSize(newSize);
      setSizeCalculated(true);
      if (onSizeChange) {
        onSizeChange(newSize);
      }
    }
  }, [boardSize, onSizeChange, sizeCalculated]);

  // Force an immediate size calculation after the component is mounted
  useEffect(() => {
    // Add a slight delay to ensure the parent is rendered
    setTimeout(updateBoardSize, 0);
  }, [updateBoardSize]);

  // Set up resize observer to detect container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      updateBoardSize();
    });

    const parentElement = containerRef.current.parentElement;
    if (parentElement) {
      resizeObserver.observe(parentElement);
    }

    // Clean up on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, [updateBoardSize]);

  // Also listen for window resize events
  useEffect(() => {
    window.addEventListener("resize", updateBoardSize);
    return () => {
      window.removeEventListener("resize", updateBoardSize);
    };
  }, [updateBoardSize]);

  return {
    boardSize,
    sizeCalculated,
    containerRef,
  };
}
