import React, { useState, useMemo } from 'react';
import { Clock, ExternalLink, ArrowRight, ChevronDown, Check } from 'lucide-react';
import { BusSchedule } from '../types';
import { Terminal } from '../data/terminals';

interface ScheduleListProps {
  schedules: BusSchedule[];
  depTerminal: Terminal;
  arrTerminal: Terminal;
  selectedDate: string;
  isLive: boolean;
  notice?: string;
  isLoading: boolean;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  depTerminal,
  arrTerminal,
  selectedDate,
  isLive,
  notice,
  isLoading,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'night'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'fareAsc' | 'duration'>('time');

  // Format YYYYMMDDHHmm to HH:mm
  const formatTime = (timeStr: string) => {
    if (!timeStr || timeStr.length < 12) return '--:--';
    const clean = timeStr.replace(/\D/g, '');
    const hour = clean.slice(8, 10);
    const min = clean.slice(10, 12);
    return `${hour}:${min}`;
  };

  // Format date display
  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[0]}년 ${parseInt(parts[1], 10)}월 ${parseInt(parts[2], 10)}일`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Format duration into hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    if (mins === 0) return `${hours}시간`;
    return `${hours}시간 ${mins}분`;
  };

  // Filter and Sort
  const processedSchedules = useMemo(() => {
    let list = [...schedules];

    // Filter by time of day
    if (timeFilter !== 'all') {
      list = list.filter((item) => {
        const clean = item.depPlandTime.replace(/\D/g, '');
        const hour = parseInt(clean.slice(8, 10) || '0', 10);
        if (timeFilter === 'morning') return hour >= 4 && hour < 12;
        if (timeFilter === 'afternoon') return hour >= 12 && hour < 18;
        if (timeFilter === 'night') return hour >= 18 || hour < 4;
        return true;
      });
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'fareAsc') return a.charge - b.charge;
      if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
      // Default: departure time
      return a.depPlandTime.localeCompare(b.depPlandTime);
    });

    return list;
  }, [schedules, timeFilter, sortBy]);

  return (
    <div className="space-y-5">
      {/* Notice Banner */}
      {notice && (
        <div className="p-4 sm:p-5 rounded-[14px] bg-[#fafafc] border border-[#a3c3d9]/60 text-[#FF206E] text-[13px] leading-[1.5] flex items-start gap-3 shadow-2xs">
          <div className="w-2 h-2 rounded-full bg-[#a8c686] mt-1.5 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-[#FF206E]">{isLive ? '실시간 연동 안내' : '배차 안내'}: </span>
            <span className="text-[#FF206E]/85">{notice}</span>
          </div>
        </div>
      )}

      {/* Header bar: Route Summary & Filter controls */}
      <div className="bg-white rounded-[18px] border border-[#a3c3d9]/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs text-[#FF206E]">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center gap-2 text-[#FF206E] text-[13px] font-normal mb-1">
            <span>{formatDateDisplay(selectedDate)}</span>
            <span aria-hidden="true" className="text-[#a3c3d9]">·</span>
            <span>총 {schedules.length}회 운행</span>
            {isLive && (
              <>
                <span aria-hidden="true" className="text-[#a3c3d9]">·</span>
                <span className="text-[#2d4b1a] bg-[#a8c686]/25 border border-[#a8c686]/50 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#2d4b1a]" />
                  국토교통부 실시간
                </span>
              </>
            )}
          </div>

          <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#FF206E] tracking-tight flex items-center gap-2.5">
            <span>{depTerminal.name}</span>
            <ArrowRight className="w-4 h-4 text-[#FF206E]" />
            <span>{arrTerminal.name}</span>
          </h2>
        </div>

        {/* Time filters & Sorting */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Time filter segmented control */}
          <div className="flex bg-[#eef2f7] p-1 rounded-full text-[13px] border border-[#a3c3d9]/40">
            <button
              type="button"
              onClick={() => setTimeFilter('all')}
              className={`px-3.5 py-1 rounded-full font-normal transition-all active:scale-95 ${
                timeFilter === 'all' ? 'bg-[#483a58] text-[#FF206E] font-semibold shadow-xs' : 'text-[#FF206E]/70 hover:text-[#FF206E]'
              }`}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('morning')}
              className={`px-3.5 py-1 rounded-full font-normal transition-all active:scale-95 ${
                timeFilter === 'morning' ? 'bg-[#483a58] text-[#FF206E] font-semibold shadow-xs' : 'text-[#FF206E]/70 hover:text-[#FF206E]'
              }`}
            >
              오전
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('afternoon')}
              className={`px-3.5 py-1 rounded-full font-normal transition-all active:scale-95 ${
                timeFilter === 'afternoon' ? 'bg-[#483a58] text-[#FF206E] font-semibold shadow-xs' : 'text-[#FF206E]/70 hover:text-[#FF206E]'
              }`}
            >
              오후
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('night')}
              className={`px-3.5 py-1 rounded-full font-normal transition-all active:scale-95 ${
                timeFilter === 'night' ? 'bg-[#483a58] text-[#FF206E] font-semibold shadow-xs' : 'text-[#FF206E]/70 hover:text-[#FF206E]'
              }`}
            >
              야간
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white border border-[#a3c3d9] text-[#FF206E] text-[13px] font-normal py-1.5 pl-3.5 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-[#a3c3d9] focus:border-[#56638a] cursor-pointer transition-all"
            >
              <option value="time">출발 빠른순</option>
              <option value="fareAsc">요금 낮은순</option>
              <option value="duration">소요시간 짧은순</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#FF206E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Schedule Items List */}
      {processedSchedules.length === 0 ? (
        <div className="bg-white rounded-[18px] border border-[#a3c3d9]/60 p-12 text-center shadow-xs">
          <p className="text-[#FF206E] text-[17px] font-semibold mb-1">
            해당 조건의 배차 정보가 없습니다.
          </p>
          <p className="text-[#FF206E]/80 text-[14px] font-normal">
            시간대 필터를 변경하거나 다른 날짜로 조회해보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {processedSchedules.map((schedule, idx) => {
            const depTime = formatTime(schedule.depPlandTime);
            const arrTime = formatTime(schedule.arrPlandTime);

            const isPremium = schedule.gradeNm.includes('프리미엄');
            const isUdeung = schedule.gradeNm.includes('우등');
            const isGeneral = schedule.gradeNm.includes('일반');

            const gradeBadgeClass = isPremium
              ? 'bg-[#56203d]/15 text-[#56203d] border border-[#56203d]/30 font-semibold'
              : isUdeung
                ? 'bg-[#56638a]/15 text-[#56638a] border border-[#56638a]/30 font-semibold'
                : isGeneral
                  ? 'bg-[#a8c686]/25 text-[#2d4b1a] border border-[#a8c686]/50 font-semibold'
                  : 'bg-[#a3c3d9]/30 text-[#56638a] border border-[#a3c3d9]/60 font-semibold';

            return (
              <div
                key={schedule.routeId || idx}
                className="bg-white rounded-[18px] border border-[#a3c3d9]/50 hover:border-[#56638a] hover:shadow-[0_4px_20px_rgba(86,99,138,0.12)] p-5 sm:p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Time & Route Info */}
                <div className="flex items-center gap-5 sm:gap-8">
                  {/* Departure & Arrival Times */}
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <div className="text-[26px] sm:text-[30px] font-semibold text-[#FF206E] tracking-tight leading-none">
                        {depTime}
                      </div>
                      <div className="text-[13px] text-[#FF206E]/80 font-normal mt-1">
                        {schedule.depPlaceNm || depTerminal.name}
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <div className="text-[11px] font-normal text-[#FF206E]/80 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF206E]" />
                        <span>{formatDuration(schedule.durationMinutes)}</span>
                      </div>
                      <div className="w-16 sm:w-24 h-[1.5px] bg-[#a3c3d9] relative flex items-center justify-end">
                        <ArrowRight className="w-3.5 h-3.5 text-[#FF206E] absolute -right-1" />
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="text-[26px] sm:text-[30px] font-semibold text-[#FF206E] tracking-tight leading-none">
                        {arrTime}
                      </div>
                      <div className="text-[13px] text-[#FF206E]/80 font-normal mt-1">
                        {schedule.arrPlaceNm || arrTerminal.name}
                      </div>
                    </div>
                  </div>

                  {/* Grade Badge & Operating Schedule in parentheses */}
                  <div className="hidden md:flex flex-col items-start gap-1">
                    <span className={`text-[12px] px-2.5 py-0.5 rounded-full ${gradeBadgeClass}`}>
                      {schedule.gradeNm}
                    </span>
                    <span className="text-[12px] text-[#FF206E] font-normal">
                      운행 일정 ({depTime} ~ {arrTime})
                    </span>
                  </div>
                </div>

                {/* Mobile Grade & Schedule view */}
                <div className="md:hidden flex items-center justify-between gap-2 -mt-1 pt-2 border-t border-[#a3c3d9]/20">
                  <span className={`text-[12px] px-2.5 py-0.5 rounded-full ${gradeBadgeClass}`}>
                    {schedule.gradeNm}
                  </span>
                  <span className="text-[12px] text-[#FF206E] font-normal">
                    운행 일정 ({depTime} ~ {arrTime})
                  </span>
                </div>

                {/* Fare & CTA */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#a3c3d9]/20">
                  <div className="text-right">
                    <div className="text-[11px] text-[#FF206E]/70 font-normal">성인 1인</div>
                    <div className="text-[20px] sm:text-[22px] font-semibold text-[#FF206E] tracking-tight">
                      {schedule.charge > 0 ? `${schedule.charge.toLocaleString()}원` : '현장문의'}
                    </div>
                  </div>

                  <a
                    href="https://www.kobus.co.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#56638a] hover:bg-[#483a58] text-white text-[13px] font-normal transition-all active:scale-95 whitespace-nowrap shadow-xs"
                  >
                    <span>예매</span>
                    <ExternalLink className="w-3 h-3 text-white/90" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
