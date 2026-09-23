import React from 'react';
import { Bus, ShieldCheck, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { ApiStatusResponse } from '../types';

interface NavbarProps {
  apiStatus: ApiStatusResponse | null;
  onOpenInfoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ apiStatus, onOpenInfoModal }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">
                고속버스 운행 정보
              </h1>
              <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200/80">
                국토교통부 TAGO
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              전국 고속버스 실시간 노선 · 배차 시간표 · 요금 조회
            </p>
          </div>
        </div>

        {/* Status Indicator & Help */}
        <div className="flex items-center gap-2">
          {apiStatus?.isConfigured ? (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
              title="공공데이터포털(data.go.kr) API 키가 연동되었습니다."
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>실시간 연동</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenInfoModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
              title="API 키 연동 안내를 확인하세요"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>API 안내</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenInfoModal}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
            title="API 연동 및 이용 안내"
            aria-label="API 연동 및 이용 안내"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
