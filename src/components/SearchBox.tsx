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
    <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 sm:p-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
      {/* Editorial Title & Lead */}
      <div className="mb-6 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-[#E30613] rounded-full" />
          <h2 className="text-[22px] font-bold text-[#1E293B] tracking-[-0.01em] leading-[1.35]">
            노선 및 배차 조회
          </h2>
        </div>
        <p className="text-[15px] text-[#64748B] font-normal leading-[1.60] mt-1.5">
          출발지와 도착지를 선택하시면 국토교통부 TAGO 공식 실시간 시간표와 승차권 요금을 확인하실 수 있습니다.
        </p>
      </div>

      {/* Route Selector (Departure & Arrival) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 sm:gap-4 items-center">
        {/* Departure Terminal Card */}
        <button
          type="button"
          onClick={() => setModalMode('dep')}
          className="flex items-center justify-between p-4 sm:p-5 rounded-[12px] border border-[#E2E8F0] bg-[#F7F9FA] hover:bg-white hover:border-[#E30613] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-left transition-all group"
        >
          <div>
            <div className="text-[13px] font-semibold text-[#003B7B] flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E30613]" />
              <span>출발지 터미널</span>
            </div>
            <div className="text-[20px] sm:text-[22px] font-bold text-[#1E293B] tracking-tight group-hover:text-[#E30613] transition-colors">
              {depTerminal.name}
            </div>
            <div className="text-[13px] text-[#64748B] font-normal mt-0.5">{depTerminal.city} 터미널</div>
          </div>
          <span className="text-[13px] text-[#003B7B] font-semibold px-3 py-1.5 rounded-full bg-white border border-[#CBD5E1] group-hover:border-[#E30613] group-hover:text-[#E30613] transition-all">
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
            className="w-10 h-10 rounded-full border border-[#CBD5E1] bg-white text-[#003B7B] hover:text-[#E30613] hover:border-[#E30613] hover:bg-[#F7F9FA] flex items-center justify-center transition-all active:scale-95 duration-200 shadow-xs"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Arrival Terminal Card */}
        <button
          type="button"
          onClick={() => setModalMode('arr')}
          className="flex items-center justify-between p-4 sm:p-5 rounded-[12px] border border-[#E2E8F0] bg-[#F7F9FA] hover:bg-white hover:border-[#E30613] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-left transition-all group"
        >
          <div>
            <div className="text-[13px] font-semibold text-[#003B7B] flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E30613]" />
              <span>도착지 터미널</span>
            </div>
            <div className="text-[20px] sm:text-[22px] font-bold text-[#1E293B] tracking-tight group-hover:text-[#E30613] transition-colors">
              {arrTerminal.name}
            </div>
            <div className="text-[13px] text-[#64748B] font-normal mt-0.5">{arrTerminal.city} 터미널</div>
          </div>
          <span className="text-[13px] text-[#003B7B] font-semibold px-3 py-1.5 rounded-full bg-white border border-[#CBD5E1] group-hover:border-[#E30613] group-hover:text-[#E30613] transition-all">
            변경
          </span>
        </button>
      </div>

      {/* Date & Grade Controls */}
      <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[14px] text-[#1E293B] font-semibold mr-1">
            <Calendar className="w-4 h-4 text-[#003B7B]" />
            <span>가는 날</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onDateChange(todayStr)}
              className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-all active:scale-95 ${
                selectedDate === todayStr
                  ? 'bg-[#003B7B] text-white shadow-xs font-semibold'
                  : 'bg-[#F7F9FA] text-[#1E293B] border border-[#E2E8F0] hover:bg-[#E2E8F0]'
              }`}
            >
              오늘 ({today.getMonth() + 1}/{today.getDate()})
            </button>
            <button
              type="button"
              onClick={() => onDateChange(tomorrowStr)}
              className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-all active:scale-95 ${
                selectedDate === tomorrowStr
                  ? 'bg-[#003B7B] text-white shadow-xs font-semibold'
                  : 'bg-[#F7F9FA] text-[#1E293B] border border-[#E2E8F0] hover:bg-[#E2E8F0]'
              }`}
            >
              내일 ({tomorrow.getMonth() + 1}/{tomorrow.getDate()})
            </button>
            <button
              type="button"
              onClick={() => onDateChange(dayAfterStr)}
              className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-all active:scale-95 ${
                selectedDate === dayAfterStr
                  ? 'bg-[#003B7B] text-white shadow-xs font-semibold'
                  : 'bg-[#F7F9FA] text-[#1E293B] border border-[#E2E8F0] hover:bg-[#E2E8F0]'
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
              className="px-3 py-1.5 text-[13px] font-medium border border-[#CBD5E1] rounded-[6px] bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#E30613]/25 focus:border-[#E30613] transition-all"
            />
          </div>
        </div>

        {/* Bus Grade Segmented Control */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[14px] text-[#1E293B] font-semibold mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#003B7B]" />
            <span>등급</span>
          </div>
          <div className="flex bg-[#F7F9FA] p-1 rounded-[6px] border border-[#E2E8F0]">
            {grades.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => onGradeChange(g.value)}
                className={`px-3 py-1 rounded-[4px] text-[12px] font-medium transition-all active:scale-95 ${
                  selectedGrade === g.value
                    ? 'bg-[#003B7B] text-white shadow-xs font-semibold'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Action Button: button-primary (NHIS Warm Red Fill #E30613, Pill shape) */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onSearch}
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-[#E30613] hover:bg-[#C40510] active:scale-[0.99] disabled:opacity-50 text-white rounded-full font-bold text-[16px] transition-all flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(227,6,19,0.25)]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>실시간 배차 정보 조회 중...</span>
            </div>
          ) : (
            <>
              <Search className="w-4 h-4 text-white" />
              <span>{depTerminal.name} ➔ {arrTerminal.name} 실시간 시간표 조회</span>
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
