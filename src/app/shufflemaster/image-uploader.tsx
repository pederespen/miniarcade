"use client";

import { useState, useRef, ChangeEvent } from "react";
import ImageCropper from "./image-cropper";

interface ImageUploaderProps {
  onImageUploaded: (imageDataUrl: string) => void;
}

export default function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
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
        // Set the original image before cropping
        setOriginalImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setOriginalImage(null);
    onImageUploaded(croppedImageUrl);
  };

  const handleCropCancel = () => {
    setOriginalImage(null);
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

  // If an image has been loaded, show the image cropper
  if (originalImage) {
    return (
      <ImageCropper
        imageUrl={originalImage}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    );
  }

  // Otherwise show the file uploader
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
        Upload your image to create a custom puzzle
      </p>
    </div>
  );
}
