import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, Check } from 'lucide-react';
import { Terminal, TERMINALS, POPULAR_TERMINALS } from '../data/terminals';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (terminal: Terminal) => void;
  title: string;
  selectedTerminalId?: string;
  disabledTerminalId?: string;
}

const REGIONS = ['전체', '수도권', '강원', '충청', '호남', '영남'] as const;

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title,
  selectedTerminalId,
  disabledTerminalId,
}) => {
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState<string>('전체');

  const filteredTerminals = useMemo(() => {
    let list = TERMINALS;
    if (activeRegion !== '전체') {
      list = list.filter((t) => t.region === activeRegion);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.region.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeRegion]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-[0_12px_32px_rgba(0,0,0,0.12)] w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] text-[#1E293B]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E30613]/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#E30613]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#1E293B] tracking-tight">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F9FA] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] flex items-center justify-center transition-colors active:scale-95"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F7F9FA]">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="터미널명 또는 지역 검색 (예: 서울, 부산, 대전, 전주)"
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#CBD5E1] rounded-[6px] text-[14px] font-medium text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E30613]/25 focus:border-[#E30613] transition-all"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 p-1 text-[#64748B] hover:text-[#1E293B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region Segmented Tabs */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-[13px]">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setActiveRegion(region)}
                className={`px-3 py-1 rounded-[6px] font-medium whitespace-nowrap transition-all active:scale-95 ${
                  activeRegion === region
                    ? 'bg-[#003B7B] text-white shadow-xs font-semibold'
                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1E293B]'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Terminals quick chips */}
        {!search && activeRegion === '전체' && (
          <div className="p-3.5 bg-[#ffffff] border-b border-[#E2E8F0]">
            <div className="text-[12px] font-semibold text-[#64748B] mb-2 px-1">
              주요 터미널 바로 선택
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TERMINALS.slice(0, 10).map((term) => (
                <button
                  key={term.id}
                  type="button"
                  disabled={term.id === disabledTerminalId}
                  onClick={() => {
                    onSelect(term);
                    onClose();
                  }}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all active:scale-95 ${
                    term.id === selectedTerminalId
                      ? 'bg-[#003B7B] text-white shadow-xs'
                      : term.id === disabledTerminalId
                        ? 'opacity-40 cursor-not-allowed bg-white border border-[#E2E8F0] text-[#94A3B8]'
                        : 'bg-white border border-[#CBD5E1] text-[#1E293B] hover:border-[#E30613] hover:text-[#E30613]'
                  }`}
                >
                  {term.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Terminal List */}
        <div className="overflow-y-auto flex-1 p-3 divide-y divide-[#E2E8F0]">
          {filteredTerminals.length === 0 ? (
            <div className="p-8 text-center text-[#64748B] text-[14px]">
              일치하는 터미널이 없습니다.
            </div>
          ) : (
            filteredTerminals.map((term) => {
              const isSelected = term.id === selectedTerminalId;
              const isDisabled = term.id === disabledTerminalId;

              return (
                <button
                  key={term.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onSelect(term);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-[6px] flex items-center justify-between text-left transition-all ${
                    isDisabled
                      ? 'opacity-30 cursor-not-allowed'
                      : isSelected
                        ? 'bg-[#E30613]/10 text-[#E30613]'
                        : 'hover:bg-[#F7F9FA] text-[#1E293B]'
                  }`}
                >
                  <div>
                    <div className="text-[15px] font-normal flex items-center gap-2">
                      <span className={isSelected ? 'font-bold text-[#E30613]' : 'font-medium text-[#1E293B]'}>
                        {term.name}
                      </span>
                      <span className="text-[11px] text-[#64748B] bg-[#F7F9FA] px-1.5 py-0.5 rounded-[4px] border border-[#E2E8F0]">{term.region}</span>
                    </div>
                    <div className="text-[12px] text-[#94A3B8] mt-0.5">{term.city}</div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#E30613]" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
