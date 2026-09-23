import React, { useState } from 'react';
import { ArrowRightLeft, Calendar, Search, MapPin, SlidersHorizontal } from 'lucide-react';
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
    { label: '전체', value: '' },
    { label: '프리미엄', value: '프리미엄' },
    { label: '우등', value: '우등' },
    { label: '일반', value: '일반' },
  ];

  return (
    <div className="bg-white border border-[#a3c3d9]/60 rounded-[18px] p-6 sm:p-8 mb-8 transition-all shadow-xs text-[#FF206E]">
      {/* Editorial Title & Lead */}
      <div className="mb-6">
        <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#FF206E] tracking-tight leading-tight">
          노선 검색
        </h2>
        <p className="text-[15px] sm:text-[17px] text-[#FF206E]/80 font-normal leading-[1.47] mt-1">
          출발지와 도착지를 선택하여 실시간 배차 일정과 요금을 확인하세요.
        </p>
      </div>

      {/* Route Selector (Departure & Arrival) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 sm:gap-4 items-center">
        {/* Departure Terminal Card */}
        <button
          type="button"
          onClick={() => setModalMode('dep')}
          className="flex items-center justify-between p-4 sm:p-5 rounded-[14px] border border-[#a3c3d9]/60 bg-[#fafafc] hover:bg-white hover:border-[#56638a] text-left transition-all group shadow-2xs"
        >
          <div>
            <div className="text-[12px] font-normal text-[#FF206E]/80 flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF206E]" />
              <span>출발지</span>
            </div>
            <div className="text-[21px] sm:text-[24px] font-semibold text-[#FF206E] tracking-tight group-hover:opacity-80 transition-opacity">
              {depTerminal.name}
            </div>
            <div className="text-[13px] text-[#FF206E]/70 font-normal mt-0.5">{depTerminal.city} 터미널</div>
          </div>
          <span className="text-[13px] text-[#FF206E] font-normal px-3.5 py-1.5 rounded-full bg-white border border-[#a3c3d9] group-hover:border-[#56638a] group-hover:bg-[#a3c3d9]/20 transition-all">
            변경
          </span>
        </button>

        {/* Swap Control */}
        <div className="flex justify-center -my-2 md:my-0">
          <button
            type="button"
            onClick={onSwap}
            title="출발지 / 도착지 맞바꾸기"
            aria-label="출발지 / 도착지 맞바꾸기"
            className="w-10 h-10 rounded-full border border-[#a3c3d9] bg-white text-[#FF206E] hover:bg-[#a3c3d9]/20 hover:border-[#56638a] flex items-center justify-center transition-all active:scale-95 duration-200 shadow-2xs"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#FF206E]" />
          </button>
        </div>

        {/* Arrival Terminal Card */}
        <button
          type="button"
          onClick={() => setModalMode('arr')}
          className="flex items-center justify-between p-4 sm:p-5 rounded-[14px] border border-[#a3c3d9]/60 bg-[#fafafc] hover:bg-white hover:border-[#56638a] text-left transition-all group shadow-2xs"
        >
          <div>
            <div className="text-[12px] font-normal text-[#FF206E]/80 flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF206E]" />
              <span>도착지</span>
            </div>
            <div className="text-[21px] sm:text-[24px] font-semibold text-[#FF206E] tracking-tight group-hover:opacity-80 transition-opacity">
              {arrTerminal.name}
            </div>
            <div className="text-[13px] text-[#FF206E]/70 font-normal mt-0.5">{arrTerminal.city} 터미널</div>
          </div>
          <span className="text-[13px] text-[#FF206E] font-normal px-3.5 py-1.5 rounded-full bg-white border border-[#a3c3d9] group-hover:border-[#56638a] group-hover:bg-[#a3c3d9]/20 transition-all">
            변경
          </span>
        </button>
      </div>

      {/* Date & Grade Controls */}
      <div className="mt-6 pt-6 border-t border-[#a3c3d9]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[13px] text-[#FF206E] font-normal mr-1">
            <Calendar className="w-4 h-4 text-[#FF206E]" />
            <span>가는 날</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onDateChange(todayStr)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-normal transition-all active:scale-95 ${
                selectedDate === todayStr
                  ? 'bg-[#483a58] text-[#FF206E] font-semibold shadow-xs'
                  : 'bg-[#f0f3f8] text-[#FF206E] hover:bg-[#a3c3d9]/30'
              }`}
            >
              오늘 ({today.getMonth() + 1}/{today.getDate()})
            </button>
            <button
              type="button"
              onClick={() => onDateChange(tomorrowStr)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-normal transition-all active:scale-95 ${
                selectedDate === tomorrowStr
                  ? 'bg-[#483a58] text-[#FF206E] font-semibold shadow-xs'
                  : 'bg-[#f0f3f8] text-[#FF206E] hover:bg-[#a3c3d9]/30'
              }`}
            >
              내일 ({tomorrow.getMonth() + 1}/{tomorrow.getDate()})
            </button>
            <button
              type="button"
              onClick={() => onDateChange(dayAfterStr)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-normal transition-all active:scale-95 ${
                selectedDate === dayAfterStr
                  ? 'bg-[#483a58] text-[#FF206E] font-semibold shadow-xs'
                  : 'bg-[#f0f3f8] text-[#FF206E] hover:bg-[#a3c3d9]/30'
              }`}
            >
              모레 ({dayAfter.getMonth() + 1}/{dayAfter.getDate()})
            </button>

            {/* Custom Date Picker */}
            <input
              type="date"
              value={selectedDate}
              min={todayStr}
              onChange={(e) => onDateChange(e.target.value)}
              className="px-3 py-1.5 text-[13px] font-normal border border-[#a3c3d9] rounded-full bg-white text-[#FF206E] focus:outline-none focus:ring-2 focus:ring-[#a3c3d9] focus:border-[#56638a] transition-all"
            />
          </div>
        </div>

        {/* Bus Grade Segmented Control */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[13px] text-[#FF206E] font-normal mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF206E]" />
            <span>등급</span>
          </div>
          <div className="flex bg-[#eef2f7] p-1 rounded-full border border-[#a3c3d9]/40">
            {grades.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => onGradeChange(g.value)}
                className={`px-3 py-1 rounded-full text-[12px] font-normal transition-all active:scale-95 ${
                  selectedGrade === g.value
                    ? 'bg-white text-[#FF206E] font-semibold shadow-xs'
                    : 'text-[#FF206E]/70 hover:text-[#FF206E]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Action: Dusty Grape Pill CTA */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onSearch}
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-[#56638a] hover:bg-[#483a58] active:scale-95 disabled:opacity-50 text-white rounded-full font-normal text-[17px] transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>실시간 배차 정보 확인 중...</span>
            </div>
          ) : (
            <>
              <Search className="w-4 h-4 text-white/90" />
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
