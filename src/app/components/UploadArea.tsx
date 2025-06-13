import React from "react";

type UploadAreaProps = {
  onFiles: (files: FileList | File[]) => void;
  t: (key: string) => string;
};

export default function UploadArea({ onFiles, t }: UploadAreaProps) {
  // 具体逻辑后续实现
  return (
    <label htmlFor="svg-upload-input" className="block cursor-pointer border-2 border-dashed border-gray-300 rounded p-8 text-center bg-white hover:bg-gray-100 transition min-h-[120px] flex flex-col items-center justify-center w-full">
      <input
        type="file"
        accept="image/svg+xml"
        multiple
        className="hidden"
        id="svg-upload-input"
        onChange={e => e.target.files && onFiles(e.target.files)}
      />
      <span className="text-blue-600 font-medium text-lg mb-2">{t("upload")}</span>
      <span className="text-gray-500 text-sm">{t("drag")}</span>
    </label>
  );
} 