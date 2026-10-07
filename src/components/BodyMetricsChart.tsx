import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { BodyMetricLog, UserProfile } from '../types/fitness';
import { ConfirmModal } from './ConfirmModal';
import { normalizePersianDigits } from '../utils/numberUtils';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Calendar,
  Scale,
  Activity,
  Target,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface BodyMetricsChartProps {
  profile: UserProfile;
}

const LOCAL_STORAGE_KEY_METRICS = 'fitgen_body_metrics_history';

export const BodyMetricsChart: React.FC<BodyMetricsChartProps> = ({ profile }) => {
  const [logs, setLogs] = useState<BodyMetricLog[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [chartType, setChartType] = useState<'weight' | 'bmi' | 'measurements'>('weight');
  const [logToDelete, setLogToDelete] = useState<string | null>(null);

  // New entry form state
  const [newWeight, setNewWeight] = useState<number>(profile.weight || 75);
  const [newDate, setNewDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [newBodyFat, setNewBodyFat] = useState<string>('');
  const [newWaist, setNewWaist] = useState<string>('');
  const [newChest, setNewChest] = useState<string>('');
  const [newArm, setNewArm] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');

  // Load from localStorage or initialize with seed history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_METRICS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLogs(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load metrics from localStorage:', e);
    }

    // Default seed data based on user profile so the chart is immediately rich and informative
    const heightInMeters = profile.height / 100;
    const initialBmi = Number((profile.weight / (heightInMeters * heightInMeters)).toFixed(1));

    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(d1.getDate() - 21);
    const d2 = new Date(today);
    d2.setDate(d2.getDate() - 14);
    const d3 = new Date(today);
    d3.setDate(d3.getDate() - 7);
    const d4 = new Date(today);

    const isLosing = profile.targetWeight < profile.weight;
    const stepDiff = Math.abs(profile.weight - profile.targetWeight) > 0 ? 0.6 : 0;

    const seed: BodyMetricLog[] = [
      {
        id: '1',
        date: d1.toISOString().split('T')[0],
        timestamp: d1.getTime(),
        weight: isLosing ? Number((profile.weight + stepDiff * 2.5).toFixed(1)) : Number((profile.weight - stepDiff * 2.5).toFixed(1)),
        targetWeight: profile.targetWeight,
        bmi: Number(((isLosing ? profile.weight + stepDiff * 2.5 : profile.weight - stepDiff * 2.5) / (heightInMeters * heightInMeters)).toFixed(1)),
        waistCircumference: 88,
        armCircumference: 35,
        bodyFatPercentage: 21,
        notes: 'شروع دوره ارزیابی اولیه',
      },
      {
        id: '2',
        date: d2.toISOString().split('T')[0],
        timestamp: d2.getTime(),
        weight: isLosing ? Number((profile.weight + stepDiff * 1.5).toFixed(1)) : Number((profile.weight - stepDiff * 1.5).toFixed(1)),
        targetWeight: profile.targetWeight,
        bmi: Number(((isLosing ? profile.weight + stepDiff * 1.5 : profile.weight - stepDiff * 1.5) / (heightInMeters * heightInMeters)).toFixed(1)),
        waistCircumference: 87,
        armCircumference: 35.3,
        bodyFatPercentage: 20.4,
        notes: 'هفته اول تمرینات و تطبیق با برنامه',
      },
      {
        id: '3',
        date: d3.toISOString().split('T')[0],
        timestamp: d3.getTime(),
        weight: isLosing ? Number((profile.weight + stepDiff * 0.7).toFixed(1)) : Number((profile.weight - stepDiff * 0.7).toFixed(1)),
        targetWeight: profile.targetWeight,
        bmi: Number(((isLosing ? profile.weight + stepDiff * 0.7 : profile.weight - stepDiff * 0.7) / (heightInMeters * heightInMeters)).toFixed(1)),
        waistCircumference: 86,
        armCircumference: 35.8,
        bodyFatPercentage: 19.8,
        notes: 'رعایت دقیق کالری و خواب منظم',
      },
      {
        id: '4',
        date: d4.toISOString().split('T')[0],
        timestamp: d4.getTime(),
        weight: profile.weight,
        targetWeight: profile.targetWeight,
        bmi: initialBmi,
        waistCircumference: 85,
        armCircumference: 36.2,
        bodyFatPercentage: 19.2,
        notes: 'وضعیت فعلی (ثبت شده در پروفایل)',
      },
    ];

    setLogs(seed);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_METRICS, JSON.stringify(seed));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  // Save to localStorage whenever logs change
  const saveLogs = (updated: BodyMetricLog[]) => {
    setLogs(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_METRICS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || !newDate) return;

    const heightInMeters = profile.height / 100;
    const calculatedBmi = Number((newWeight / (heightInMeters * heightInMeters)).toFixed(1));

    const newLog: BodyMetricLog = {
      id: Date.now().toString(),
      date: newDate,
      timestamp: new Date(newDate).getTime(),
      weight: Number(newWeight),
      targetWeight: profile.targetWeight,
      bmi: calculatedBmi,
      bodyFatPercentage: newBodyFat ? Number(newBodyFat) : undefined,
      waistCircumference: newWaist ? Number(newWaist) : undefined,
      chestCircumference: newChest ? Number(newChest) : undefined,
      armCircumference: newArm ? Number(newArm) : undefined,
      notes: newNotes.trim() || undefined,
    };

    // Sort chronologically
    const updated = [...logs, newLog].sort((a, b) => a.timestamp - b.timestamp);
    saveLogs(updated);

    // Reset inputs
    setNewNotes('');
    setShowAddForm(false);
  };

  const confirmDeleteEntry = () => {
    if (!logToDelete) return;
    const updated = logs.filter((log) => log.id !== logToDelete);
    saveLogs(updated);
    setLogToDelete(null);
  };

  const handleDeleteEntry = (id: string) => {
    setLogToDelete(id);
  };

  // Calculations for stats
  const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);
  const firstLog = sortedLogs[0];
  const latestLog = sortedLogs[sortedLogs.length - 1];

  const initialWeight = firstLog ? firstLog.weight : profile.weight;
  const currentWeight = latestLog ? latestLog.weight : profile.weight;
  const targetWeight = profile.targetWeight;
  const totalChange = Number((currentWeight - initialWeight).toFixed(1));
  const remainingToGoal = Number((currentWeight - targetWeight).toFixed(1));

  // Progress percentage
  const totalGoalDelta = Math.abs(targetWeight - initialWeight);
  const currentDeltaDone = Math.abs(currentWeight - initialWeight);
  const progressPercent =
    totalGoalDelta > 0 ? Math.min(100, Math.max(0, Math.round((currentDeltaDone / totalGoalDelta) * 100))) : 100;

  // Custom Persian Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as BodyMetricLog;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-2xl shadow-2xl text-xs space-y-1.5 font-sans min-w-[180px]">
          <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>تاریخ ثبت:</span>
            <span className="text-white font-mono">{label}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-bold">وزن ثبت شده:</span>
            <span className="text-white font-bold font-mono">{dataPoint.weight} kg</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>شاخص BMI:</span>
            <span className="text-purple-300 font-bold font-mono">{dataPoint.bmi}</span>
          </div>

          {dataPoint.bodyFatPercentage && (
            <div className="flex items-center justify-between text-slate-400">
              <span>درصد چربی:</span>
              <span className="text-cyan-300 font-bold font-mono">{dataPoint.bodyFatPercentage}%</span>
            </div>
          )}

          {dataPoint.waistCircumference && (
            <div className="flex items-center justify-between text-slate-400">
              <span>دور کمر:</span>
              <span className="text-emerald-300 font-bold font-mono">{dataPoint.waistCircumference} cm</span>
            </div>
          )}

          {dataPoint.armCircumference && (
            <div className="flex items-center justify-between text-slate-400">
              <span>دور بازو:</span>
              <span className="text-rose-300 font-bold font-mono">{dataPoint.armCircumference} cm</span>
            </div>
          )}

          {dataPoint.notes && (
            <div className="pt-1 border-t border-slate-800 text-[11px] text-amber-300/80 italic">
              «{dataPoint.notes}»
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="p-6 rounded-3xl glass-panel shadow-glass space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-2xl bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 shadow-glow">
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </span>
              <h3 className="text-lg font-black text-white">روند تغییرات وزن و شاخص‌های بدنی (Progress Tracking)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ثبت مستمر وزن و ابعاد عضلانی جهت رصد روند دستیابی به هدف و تنظیم برنامه‌های آتی
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black shadow-glow transition-all active:scale-95 no-print cursor-pointer"
          >
            {showAddForm ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
            <span>{showAddForm ? 'بستن فرم' : 'ثبت رکورد وزن جدید'}</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl glass-input text-center">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">وزن نقطه شروع</span>
            <div className="text-xl sm:text-2xl font-black text-slate-200 font-mono">{initialWeight} kg</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">اولین رکورد</span>
          </div>

          <div className="p-4 rounded-2xl glass-input text-center">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">وزن کنونی</span>
            <div className="text-xl sm:text-2xl font-black text-[#FF6B00] font-mono">{currentWeight} kg</div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">آخرین اندازه‌گیری</span>
          </div>

          <div className="p-4 rounded-2xl glass-input text-center">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">وزن هدف</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{targetWeight} kg</div>
            <span className="text-[10px] text-emerald-500/80 mt-0.5 block">
              {remainingToGoal === 0
                ? 'به هدف رسیده‌اید! 🎉'
                : `${Math.abs(remainingToGoal)} کیلوگرم فاصله`}
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-input text-center">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">تغییر کل ثبت‌شده</span>
            <div
              className={`text-xl sm:text-2xl font-black font-mono flex items-center justify-center gap-1 ${
                totalChange > 0
                  ? 'text-orange-400'
                  : totalChange < 0
                  ? 'text-cyan-400'
                  : 'text-slate-300'
              }`}
            >
              {totalChange > 0 ? `+${totalChange}` : totalChange} kg
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">از شروع تا کنون</span>
          </div>
        </div>

        {/* Progress Bar towards Target */}
        <div className="p-4 rounded-2xl glass-input">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FF6B00]" />
              میزان پیشرفت به سمت وزن هدف ({targetWeight} kg)
            </span>
            <span className="text-[#FF6B00] font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF6B00] to-emerald-400 rounded-full transition-all duration-500 shadow-glow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add New Entry Form Modal/Collapsible */}
      {showAddForm && (
        <form
          onSubmit={handleAddEntry}
          className="p-6 rounded-3xl glass-panel border border-[#FF6B00]/40 shadow-glow space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#FF6B00]" />
              ثبت اندازه‌گیری و وزن جدید در تاریخ انتخابی
            </h4>
            <span className="text-xs text-slate-400">ذخیره خودکار در مرورگر (LocalStorage)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">تاریخ ثبت</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">وزن جدید</label>
              <div className="flex flex-row-reverse items-center justify-between glass-input rounded-xl px-3 py-2 border border-slate-700 focus-within:border-[#FF6B00]">
                <span className="text-xs text-slate-400 font-mono font-bold select-none">kg</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={newWeight === 0 ? '' : String(newWeight)}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const norm = normalizePersianDigits(e.target.value);
                    setNewWeight(norm === '' ? 0 : Number(norm));
                  }}
                  className="w-full bg-transparent text-xs text-white focus:outline-none font-mono text-right"
                  placeholder="مثلاً 75"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">درصد چربی بدنی (اختیاری)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="مثلاً 18.5"
                value={newBodyFat}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setNewBodyFat(normalizePersianDigits(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-right"
              />
            </div>
          </div>

          {/* Optional Circumferences */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">دور کمر (cm - اختیاری)</label>
              <input
                type="number"
                step="0.5"
                placeholder="مثلاً 84"
                value={newWaist}
                onChange={(e) => setNewWaist(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">دور بازو (cm - اختیاری)</label>
              <input
                type="number"
                step="0.5"
                placeholder="مثلاً 36"
                value={newArm}
                onChange={(e) => setNewArm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">دور سینه (cm - اختیاری)</label>
              <input
                type="number"
                step="0.5"
                placeholder="مثلاً 102"
                value={newChest}
                onChange={(e) => setNewChest(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">یادداشت وضعیت یا احساس بدنی</label>
            <input
              type="text"
              placeholder="مثلاً پایان هفته دوم حجم، احساس انرژی عالی و خواب عمیق"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-2xl text-xs font-black bg-gradient-to-r from-[#FF6B00] to-orange-400 hover:from-orange-500 hover:to-orange-400 text-black transition-all shadow-glow active:scale-95"
            >
              افزودن و بروزرسانی نمودار
            </button>
          </div>
        </form>
      )}

      {/* Chart View Selection & Recharts Canvas */}
      <div className="p-6 rounded-3xl glass-panel shadow-glass space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF6B00]" />
            <h4 className="text-sm font-black text-white">انتخاب نمودار تحلیلی</h4>
          </div>

          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/5 text-xs">
            <button
              onClick={() => setChartType('weight')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                chartType === 'weight'
                  ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              روند وزن و هدف
            </button>
            <button
              onClick={() => setChartType('bmi')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                chartType === 'bmi'
                  ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              شاخص توده بدنی (BMI)
            </button>
            <button
              onClick={() => setChartType('measurements')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                chartType === 'measurements'
                  ? 'bg-[#FF6B00] text-black shadow-glow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              سایز دور عضلات
            </button>
          </div>
        </div>

        {/* RECHARTS CONTAINER */}
        <div className="h-[360px] w-full pt-4 font-mono text-xs">
          {chartType === 'weight' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sortedLogs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  domain={['dataMin - 3', 'dataMax + 3']}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  unit=" kg"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => (value === 'weight' ? 'وزن ثبت شده (kg)' : value)}
                />
                <ReferenceLine
                  y={targetWeight}
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: `وزن هدف: ${targetWeight} kg`,
                    fill: '#10b981',
                    position: 'top',
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#FF6B00"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightGrad)"
                  dot={{ r: 5, fill: '#FF6B00', stroke: '#0f172a', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#ff8533' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {chartType === 'bmi' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedLogs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => (value === 'bmi' ? 'شاخص BMI' : value)}
                />
                <ReferenceLine
                  y={24.9}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{ value: 'مرز وزن نرمال (24.9)', fill: '#ef4444', position: 'top', fontSize: 10 }}
                />
                <ReferenceLine
                  y={18.5}
                  stroke="#3b82f6"
                  strokeDasharray="3 3"
                  label={{ value: 'کف وزن نرمال (18.5)', fill: '#3b82f6', position: 'bottom', fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#a855f7', stroke: '#0f172a', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {chartType === 'measurements' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedLogs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" cm" />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => {
                    if (value === 'waistCircumference') return 'دور کمر (cm)';
                    if (value === 'armCircumference') return 'دور بازو (cm)';
                    if (value === 'chestCircumference') return 'دور سینه (cm)';
                    return value;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="waistCircumference"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981' }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="armCircumference"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#f43f5e' }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="chestCircumference"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#06b6d4' }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* History Table with Delete action */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <h4 className="text-sm font-black text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            تاریخچه رکوردهای ثبت‌شده در مرورگر
          </span>
          <span className="text-xs text-slate-400 font-normal">{logs.length} رکورد</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">تاریخ</th>
                <th className="py-2.5 px-3">وزن (kg)</th>
                <th className="py-2.5 px-3">شاخص BMI</th>
                <th className="py-2.5 px-3">درصد چربی</th>
                <th className="py-2.5 px-3">دور کمر</th>
                <th className="py-2.5 px-3">دور بازو</th>
                <th className="py-2.5 px-3">یادداشت</th>
                <th className="py-2.5 px-3 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="py-2.5 px-3 font-mono text-slate-300">{log.date}</td>
                  <td className="py-2.5 px-3 font-bold text-amber-400 font-mono">{log.weight}</td>
                  <td className="py-2.5 px-3 font-mono text-purple-300">{log.bmi}</td>
                  <td className="py-2.5 px-3 font-mono text-cyan-300">
                    {log.bodyFatPercentage ? `${log.bodyFatPercentage}%` : '-'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-300">
                    {log.waistCircumference ? `${log.waistCircumference} cm` : '-'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-rose-300">
                    {log.armCircumference ? `${log.armCircumference} cm` : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-[200px] truncate">
                    {log.notes || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-left">
                    <button
                      onClick={() => handleDeleteEntry(log.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all"
                      title="حذف این رکورد"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!logToDelete}
        title="حذف ثبت وزن و ابعاد بدنی"
        message="آیا از حذف این رکورد پیشرفت بدنی اطمینان دارید؟ نمودار و آمار به صورت خودکار به‌روزرسانی خواهند شد."
        confirmText="حذف رکورد"
        cancelText="انصراف"
        variant="danger"
        onConfirm={confirmDeleteEntry}
        onCancel={() => setLogToDelete(null)}
      />
    </div>
  );
};
