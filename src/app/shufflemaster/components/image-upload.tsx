"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// Helper function to get centered crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageUpload({
  onImageCropped,
  onCancel,
}: {
  onImageCropped: (imageDataUrl: string) => void;
  onCancel: () => void;
}) {
  const [imgSrc, setImgSrc] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isLoading, setIsLoading] = useState(false);

  // When user selects an image
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setCrop(undefined); // Reset crop
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      // Always use a 1:1 aspect ratio for the puzzle
      const crop = centerAspectCrop(width, height, 1);
      setCrop(crop);
    },
    []
  );

  // Generate cropped image
  const getCroppedImg = useCallback(() => {
    if (!imgRef.current || !completedCrop) return;

    setIsLoading(true);

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Set canvas size to the crop dimensions
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Use larger dimensions to maintain quality, especially on mobile
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    // Set canvas properties for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw the cropped image
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert to data URL and pass to parent
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          setIsLoading(false);
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          onImageCropped(dataUrl);
          setIsLoading(false);
        };
      },
      "image/jpeg",
      1.0 // Increased quality to maximum (1.0)
    );
  }, [completedCrop, onImageCropped]);

  return (
    <div className="flex flex-col items-center">
      {!imgSrc ? (
        <div className="mb-4 w-full max-w-md">
          <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-indigo-400 border-dashed rounded-lg cursor-pointer bg-indigo-800/30 hover:bg-indigo-800/50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-indigo-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-1 text-sm text-indigo-200">
                Click to select an image
              </p>
              <p className="text-xs text-indigo-300">PNG, JPG or GIF</p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={onSelectFile}
              accept="image/*"
            />
          </label>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-4 w-full">
          <div className="max-w-md w-full mb-4 overflow-hidden bg-indigo-900/30 p-4 rounded-lg">
            <ReactCrop
              crop={crop}
              onChange={(c: Crop) => setCrop(c)}
              onComplete={(c: PixelCrop) => setCompletedCrop(c)}
              aspect={1}
              className="max-w-full h-auto"
            >
              {/* Need to use a regular img tag for ReactCrop to work with refs */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Upload"
                className="max-w-full h-auto"
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 rounded bg-indigo-700 text-indigo-200 hover:bg-indigo-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={getCroppedImg}
              className="py-2 px-4 rounded bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50"
              disabled={!completedCrop || isLoading}
            >
              {isLoading ? "Processing..." : "Select"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
