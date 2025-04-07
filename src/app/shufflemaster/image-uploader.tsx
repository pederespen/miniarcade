"use client";

import { useState, useRef, ChangeEvent } from "react";

interface ImageUploaderProps {
  onImageUploaded: (imageDataUrl: string) => void;
}

export default function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        processImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const processImage = (dataUrl: string) => {
    // Create an image to get dimensions
    const img = new Image();
    img.onload = () => {
      // Create a canvas to resize the image if needed
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Max size for better performance
      const maxSize = 800;
      let width = img.width;
      let height = img.height;

      // Resize if too large
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else {
          width = (width / height) * maxSize;
          height = maxSize;
        }
      }

      // Make the image square by cropping
      const size = Math.min(width, height);
      canvas.width = size;
      canvas.height = size;

      if (ctx) {
        // Draw the image centered in the canvas
        const offsetX = (width - size) / 2;
        const offsetY = (height - size) / 2;
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          size,
          size, // Source coordinates
          0,
          0,
          size,
          size // Destination coordinates
        );

        // Get the processed image
        const processedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        onImageUploaded(processedDataUrl);
      }
    };
    img.src = dataUrl;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-cyan-500 bg-indigo-700/50"
            : "border-indigo-500 hover:border-indigo-400"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="text-indigo-100 mb-2">
          <p>Drag and drop an image here</p>
          <p>or</p>
          <button className="mt-2 px-4 py-2 bg-indigo-700 rounded hover:bg-indigo-600">
            Browse files
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <p className="text-xs text-indigo-300 mt-2">
        Images will be cropped to a square for the game
      </p>
    </div>
  );
}
