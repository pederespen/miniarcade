/**
 * Environment configuration for MiniArcade
 * Uses Next.js environment variables with fallbacks
 */

// Check if we're in development mode (Next.js provides this)
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";

// Game-specific debug flags
interface DebugConfig {
  showFPS: boolean;
  showCollisionBoxes: boolean;
}

// Default debug configuration
const defaultDebugConfig: DebugConfig = {
  showFPS: false,
  showCollisionBoxes: false,
};

// Development debug configuration
const devDebugConfig: DebugConfig = {
  showFPS: true,
  showCollisionBoxes: true,
};

// Get the debug configuration based on environment
export const getDebugConfig = (): DebugConfig => {
  // In development, use development debug configuration
  if (isDevelopment) {
    // Allow overriding via URL parameters (if in browser)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const config = { ...devDebugConfig };

      if (params.has("showFPS"))
        config.showFPS = params.get("showFPS") === "true";
      if (params.has("showCollisionBoxes"))
        config.showCollisionBoxes = params.get("showCollisionBoxes") === "true";

      return config;
    }
    return devDebugConfig;
  }

  // In production, use default configuration (no debug features)
  return defaultDebugConfig;
};

// Export a ready-to-use debug config object
export const debugConfig = getDebugConfig();
