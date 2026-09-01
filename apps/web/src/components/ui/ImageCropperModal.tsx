"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, Check, Crop } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob | null> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, 'image/jpeg', 0.9);
  });
};

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
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const imageSrc = React.useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    return '';
  }, [imageFile]);

  React.useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
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
              <Crop className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-lg">Sesuaikan Foto</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-6">
          <div className="flex items-center gap-4 px-2">
            <ZoomOut className="w-5 h-5 text-slate-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(Number(e.target.value));
              }}
              className="w-full h-2 bg-slate-200 rounded-sm appearance-none cursor-pointer accent-amber-500"
            />
            <ZoomIn className="w-5 h-5 text-slate-400" />
          </div>

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
                  Terapkan Crop
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
