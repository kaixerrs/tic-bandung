"use client";

import React, { useState } from 'react';
import { X, Check, Image as ImageIcon } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageFile: File | null;
  aspectRatio?: number;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}

export default function ImageCropperModal({
  isOpen,
  imageFile,
  aspectRatio,
  onClose,
  onCropComplete
}: ImageCropperModalProps) {
  const [imageSrc, setImageSrc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageSrc(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageSrc('');
    }
  }, [imageFile]);

  const handleApplyCrop = async () => {
    if (!imageFile) return;
    try {
      setIsProcessing(true);
      // BYPASS CROPPER: return original file
      onCropComplete(imageFile);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-sm w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-lg">Pratinjau Foto</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-900 flex items-center justify-center p-4">
          <img src={imageSrc} alt="Preview" className="max-w-full max-h-full object-contain" />
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-6">
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleApplyCrop}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl font-bold bg-[#3D7A5E] hover:bg-[#2c5c45] text-white transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>Memproses...</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Gunakan Foto Ini
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
