"use client";

import React, { useState } from "react";
import { isDevelopment, debugConfig } from "../utils/env-config";

interface DebugPanelProps {
  gameName: string;
}

export default function DebugPanel({ gameName }: DebugPanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (!isDevelopment) {
    return null;
  }

  // If not expanded, only render an invisible toggle button
  if (!expanded) {
    return (
      <div
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full cursor-pointer bg-transparent"
        onClick={() => setExpanded(true)}
      />
    );
  }

  const getActiveFeatures = () => {
    const active: string[] = [];

    if (debugConfig.showCollisionBoxes) active.push("Collision Boxes");
    if (debugConfig.showFPS) active.push("Show FPS");

    return active;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div
          className="px-3 py-2 bg-amber-600 text-white font-medium flex items-center justify-between cursor-pointer"
          onClick={() => setExpanded(false)}
        >
          <span>{gameName}</span>
          <span className="ml-2">▲</span>
        </div>

        <div className="p-3 text-white text-sm">
          <div className="font-bold mb-2">Debug Features:</div>
          <ul className="list-disc pl-5 mb-2">
            {getActiveFeatures().length > 0 ? (
              getActiveFeatures().map((feature, i) => (
                <li key={i}>{feature}</li>
              ))
            ) : (
              <li className="text-gray-400">None enabled</li>
            )}
          </ul>

          <div className="text-xs text-gray-400 mt-3">
            Toggle features with URL parameters:
            <br />
            <code>?showFPS=true&showCollisionBoxes=true</code>
          </div>
        </div>
      </div>
    </div>
  );
}
