"use client";
import clsx from "clsx";
import React, { useState } from "react";

type UploadAreaProps = {
  onFiles: (files: FileList | File[]) => void;
  t: (key: string) => string;
};

export default function UploadArea({ onFiles, t }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    setIsDragging(true);
    console.log("dragging");
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setIsDragging(false);
    console.log("Drag leave");
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    if(e.dataTransfer.files) {
      onFiles(e.dataTransfer.files);
    }
    e.preventDefault();
  };
  // 具体逻辑后续实现
  return (
    <label
      htmlFor="svg-upload-input"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={clsx(
        "cursor-pointer border-2 border-dashed border-gray-300 rounded p-8 text-center  transition min-h-[120px] flex flex-col items-center justify-center w-full",
        {
          "bg-white hover:bg-gray-100": !isDragging,
          "bg-blue-50": isDragging,
        }
      )}
    >
      <input
        type="file"
        accept="image/svg+xml"
        multiple
        className="hidden"
        id="svg-upload-input"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
      <span className="text-blue-600 font-medium text-lg mb-2">
        {t("upload")}
      </span>
      <span className="text-gray-500 text-sm">{t("drag")}</span>
    </label>
  );
}
