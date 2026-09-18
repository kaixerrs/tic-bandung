"use client";

import React, { useState, useCallback } from 'react';
import { X, Check, Image as ImageIcon, ZoomIn, RotateCw } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './ImageCropperModal';

interface DualImageCropperModalProps {
  isOpen: boolean;
  imageFile: File | null;
  onClose: () => void;
  onCropComplete: (coverBlob: Blob, thumbnailBlob: Blob) => void;
}

export default function DualImageCropperModal({
  isOpen,
  imageFile,
  onClose,
  onCropComplete
}: DualImageCropperModalProps) {
  const [imageSrc, setImageSrc] = useState('');
  
  // Cover State (16:9)
  const [crop1, setCrop1] = useState({ x: 0, y: 0 });
  const [zoom1, setZoom1] = useState(1);
  const [rotation1, setRotation1] = useState(0);
  const [croppedAreaPixels1, setCroppedAreaPixels1] = useState(null);

  // Thumbnail State (4:3)
  const [crop2, setCrop2] = useState({ x: 0, y: 0 });
  const [zoom2, setZoom2] = useState(1);
  const [rotation2, setRotation2] = useState(0);
  const [croppedAreaPixels2, setCroppedAreaPixels2] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImageSrc('');
    }
  }, [imageFile]);

  const onCropComplete1 = useCallback((_: any, croppedPixels: any) => setCroppedAreaPixels1(croppedPixels), []);
  const onCropComplete2 = useCallback((_: any, croppedPixels: any) => setCroppedAreaPixels2(croppedPixels), []);

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels1 || !croppedAreaPixels2) return;
    try {
      setIsProcessing(true);
      
      const coverBlob = await getCroppedImg(imageSrc, croppedAreaPixels1, rotation1);
      const thumbBlob = await getCroppedImg(imageSrc, croppedAreaPixels2, rotation2);
      
      if (coverBlob && thumbBlob) {
        onCropComplete(coverBlob, thumbBlob);
      } else {
        throw new Error("Gagal memotong gambar");
      }
    } catch (e) {
      console.error(e);
      // Fallback: return original file twice if it fails
      if (imageFile) onCropComplete(imageFile, imageFile);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Sesuaikan Cover & Thumbnail</h3>
              <p className="text-xs text-gray-500">Sesuaikan kedua gambar sekaligus dalam satu layar.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Croppers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          
          {/* LEFT: COVER (16:9) */}
          <div className="flex flex-col">
            <div className="bg-gray-50 py-2 px-4 border-b border-gray-100 flex justify-between items-center">
              <span className="font-bold text-sm text-gray-700">1. Cover Utama (16:9)</span>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">UNTUK DETAIL BERITA</span>
            </div>
            
            <div className="relative w-full h-[35vh] lg:h-[45vh] bg-slate-900">
              <Cropper
                image={imageSrc}
                crop={crop1}
                zoom={zoom1}
                rotation={rotation1}
                aspect={16/9}
                onCropChange={setCrop1}
                onCropComplete={onCropComplete1}
                onZoomChange={setZoom1}
                onRotationChange={setRotation1}
              />
            </div>
            
            <div className="p-4 bg-white grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <ZoomIn className="w-3 h-3" /> Zoom
                </label>
                <input
                  type="range" value={zoom1} min={1} max={3} step={0.1}
                  onChange={(e) => setZoom1(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3D7A5E]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Rotasi
                </label>
                <input
                  type="range" value={rotation1} min={0} max={360} step={1}
                  onChange={(e) => setRotation1(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3D7A5E]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: THUMBNAIL (4:3) */}
          <div className="flex flex-col">
            <div className="bg-gray-50 py-2 px-4 border-b border-gray-100 flex justify-between items-center">
              <span className="font-bold text-sm text-gray-700">2. Thumbnail Card (4:3)</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">UNTUK HALAMAN DEPAN</span>
            </div>
            
            <div className="relative w-full h-[35vh] lg:h-[45vh] bg-slate-900">
              <Cropper
                image={imageSrc}
                crop={crop2}
                zoom={zoom2}
                rotation={rotation2}
                aspect={4/3}
                onCropChange={setCrop2}
                onCropComplete={onCropComplete2}
                onZoomChange={setZoom2}
                onRotationChange={setRotation2}
              />
            </div>
            
            <div className="p-4 bg-white grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <ZoomIn className="w-3 h-3" /> Zoom
                </label>
                <input
                  type="range" value={zoom2} min={1} max={3} step={0.1}
                  onChange={(e) => setZoom2(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3D7A5E]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Rotasi
                </label>
                <input
                  type="range" value={rotation2} min={0} max={360} step={1}
                  onChange={(e) => setRotation2(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3D7A5E]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleApplyCrop}
            disabled={isProcessing}
            className="px-8 py-2 rounded-xl font-bold bg-[#3D7A5E] hover:bg-[#2c5c45] text-white transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md"
          >
            {isProcessing ? (
              <>Memproses...</>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Potong & Simpan Keduanya
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
