import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Dumbbell,
  Lock,
  Mail,
  Sparkles,
  User,
  UserPlus,
  X,
  Zap,
} from 'lucide-react';
import { UserAccount } from '../types/fitness';
import { getAllUsers, loginUser, registerUser } from '../utils/userManager';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const existingUsers = getAllUsers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register' && !name.trim()) {
      setError('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }
    if (!email.trim()) {
      setError('لطفاً ایمیل یا نام کاربری خود را وارد کنید.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const newUser = registerUser(name, email, password);
        onLoginSuccess(newUser);
        onClose();
      } else {
        const user = loginUser(email, password);
        onLoginSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'خطایی در پردازش اطلاعات رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExistingUser = (u: UserAccount) => {
    try {
      const user = loginUser(u.email);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-glass space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] shadow-glow">
              <User className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {mode === 'login' ? 'ورود به حساب کاربری' : 'ثبت‌نام و عضویت در FitGen'}
              </h3>
              <p className="text-[11px] text-slate-400">
                برنامه‌ها، وزنه‌ها و سوابق شما در حسابتان ذخیره می‌شود
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl glass-input text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-black/40 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              mode === 'login'
                ? 'bg-[#FF6B00] text-black shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ورود به حساب
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              mode === 'register'
                ? 'bg-[#FF6B00] text-black shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ثبت‌نام حساب جدید
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 shadow-glow-red">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">نام و نام خانوادگی:</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: رضا محمدی"
                  required
                  className="glass-input w-full rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">ایمیل یا نام کاربری:</label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="مثال: ali@fitgen.ir"
                required
                className="glass-input w-full rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 text-left font-sans"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">رمز عبور (اختیاری):</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور دلخواه"
                className="glass-input w-full rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 text-left font-mono"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black font-black text-xs sm:text-sm shadow-glow transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'در حال پردازش...' : mode === 'register' ? 'ایجاد حساب کاربری' : 'ورود به پنل'}
          </button>
        </form>

        {/* Existing Accounts quick selection */}
        {existingUsers.length > 0 && (
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
              <span>حساب‌های موجود روی این دستگاه:</span>
              <span className="text-[#FF6B00] font-normal">ورود سریع با ۱ کلیک</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {existingUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectExistingUser(u)}
                  className="w-full p-2.5 rounded-xl glass-input hover:bg-white/10 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{u.avatar}</span>
                    <div className="text-right">
                      <div className="font-bold text-white text-xs">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#FF6B00] font-bold">ورود →</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
