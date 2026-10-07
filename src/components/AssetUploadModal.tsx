import React, { useState } from 'react';
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  saveCustomCharacterImage,
  saveCustomLogoImage,
  resetAssetsToDefault,
  getCustomCharacterImage,
  getCustomLogoImage,
} from '../utils/assetManager';

interface AssetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetUploadModal: React.FC<AssetUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [characterPreview, setCharacterPreview] = useState<string | null>(() => getCustomCharacterImage());
  const [logoPreview, setLogoPreview] = useState<string | null>(() => getCustomLogoImage());
  const [characterStatus, setCharacterStatus] = useState<string | null>(null);
  const [logoStatus, setLogoStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCharacterFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری (PNG یا JPG) انتخاب کنید.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setCharacterPreview(dataUrl);
      await saveCustomCharacterImage(dataUrl);
      setCharacterStatus('تصویر کاراکتر گُرد با موفقیت ذخیره شد!');
      setTimeout(() => setCharacterStatus(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری (PNG یا JPG) انتخاب کنید.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setLogoPreview(dataUrl);
      await saveCustomLogoImage(dataUrl);
      setLogoStatus('لوگوی گُرد با موفقیت ذخیره شد!');
      setTimeout(() => setLogoStatus(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    if (confirm('آیا مایل به بازنشانی به طرح پیش‌فرض هستید؟')) {
      resetAssetsToDefault();
      setCharacterPreview(null);
      setLogoPreview(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-glass border border-[#FF6B00]/40 space-y-6 text-right max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl glass-input text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-white">
              بارگذاری تصویر اصلی کاراکتر و لوگو
            </h3>
            <div className="p-2 rounded-xl bg-[#FF6B00]/20 text-[#FF6B00]">
              <Upload className="w-5 h-5" />
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          برای اینکه <strong>دقیقاً فایل عکس اصلی شما</strong> (کاراکترشیت یا لوگو) روی کل سایت نمایش داده شود، فایل‌های <code className="text-amber-400 bg-black/40 px-1.5 py-0.5 rounded font-mono">IMG_5171.png</code> و <code className="text-amber-400 bg-black/40 px-1.5 py-0.5 rounded font-mono">IMG_5174.png</code> را در کادرهای زیر بکشید و رها کنید یا انتخاب نمایید:
        </p>

        {/* 1. Character Sheet Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">فایل کاراکترشیت (IMG_5171.png)</span>
            <label className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
              <span>تصویر اصلی کاراکتر مربی گُرد:</span>
            </label>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleCharacterFile(e.dataTransfer.files[0]);
            }}
            className="relative border-2 border-dashed border-[#FF6B00]/40 hover:border-[#FF6B00] rounded-2xl p-5 bg-[#0a1426]/60 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) handleCharacterFile(e.target.files[0]);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {characterPreview ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={characterPreview}
                  alt="کاراکتر گُرد"
                  className="max-h-36 max-w-full object-contain rounded-xl border border-white/10 shadow-lg"
                />
                <span className="text-[11px] text-amber-300 font-bold bg-amber-500/20 px-3 py-1 rounded-full">
                  تصویر فعال است (کلیک برای تعویض)
                </span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 text-[#FF6B00]" />
                </div>
                <div className="text-xs font-black text-white mb-1">
                  فایل تصویر کاراکتر (IMG_5171) را اینجا رها کنید
                </div>
                <div className="text-[11px] text-slate-400">یا برای انتخاب فایل از حافظه کلیک کنید</div>
              </>
            )}
          </div>

          {characterStatus && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{characterStatus}</span>
            </div>
          )}
        </div>

        {/* 2. Logo Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">فایل لوگو (IMG_5174.png)</span>
            <label className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>لوگوی رسمی گُرد:</span>
            </label>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleLogoFile(e.dataTransfer.files[0]);
            }}
            className="relative border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl p-5 bg-[#0a1426]/60 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) handleLogoFile(e.target.files[0]);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {logoPreview ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={logoPreview}
                  alt="لوگوی گُرد"
                  className="max-h-24 max-w-full object-contain rounded-xl border border-white/10 shadow-lg"
                />
                <span className="text-[11px] text-amber-300 font-bold bg-amber-500/20 px-3 py-1 rounded-full">
                  لوگو فعال است (کلیک برای تعویض)
                </span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-xs font-black text-white mb-1">
                  فایل تصویر لوگو (IMG_5174) را اینجا رها کنید
                </div>
                <div className="text-[11px] text-slate-400">یا برای انتخاب فایل از حافظه کلیک کنید</div>
              </>
            )}
          </div>

          {logoStatus && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{logoStatus}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی به پیش‌فرض</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-amber-500 text-slate-950 font-black text-xs shadow-glow transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            تایید و مشاهده در سایت
          </button>
        </div>
      </div>
    </div>
  );
};
