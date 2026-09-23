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
      <div className="bg-white rounded-[24px] border border-[#a3c3d9]/60 shadow-[0_25px_60px_rgba(72,58,88,0.22)] w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] text-[#FF206E]">
        {/* Header */}
        <div className="p-5 border-b border-[#a3c3d9]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#a3c3d9]/30 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#FF206E]" />
            </div>
            <h3 className="text-[19px] font-semibold text-[#FF206E] tracking-tight">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0f3f8] hover:bg-[#a3c3d9]/30 text-[#FF206E] flex items-center justify-center transition-colors active:scale-95"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 sm:p-5 border-b border-[#a3c3d9]/30 bg-[#fafafc]">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#FF206E] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="터미널명 또는 지역 검색 (예: 서울, 부산, 대전, 전주)"
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#a3c3d9] rounded-full text-[14px] font-normal text-[#FF206E] placeholder:text-[#FF206E]/60 focus:outline-none focus:ring-2 focus:ring-[#a3c3d9] focus:border-[#56638a] transition-all"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 p-1 text-[#FF206E] hover:opacity-80"
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
                className={`px-3 py-1 rounded-full font-normal whitespace-nowrap transition-all active:scale-95 ${
                  activeRegion === region
                    ? 'bg-[#483a58] text-[#FF206E] font-semibold shadow-2xs'
                    : 'bg-white border border-[#a3c3d9] text-[#FF206E] hover:bg-[#a3c3d9]/20'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Terminals quick chips */}
        {!search && activeRegion === '전체' && (
          <div className="p-3.5 bg-[#f0f3f8] border-b border-[#a3c3d9]/40">
            <div className="text-[11px] font-normal text-[#FF206E]/80 mb-2 px-1">
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
                  className={`px-3 py-1 rounded-full text-[12px] font-normal transition-all active:scale-95 ${
                    term.id === selectedTerminalId
                      ? 'bg-[#56638a] text-white shadow-xs'
                      : term.id === disabledTerminalId
                        ? 'opacity-40 cursor-not-allowed bg-white border border-[#a3c3d9]/50 text-[#86868b]'
                        : 'bg-white border border-[#a3c3d9] text-[#FF206E] hover:border-[#56638a]'
                  }`}
                >
                  {term.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Terminal List */}
        <div className="overflow-y-auto flex-1 p-3 divide-y divide-[#a3c3d9]/20">
          {filteredTerminals.length === 0 ? (
            <div className="p-8 text-center text-[#FF206E] text-[14px]">
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
                  className={`w-full p-3 rounded-[12px] flex items-center justify-between text-left transition-all ${
                    isDisabled
                      ? 'opacity-30 cursor-not-allowed'
                      : isSelected
                        ? 'bg-[#a3c3d9]/25 text-[#FF206E]'
                        : 'hover:bg-[#f0f3f8] text-[#FF206E]'
                  }`}
                >
                  <div>
                    <div className="text-[15px] font-normal flex items-center gap-2">
                      <span className={isSelected ? 'font-semibold text-[#FF206E]' : 'font-normal text-[#FF206E]'}>
                        {term.name}
                      </span>
                      <span className="text-[11px] text-[#FF206E]/70">{term.region}</span>
                    </div>
                    <div className="text-[12px] text-[#FF206E]/60">{term.city}</div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#FF206E]" />
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
