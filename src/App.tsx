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
          // Bus grade mapping if specific
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
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        apiStatus={apiStatus}
        onOpenInfoModal={() => setInfoModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
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

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 px-4 text-center text-xs text-stone-400">
        <div className="max-w-4xl mx-auto space-y-1 leading-relaxed">
          <p>
            본 서비스는 <strong>국토교통부 (TAGO) 고속버스정보 공공데이터 Open API</strong>를 연계하여 제공됩니다.
          </p>
          <p>
            운행 시간표 및 요금 정보는 운행사 사정 및 도로 교통 상황에 따라 변동될 수 있습니다. 실제 고속버스 승차권 예매는 <strong>코버스(KOBUS)</strong> 또는 <strong>티머니GO</strong> 공식 앱을 이용하세요.
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
