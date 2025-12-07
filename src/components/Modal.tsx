"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: "default" | "error" | "success";
}

export default function Modal({ isOpen, onClose, title, children, type = "default" }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setVisible(true));
    } else {
      document.body.style.overflow = 'unset';
      setVisible(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const borderColor = 
    type === "error" ? "border-red-500/50" : 
    type === "success" ? "border-green-500/50" : 
    "border-white/10";

  const glowColor = 
    type === "error" ? "shadow-[0_0_50px_rgba(239,68,68,0.2)]" : 
    type === "success" ? "shadow-[0_0_50px_rgba(34,197,94,0.2)]" : 
    "shadow-2xl";

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-2xl bg-[#0a0a0a] border ${borderColor} rounded-2xl p-6 ${glowColor} max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out transform ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className={`text-xl font-bold mb-4 ${type === "error" ? "text-red-500" : type === "success" ? "text-green-500" : "text-white"}`}>
          {title}
        </h3>

        <div className="text-gray-300">
          {children}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
