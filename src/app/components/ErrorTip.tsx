import React from "react";

type ErrorTipProps = {
  message: string;
  onClose: () => void;
  t: (key: string) => string;
};

export default function ErrorTip({ message, onClose, t }: ErrorTipProps) {
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50 flex items-center gap-2">
      <span>{t(message) ?? message}</span>
      <button className="ml-2 text-white/80 hover:text-white" onClick={onClose}>&times;</button>
    </div>
  );
} 