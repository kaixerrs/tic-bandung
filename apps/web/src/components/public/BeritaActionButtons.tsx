"use client";

import { Share2, MessageCircle, Link as LinkIcon } from "lucide-react";
import { toast } from "react-hot-toast";

export default function BeritaActionButtons({ title }: { title: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Baca artikel menarik ini: ${title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Tautan berhasil disalin!");
  };

  const handleComment = () => {
    toast("Fitur komentar akan segera hadir!", { icon: "💬" });
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleShare}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#3D7A5E] hover:border-[#3D7A5E] hover:bg-green-50 transition-all"
        title="Bagikan"
      >
        <Share2 className="w-4 h-4" />
      </button>
      <button 
        onClick={handleComment}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#3D7A5E] hover:border-[#3D7A5E] hover:bg-green-50 transition-all"
        title="Komentar"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      <button 
        onClick={handleCopy}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#3D7A5E] hover:border-[#3D7A5E] hover:bg-green-50 transition-all"
        title="Salin Tautan"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
