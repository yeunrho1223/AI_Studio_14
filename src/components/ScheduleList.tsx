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
    <div className="space-y-4">
      {/* Notice Banner (NHIS info-banner: Surface Soft Fill, Left Border 4px Primary Red, rounded.sm) */}
      {notice && (
        <div className="p-4 sm:p-5 rounded-[6px] bg-[#F7F9FA] border border-[#E2E8F0] border-l-4 border-l-[#E30613] text-[#1E293B] text-[13px] leading-[1.60] flex items-start gap-3 shadow-2xs">
          <div className="w-2 h-2 rounded-full bg-[#E30613] mt-1.5 shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-[#E30613]">{isLive ? '국토교통부 실시간 연계 안내' : '배차 안내'}: </span>
            <span className="text-[#334155]">{notice}</span>
          </div>
        </div>
      )}

      {/* Header bar: Route Summary & Filter controls (White fill, 1px border-soft, rounded.md) */}
      <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-normal mb-1.5">
            <span className="font-semibold text-[#1E293B]">{formatDateDisplay(selectedDate)}</span>
            <span aria-hidden="true" className="text-[#CBD5E1]">|</span>
            <span>총 <strong className="text-[#003B7B] font-bold">{schedules.length}회</strong> 운행</span>
            {isLive && (
              <>
                <span aria-hidden="true" className="text-[#CBD5E1]">|</span>
                <span className="text-[#00A05B] bg-[#00A05B]/10 border border-[#00A05B]/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#00A05B]" />
                  국토교통부 실시간 데이터
                </span>
              </>
            )}
          </div>

          <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1E293B] tracking-tight leading-[1.35] flex items-center gap-2.5">
            <span>{depTerminal.name}</span>
            <ArrowRight className="w-5 h-5 text-[#E30613]" />
            <span>{arrTerminal.name}</span>
          </h2>
        </div>

        {/* Time filters & Sorting */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Time filter segmented control */}
          <div className="flex bg-[#F7F9FA] p-1 rounded-[6px] text-[13px] border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1 rounded-[4px] font-medium transition-all active:scale-95 ${
                timeFilter === 'all' ? 'bg-[#003B7B] text-white shadow-xs font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('morning')}
              className={`px-3 py-1 rounded-[4px] font-medium transition-all active:scale-95 ${
                timeFilter === 'morning' ? 'bg-[#003B7B] text-white shadow-xs font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              오전
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('afternoon')}
              className={`px-3 py-1 rounded-[4px] font-medium transition-all active:scale-95 ${
                timeFilter === 'afternoon' ? 'bg-[#003B7B] text-white shadow-xs font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              오후
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('night')}
              className={`px-3 py-1 rounded-[4px] font-medium transition-all active:scale-95 ${
                timeFilter === 'night' ? 'bg-[#003B7B] text-white shadow-xs font-semibold' : 'text-[#64748B] hover:text-[#1E293B]'
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
              className="appearance-none bg-white border border-[#CBD5E1] text-[#1E293B] text-[13px] font-medium py-1.5 pl-3.5 pr-8 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-[#E30613]/25 focus:border-[#E30613] cursor-pointer transition-all"
            >
              <option value="time">출발 빠른순</option>
              <option value="fareAsc">요금 낮은순</option>
              <option value="duration">소요시간 짧은순</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Schedule Items List */}
      {processedSchedules.length === 0 ? (
        <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-12 text-center shadow-xs">
          <p className="text-[#1E293B] text-[17px] font-bold mb-1">
            해당 조건의 배차 정보가 없습니다.
          </p>
          <p className="text-[#64748B] text-[15px] font-normal leading-[1.6]">
            시간대 필터를 전체로 변경하시거나 다른 날짜로 조회해 주시기 바랍니다.
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
              ? 'bg-[#E30613]/10 text-[#E30613] border border-[#E30613]/30 font-semibold'
              : isUdeung
                ? 'bg-[#003B7B]/10 text-[#003B7B] border border-[#003B7B]/30 font-semibold'
                : isGeneral
                  ? 'bg-[#00A05B]/10 text-[#00A05B] border border-[#00A05B]/30 font-semibold'
                  : 'bg-[#F7F9FA] text-[#1E293B] border border-[#E2E8F0] font-semibold';

            return (
              <div
                key={schedule.routeId || idx}
                className="bg-white rounded-[12px] border border-[#E2E8F0] hover:border-[#E30613] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 sm:p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Time & Route Info */}
                <div className="flex items-center gap-5 sm:gap-8">
                  {/* Departure & Arrival Times */}
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <div className="text-[26px] sm:text-[28px] font-bold font-num text-[#1E293B] tracking-tight leading-none group-hover:text-[#E30613] transition-colors">
                        {depTime}
                      </div>
                      <div className="text-[13px] text-[#64748B] font-normal mt-1">
                        {schedule.depPlaceNm || depTerminal.name}
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <div className="text-[11px] font-medium font-num text-[#64748B] mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#003B7B]" />
                        <span>{formatDuration(schedule.durationMinutes)}</span>
                      </div>
                      <div className="w-16 sm:w-24 h-[1.5px] bg-[#CBD5E1] relative flex items-center justify-end">
                        <ArrowRight className="w-3.5 h-3.5 text-[#003B7B] absolute -right-1" />
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="text-[26px] sm:text-[28px] font-bold font-num text-[#1E293B] tracking-tight leading-none">
                        {arrTime}
                      </div>
                      <div className="text-[13px] text-[#64748B] font-normal mt-1">
                        {schedule.arrPlaceNm || arrTerminal.name}
                      </div>
                    </div>
                  </div>

                  {/* Grade Badge & Operating Schedule in parentheses */}
                  <div className="hidden md:flex flex-col items-start gap-1">
                    <span className={`text-[12px] px-2.5 py-0.5 rounded-[4px] ${gradeBadgeClass}`}>
                      {schedule.gradeNm}
                    </span>
                    <span className="text-[12px] font-num text-[#64748B] font-normal">
                      운행 일정 ({depTime} ~ {arrTime})
                    </span>
                  </div>
                </div>

                {/* Mobile Grade & Schedule view */}
                <div className="md:hidden flex items-center justify-between gap-2 -mt-1 pt-2 border-t border-[#E2E8F0]">
                  <span className={`text-[12px] px-2.5 py-0.5 rounded-[4px] ${gradeBadgeClass}`}>
                    {schedule.gradeNm}
                  </span>
                  <span className="text-[12px] font-num text-[#64748B] font-normal">
                    운행 일정 ({depTime} ~ {arrTime})
                  </span>
                </div>

                {/* Fare & CTA */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0]">
                  <div className="text-right">
                    <div className="text-[12px] text-[#64748B] font-normal">성인 1인 표준운임</div>
                    <div className="text-[20px] sm:text-[22px] font-bold font-num text-[#003B7B] tracking-tight">
                      {schedule.charge > 0 ? `${schedule.charge.toLocaleString()}원` : '현장문의'}
                    </div>
                  </div>

                  <a
                    href="https://www.kobus.co.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#003B7B] hover:bg-[#002B5C] text-white text-[13px] font-semibold transition-all active:scale-[0.98] whitespace-nowrap shadow-xs"
                  >
                    <span>승차권 예매</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/90" />
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
