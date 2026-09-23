import { useState, useEffect, useCallback } from 'react';
import { Terminal, TERMINALS } from './data/terminals';
import { BusSchedule, ApiStatusResponse, ScheduleResponse } from './types';
import { Navbar } from './components/Navbar';
import { SearchBox } from './components/SearchBox';
import { ScheduleList } from './components/ScheduleList';
import { ApiInfoModal } from './components/ApiInfoModal';

// Helper to format date into YYYY-MM-DD
function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function App() {
  const [depTerminal, setDepTerminal] = useState<Terminal>(
    () => TERMINALS.find((t) => t.id === 'NAEK010') || TERMINALS[0]
  );
  const [arrTerminal, setArrTerminal] = useState<Terminal>(
    () => TERMINALS.find((t) => t.id === 'NAEK700') || TERMINALS[1]
  );
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString);
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [notice, setNotice] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<ApiStatusResponse | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);

  // Check API Status on mount
  useEffect(() => {
    fetch('/api/bus/status')
      .then((res) => res.json())
      .then((data: ApiStatusResponse) => {
        setApiStatus(data);
      })
      .catch(() => {
        // Fallback status
        setApiStatus({
          isConfigured: false,
          hasKey: false,
          mode: 'mock',
          message: 'API 상태를 확인하지 못했습니다.',
        });
      });
  }, []);

  // Search function
  const fetchSchedules = useCallback(
    async (dep: Terminal, arr: Terminal, dateStr: string, grade: string) => {
      setIsLoading(true);
      const cleanDate = dateStr.replace(/\D/g, ''); // YYYYMMDD

      try {
        const params = new URLSearchParams({
          depTerminalId: dep.id,
          arrTerminalId: arr.id,
          depDate: cleanDate,
        });

        if (grade) {
          params.set('busGradeId', grade);
        }

        const res = await fetch(`/api/bus/schedule?${params.toString()}`);
        const data: ScheduleResponse = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setSchedules(data.data);
          setIsLive(data.isLive);
          setNotice(data.notice || '');
        } else {
          setSchedules([]);
          setNotice(data.error || '배차 정보를 불러오지 못했습니다.');
        }
      } catch (err: any) {
        setNotice('서버 요청 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial search on mount
  useEffect(() => {
    fetchSchedules(depTerminal, arrTerminal, selectedDate, selectedGrade);
  }, []);

  const handleSearch = () => {
    fetchSchedules(depTerminal, arrTerminal, selectedDate, selectedGrade);
  };

  const handleSwap = () => {
    const nextDep = arrTerminal;
    const nextArr = depTerminal;
    setDepTerminal(nextDep);
    setArrTerminal(nextArr);
    fetchSchedules(nextDep, nextArr, selectedDate, selectedGrade);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#222222] flex flex-col font-sans selection:bg-[#004ea2]/15 selection:text-[#004ea2]">
      {/* Navigation */}
      <Navbar
        apiStatus={apiStatus}
        onOpenInfoModal={() => setInfoModalOpen(true)}
      />

      {/* Main Content Area (1280px Grid Container Standard) */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* NHIS Standard Hero Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E30613]/10 text-[#E30613] text-[13px] font-bold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E30613]" />
            <span>대한민국 국토교통부 TAGO 공공데이터 포털 공식 연동</span>
          </div>
          <h2 className="text-[32px] sm:text-[38px] font-bold text-[#1E293B] tracking-[-0.015em] leading-[1.25]">
            전국 고속버스 실시간 운행정보
          </h2>
          <p className="text-[16px] text-[#64748B] font-normal leading-[1.60] mt-2.5 max-w-2xl mx-auto">
            전국 453개 공식 고속버스 터미널의 실시간 배차 시간표, 잔여석 및 표준 운임을 신속하고 정확하게 조회하실 수 있습니다.
          </p>
        </div>

        {/* Search Panel */}
        <SearchBox
          depTerminal={depTerminal}
          arrTerminal={arrTerminal}
          onDepChange={(term) => {
            setDepTerminal(term);
            fetchSchedules(term, arrTerminal, selectedDate, selectedGrade);
          }}
          onArrChange={(term) => {
            setArrTerminal(term);
            fetchSchedules(depTerminal, term, selectedDate, selectedGrade);
          }}
          onSwap={handleSwap}
          selectedDate={selectedDate}
          onDateChange={(d) => {
            setSelectedDate(d);
            fetchSchedules(depTerminal, arrTerminal, d, selectedGrade);
          }}
          selectedGrade={selectedGrade}
          onGradeChange={(g) => {
            setSelectedGrade(g);
            fetchSchedules(depTerminal, arrTerminal, selectedDate, g);
          }}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Schedule Results */}
        <ScheduleList
          schedules={schedules}
          depTerminal={depTerminal}
          arrTerminal={arrTerminal}
          selectedDate={selectedDate}
          isLive={isLive}
          notice={notice}
          isLoading={isLoading}
        />
      </main>

      {/* Surface Deep Blue Footer (#003B7B - NHIS Deep Blue Trust Standard) */}
      <footer className="border-t border-[#002B5C] bg-[#003B7B] text-white py-10 px-4 text-center text-[13px] mt-12">
        <div className="max-w-[1280px] mx-auto space-y-3 leading-[1.6] text-white/80">
          <div className="flex flex-wrap items-center justify-center gap-4 text-[13px] text-white/90 font-medium pb-2 border-b border-white/15">
            <span className="text-white font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E30613]" />
              h-well 대국민 교통 공공데이터포털 연계
            </span>
            <span className="text-white/30">|</span>
            <button
              type="button"
              onClick={() => setInfoModalOpen(true)}
              className="text-white/85 hover:text-white underline hover:no-underline transition-colors"
            >
              API 서비스 안내
            </button>
            <span className="text-white/30">|</span>
            <a
              href="https://www.kobus.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/85 hover:text-white underline hover:no-underline transition-colors"
            >
              코버스(KOBUS) 승차권 예약
            </a>
          </div>
          <p className="text-[13px] text-white/80 leading-[1.6]">
            본 서비스는 <strong className="text-white font-semibold">국토교통부 (TAGO) 고속버스정보 공공데이터 Open API</strong>를 표준 준수 연계하여 실시간 운행 시간표와 성인 운임을 제공합니다.
          </p>
          <p className="text-[12px] text-white/65 leading-[1.5]">
            운행 시간표 및 운임은 도로 교통 상황 및 운송 사업자의 사정에 따라 변경될 수 있습니다. 실제 승차권 예매 및 발권은 코버스(KOBUS) 또는 티머니GO 공식 시스템을 이용해 주시기 바랍니다.
          </p>
          <p className="pt-2 text-[11px] text-white/50 tracking-normal font-normal">
            Copyright © {new Date().getFullYear()} 국민건강보험공단 연계 대국민 대중교통 공공정보 포털. All rights reserved.
          </p>
        </div>
      </footer>

      {/* API Key Guide Modal */}
      <ApiInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        apiStatus={apiStatus}
      />
    </div>
  );
}
