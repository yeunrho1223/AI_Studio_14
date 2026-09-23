import React, { useState, useMemo } from 'react';
import { Clock, ExternalLink, ArrowRight, Sparkles, AlertCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
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

  // Grade color badge helper
  const getGradeBadge = (grade: string) => {
    if (grade.includes('프리미엄')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span>{grade}</span>
        </span>
      );
    }
    if (grade.includes('우등')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
          {grade}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
        {grade}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Notice Banner */}
      {notice && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed flex-1">
            <span className="font-bold">{isLive ? '실시간 안내' : '공공데이터 안내'}: </span>
            {notice}
          </div>
        </div>
      )}

      {/* Header bar: Route Summary & Filter controls */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1">
            <span>{formatDateDisplay(selectedDate)}</span>
            <span>•</span>
            <span className="font-semibold text-stone-800">총 {schedules.length}회 운행</span>
            {isLive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                <CheckCircle2 className="w-3 h-3" />
                국토교통부 실시간
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>{depTerminal.name}</span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
            <span>{arrTerminal.name}</span>
          </h2>
        </div>

        {/* Time filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Time filter */}
          <div className="flex bg-stone-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setTimeFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                timeFilter === 'all' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
              }`}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('morning')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                timeFilter === 'morning' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
              }`}
            >
              오전
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('afternoon')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                timeFilter === 'afternoon' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
              }`}
            >
              오후
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('night')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                timeFilter === 'night' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
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
              className="appearance-none bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="time">출발 빠른순</option>
              <option value="fareAsc">요금 낮은순</option>
              <option value="duration">소요시간 짧은순</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Schedule Items List */}
      {processedSchedules.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500 text-base font-medium mb-1">
            해당 조건의 배차 정보가 없습니다.
          </p>
          <p className="text-stone-400 text-xs">
            시간대 필터를 변경하거나 다른 날짜로 조회해보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {processedSchedules.map((schedule, idx) => {
            const depTime = formatTime(schedule.depPlandTime);
            const arrTime = formatTime(schedule.arrPlandTime);

            return (
              <div
                key={schedule.routeId || idx}
                className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Time & Route Info */}
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Departure & Arrival Times */}
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                        {depTime}
                      </div>
                      <div className="text-xs text-stone-400 font-medium">
                        {schedule.depPlaceNm || depTerminal.name}
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <div className="text-[11px] font-semibold text-stone-400 mb-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{formatDuration(schedule.durationMinutes)}</span>
                      </div>
                      <div className="w-16 sm:w-20 h-0.5 bg-stone-200 relative flex items-center justify-end">
                        <ArrowRight className="w-3 h-3 text-stone-400 absolute -right-1" />
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="text-xl sm:text-2xl font-black text-stone-700 tracking-tight">
                        {arrTime}
                      </div>
                      <div className="text-xs text-stone-400 font-medium">
                        {schedule.arrPlaceNm || arrTerminal.name}
                      </div>
                    </div>
                  </div>

                  {/* Grade Badge & Schedule */}
                  <div className="hidden sm:flex flex-col items-start gap-1">
                    {getGradeBadge(schedule.gradeNm)}
                    <span className="text-[11px] text-stone-500 font-medium">
                      운행 일정 ({depTime} ~ {arrTime})
                    </span>
                  </div>
                </div>

                {/* Mobile Grade Badge & Schedule */}
                <div className="sm:hidden -mt-2 flex items-center justify-between gap-2">
                  {getGradeBadge(schedule.gradeNm)}
                  <span className="text-[11px] text-stone-500 font-medium">
                    운행 일정 ({depTime} ~ {arrTime})
                  </span>
                </div>

                {/* Fare & Booking Button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-right">
                    <div className="text-xs text-stone-400 font-medium">성인 요금</div>
                    <div className="text-lg sm:text-xl font-extrabold text-stone-900">
                      {schedule.charge > 0 ? `${schedule.charge.toLocaleString()}원` : '현장문의'}
                    </div>
                  </div>

                  <a
                    href="https://www.kobus.co.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs active:scale-95 whitespace-nowrap"
                  >
                    <span>예매하기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
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
