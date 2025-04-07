"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  imageUrl,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropSize, setCropSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    size: 0,
    cropX: 0,
    cropY: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load image dimensions when the component mounts
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });

      // Base crop size on the smaller dimension to ensure it fits
      const initialSize = Math.min(img.width, img.height) * 0.4;
      setCropSize(initialSize);

      // Center the crop box
      setCrop({
        x: (img.width - initialSize) / 2,
        y: (img.height - initialSize) / 2,
      });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = imageSize.width / rect.width;
    const scaleY = imageSize.height / rect.height;

    setIsDragging(true);
    setDragStart({
      x: (e.clientX - rect.left) * scaleX - crop.x,
      y: (e.clientY - rect.top) * scaleY - crop.y,
    });
  };

  const handleCornerMouseDown = (e: React.MouseEvent, corner: string) => {
    if (!containerRef.current) return;

    e.stopPropagation();
    e.preventDefault();

    setIsResizing(true);
    setResizeCorner(corner);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      size: cropSize,
      cropX: crop.x,
      cropY: crop.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if ((!isDragging && !isResizing) || !containerRef.current) return;

    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = imageSize.width / rect.width;
    const scaleY = imageSize.height / rect.height;

    if (isDragging) {
      let newX = (e.clientX - rect.left) * scaleX - dragStart.x;
      let newY = (e.clientY - rect.top) * scaleY - dragStart.y;

      // Constrain the crop area to the image boundaries
      newX = Math.max(0, Math.min(imageSize.width - cropSize, newX));
      newY = Math.max(0, Math.min(imageSize.height - cropSize, newY));

      setCrop({ x: newX, y: newY });
    } else if (isResizing && resizeCorner) {
      // Calculate pixel change in the container's coordinate space
      const deltaX = e.clientX - resizeStart.x;

      // Convert to image coordinate space
      const scaledDeltaX = deltaX * (imageSize.width / rect.width);

      // Based on which corner, determine how to apply the change
      let sizeDelta = 0;
      let newCropX = resizeStart.cropX;
      let newCropY = resizeStart.cropY;

      switch (resizeCorner) {
        case "topLeft":
          // For top-left, negative X/Y movement makes the selection bigger
          // Simplify to just use X movement for more predictable behavior
          sizeDelta = -scaledDeltaX;
          // Update both X and Y position to maintain square
          newCropX = resizeStart.cropX - sizeDelta;
          newCropY = resizeStart.cropY - sizeDelta;
          break;
        case "topRight":
          // For top-right, X grows with drag, Y shrinks
          sizeDelta = scaledDeltaX;
          newCropY = resizeStart.cropY - sizeDelta;
          break;
        case "bottomLeft":
          // For bottom-left, simplify to just use X movement
          sizeDelta = -scaledDeltaX;
          newCropX = resizeStart.cropX - sizeDelta;
          break;
        case "bottomRight":
          // For bottom-right, both grow with drag
          sizeDelta = scaledDeltaX;
          break;
      }

      // Calculate new size
      let newSize = resizeStart.size + sizeDelta;

      // Apply minimum size constraint
      const minSize = 50 * (imageSize.width / rect.width); // 50px in image coordinates
      if (newSize < minSize) {
        newSize = minSize;

        // Adjust position based on which corner we're dragging
        if (resizeCorner === "topLeft") {
          newCropX = resizeStart.cropX + resizeStart.size - minSize;
          newCropY = resizeStart.cropY + resizeStart.size - minSize;
        } else if (resizeCorner === "topRight") {
          newCropY = resizeStart.cropY + resizeStart.size - minSize;
        } else if (resizeCorner === "bottomLeft") {
          newCropX = resizeStart.cropX + resizeStart.size - minSize;
        }
      }

      // Apply image boundary constraints
      if (newCropX < 0) {
        newSize += newCropX; // Reduce size by overflow amount
        newCropX = 0;
      }

      if (newCropY < 0) {
        newSize += newCropY; // Reduce size by overflow amount
        newCropY = 0;
      }

      if (newCropX + newSize > imageSize.width) {
        newSize = imageSize.width - newCropX;
      }

      if (newCropY + newSize > imageSize.height) {
        newSize = imageSize.height - newCropY;
      }

      // Update crop state
      setCropSize(newSize);
      setCrop({ x: newCropX, y: newCropY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeCorner(null);
  };

  const applyCrop = () => {
    // Create an image for the canvas operation
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size to the crop size (square)
      canvas.width = cropSize;
      canvas.height = cropSize;

      if (ctx) {
        // Draw the cropped portion of the image to the canvas
        ctx.drawImage(
          img,
          crop.x,
          crop.y,
          cropSize,
          cropSize, // Source coordinates
          0,
          0,
          cropSize,
          cropSize // Destination coordinates
        );

        // Convert canvas to data URL
        const croppedImageUrl = canvas.toDataURL("image/jpeg", 0.85);
        onCropComplete(croppedImageUrl);
      }
    };
    img.src = imageUrl;
  };

  // Don't render until we have image dimensions
  if (imageSize.width === 0 || imageSize.height === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-indigo-900 rounded-lg">
        <div className="text-cyan-400">Loading image...</div>
      </div>
    );
  }

  // Styles for the resize handles
  const handleSize = 12;
  const handleOffset = -handleSize / 2;
  const resizeHandleStyle = {
    width: `${handleSize}px`,
    height: `${handleSize}px`,
    position: "absolute" as const,
    background: "white",
    border: "2px solid rgb(34, 211, 238)",
    borderRadius: "2px",
    zIndex: 10,
  };

  return (
    <div className="bg-black rounded-lg p-4 shadow-lg">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">Crop Your Image</h3>

      <div className="mb-4 text-indigo-100 text-sm">
        Drag to adjust the crop area. Use the corner handles to resize. The
        selection will remain square.
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto mb-4 cursor-move bg-gray-900 rounded overflow-hidden flex items-center justify-center"
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "300px",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Visible image */}
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt="Upload"
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 500px"
            unoptimized
          />

          {/* Crop overlay - always square */}
          <div
            className="absolute border-2 border-cyan-400 shadow-lg"
            style={{
              left: `${(crop.x / imageSize.width) * 100}%`,
              top: `${(crop.y / imageSize.height) * 100}%`,
              width: `${(cropSize / imageSize.width) * 100}%`,
              aspectRatio: "1 / 1", // Force square aspect ratio
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Resize handles */}
            <div
              style={{
                ...resizeHandleStyle,
                top: `${handleOffset}px`,
                left: `${handleOffset}px`,
                cursor: "nwse-resize",
              }}
              onMouseDown={(e) => handleCornerMouseDown(e, "topLeft")}
            />
            <div
              style={{
                ...resizeHandleStyle,
                top: `${handleOffset}px`,
                right: `${handleOffset}px`,
                cursor: "nesw-resize",
              }}
              onMouseDown={(e) => handleCornerMouseDown(e, "topRight")}
            />
            <div
              style={{
                ...resizeHandleStyle,
                bottom: `${handleOffset}px`,
                left: `${handleOffset}px`,
                cursor: "nesw-resize",
              }}
              onMouseDown={(e) => handleCornerMouseDown(e, "bottomLeft")}
            />
            <div
              style={{
                ...resizeHandleStyle,
                bottom: `${handleOffset}px`,
                right: `${handleOffset}px`,
                cursor: "nwse-resize",
              }}
              onMouseDown={(e) => handleCornerMouseDown(e, "bottomRight")}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
        >
          Cancel
        </button>
        <button
          onClick={applyCrop}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded"
        >
          Apply Crop
        </button>
      </div>
    </div>
  );
}
