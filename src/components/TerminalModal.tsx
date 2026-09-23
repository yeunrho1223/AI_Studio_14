import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, Sparkles } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-stone-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-stone-100 bg-stone-50/50">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="터미널명 또는 지역 검색 (예: 서울, 부산, 대전, 전주)"
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setActiveRegion(region)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeRegion === region
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Terminals quick chips if no search */}
        {!search && activeRegion === '전체' && (
          <div className="p-3 bg-emerald-50/30 border-b border-emerald-100/60">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mb-2 px-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>자주 찾는 주요 터미널</span>
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
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    term.id === selectedTerminalId
                      ? 'bg-emerald-600 text-white font-semibold'
                      : term.id === disabledTerminalId
                        ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400'
                        : 'bg-white border border-stone-200/80 text-stone-700 hover:border-emerald-500 hover:text-emerald-700'
                  }`}
                >
                  {term.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Terminals Grid */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-stone-100">
          {filteredTerminals.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              검색된 터미널이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredTerminals.map((term) => {
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
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                        : isDisabled
                          ? 'opacity-40 cursor-not-allowed bg-stone-50 border-stone-200 text-stone-400'
                          : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="text-xs text-stone-400 mb-0.5">{term.city}</div>
                    <div className="text-sm font-semibold truncate">{term.name}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
