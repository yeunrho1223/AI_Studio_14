import React, { useState } from 'react';
import { ArrowRightLeft, Calendar, Search, MapPin, Sparkles, Filter } from 'lucide-react';
import { Terminal } from '../data/terminals';
import { TerminalModal } from './TerminalModal';

interface SearchBoxProps {
  depTerminal: Terminal;
  arrTerminal: Terminal;
  onDepChange: (terminal: Terminal) => void;
  onArrChange: (terminal: Terminal) => void;
  onSwap: () => void;
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  selectedGrade: string; // '' | '우등' | '일반' | '프리미엄'
  onGradeChange: (grade: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  depTerminal,
  arrTerminal,
  onDepChange,
  onArrChange,
  onSwap,
  selectedDate,
  onDateChange,
  selectedGrade,
  onGradeChange,
  onSearch,
  isLoading,
}) => {
  const [modalMode, setModalMode] = useState<'dep' | 'arr' | null>(null);

  // Quick dates (Today, Tomorrow, Day after)
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(today.getDate() + 2);

  const formatDateValue = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = formatDateValue(today);
  const tomorrowStr = formatDateValue(tomorrow);
  const dayAfterStr = formatDateValue(dayAfter);

  const grades = [
    { label: '전체 등급', value: '' },
    { label: '프리미엄', value: '프리미엄' },
    { label: '우등', value: '우등' },
    { label: '일반', value: '일반' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 mb-6">
      {/* Route Selector (Departure & Arrival) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
        {/* Departure */}
        <button
          type="button"
          onClick={() => setModalMode('dep')}
          className="flex items-center justify-between p-4 rounded-2xl border border-stone-200/90 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/20 text-left transition-all group"
        >
          <div>
            <div className="text-xs font-semibold text-stone-400 group-hover:text-emerald-700 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600" />
              <span>출발지</span>
            </div>
            <div className="text-xl font-bold text-stone-900 group-hover:text-emerald-950">
              {depTerminal.name}
            </div>
            <div className="text-xs text-stone-500">{depTerminal.city}</div>
          </div>
          <span className="text-xs text-emerald-700 font-medium px-2 py-1 bg-white rounded-lg border border-stone-200/80 shadow-2xs group-hover:border-emerald-200">
            변경
          </span>
        </button>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 md:my-0">
          <button
            type="button"
            onClick={onSwap}
            title="출발지 / 도착지 맞바꾸기"
            aria-label="출발지 / 도착지 맞바꾸기"
            className="w-10 h-10 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-xs transition-transform active:scale-90 hover:rotate-180 duration-200"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Arrival */}
        <button
          type="button"
          onClick={() => setModalMode('arr')}
          className="flex items-center justify-between p-4 rounded-2xl border border-stone-200/90 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/20 text-left transition-all group"
        >
          <div>
            <div className="text-xs font-semibold text-stone-400 group-hover:text-emerald-700 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600" />
              <span>도착지</span>
            </div>
            <div className="text-xl font-bold text-stone-900 group-hover:text-emerald-950">
              {arrTerminal.name}
            </div>
            <div className="text-xs text-stone-500">{arrTerminal.city}</div>
          </div>
          <span className="text-xs text-emerald-700 font-medium px-2 py-1 bg-white rounded-lg border border-stone-200/80 shadow-2xs group-hover:border-emerald-200">
            변경
          </span>
        </button>
      </div>

      {/* Date & Grade Filters */}
      <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-semibold text-stone-500 mr-1">
            <Calendar className="w-4 h-4 text-stone-400" />
            <span>가는 날</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onDateChange(todayStr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDate === todayStr
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              오늘 ({today.getMonth() + 1}/{today.getDate()})
            </button>
            <button
              type="button"
              onClick={() => onDateChange(tomorrowStr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDate === tomorrowStr
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              내일 ({tomorrow.getMonth() + 1}/{tomorrow.getDate()})
            </button>
            <button
              type="button"
              onClick={() => onDateChange(dayAfterStr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDate === dayAfterStr
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              모레 ({dayAfter.getMonth() + 1}/{dayAfter.getDate()})
            </button>

            {/* Custom Date Input */}
            <input
              type="date"
              value={selectedDate}
              min={todayStr}
              onChange={(e) => onDateChange(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium border border-stone-200 rounded-xl bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Bus Grade Filter */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs font-semibold text-stone-500 mr-1">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span>등급</span>
          </div>
          <div className="flex bg-stone-100 p-1 rounded-xl">
            {grades.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => onGradeChange(g.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedGrade === g.value
                    ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Submit Button */}
      <div className="mt-5">
        <button
          type="button"
          onClick={onSearch}
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-2xl font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>실시간 배차 정보 조회 중...</span>
            </div>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>{depTerminal.name} ➔ {arrTerminal.name} 시간표 조회</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Selection Modals */}
      <TerminalModal
        isOpen={modalMode === 'dep'}
        onClose={() => setModalMode(null)}
        onSelect={onDepChange}
        title="출발 터미널 선택"
        selectedTerminalId={depTerminal.id}
        disabledTerminalId={arrTerminal.id}
      />

      <TerminalModal
        isOpen={modalMode === 'arr'}
        onClose={() => setModalMode(null)}
        onSelect={onArrChange}
        title="도착 터미널 선택"
        selectedTerminalId={arrTerminal.id}
        disabledTerminalId={depTerminal.id}
      />
    </div>
  );
};
