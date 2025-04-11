import { useRef, useEffect, useCallback } from "react";

// Custom hook for tooltip management
export function useTooltip() {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const currentTooltipRef = tooltipRef.current;
    const currentButtonRef = buttonRef.current;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        currentTooltipRef &&
        !currentTooltipRef.classList.contains("hidden") &&
        !currentTooltipRef.contains(event.target as Node) &&
        !currentButtonRef?.contains(event.target as Node)
      ) {
        currentTooltipRef.classList.add("hidden", "opacity-0", "scale-95");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTooltip = useCallback(
    (otherTooltipRef?: React.RefObject<HTMLDivElement | null>) => {
      if (tooltipRef.current) {
        tooltipRef.current.classList.toggle("hidden");
        tooltipRef.current.classList.toggle("opacity-0");
        tooltipRef.current.classList.toggle("scale-95");
      }

      // Hide other tooltip if specified
      if (
        otherTooltipRef?.current &&
        !otherTooltipRef.current.classList.contains("hidden")
      ) {
        otherTooltipRef.current.classList.add(
          "hidden",
          "opacity-0",
          "scale-95"
        );
      }
    },
    []
  );

  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.classList.add("hidden", "opacity-0", "scale-95");
    }
  }, []);

  return { tooltipRef, buttonRef, toggleTooltip, hideTooltip };
}
