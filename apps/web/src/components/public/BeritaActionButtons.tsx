"use client";

import { Share2, MessageCircle, Link as LinkIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function BeritaActionButtons({ title }: { title: string }) {
  const t = useTranslations("Components");
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `${t('readArticle')}  ${title}`,
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
    toast.success(t("linkCopied"));
  };

  const handleComment = () => {
    toast(t("commentsSoon"), { icon: "💬" });
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleShare}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#3D7A5E] hover:border-[#3D7A5E] hover:bg-green-50 transition-all"
        title={t("share")}>
        <Share2 className="w-4 h-4" />
      </button>
      <button 
        onClick={handleComment}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#3D7A5E] hover:border-[#3D7A5E] hover:bg-green-50 transition-all"
        title={t("comment")}>
        <MessageCircle className="w-4 h-4" />
      </button>
      <button 
        onClick={handleCopy}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#3D7A5E] hover:border-[#3D7A5E] hover:bg-green-50 transition-all"
        title={t("copyLink")}>
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
