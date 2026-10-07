import React, { useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'تایید و ادامه',
  cancelText = 'انصراف',
  variant = 'primary',
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-sm w-full p-6 shadow-glass space-y-4 border border-white/10 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 left-4 p-1.5 rounded-xl glass-input text-slate-400 hover:text-white transition-colors"
          title="بستن"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDanger
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-glow-red'
                : isWarning
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 shadow-glow'
            }`}
          >
            {isDanger ? (
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            ) : isWarning ? (
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <AlertCircle className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>
          <div>
            <h3 className="text-base font-black text-white">{title}</h3>
            <span className="text-[11px] text-slate-400">پیام تایید عملیات</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">{message}</p>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-2xl text-xs font-bold glass-input text-slate-300 hover:text-white transition-all active:scale-95"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-5 py-2 rounded-2xl text-xs font-black transition-all active:scale-95 ${
              isDanger
                ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-glow-red'
                : 'bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black shadow-glow'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
