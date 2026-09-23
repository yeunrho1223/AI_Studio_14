import React from 'react';
import { Bus, ShieldCheck, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { ApiStatusResponse } from '../types';

interface NavbarProps {
  apiStatus: ApiStatusResponse | null;
  onOpenInfoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ apiStatus, onOpenInfoModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full">
      {/* 1. Global Nav: Vintage Grape persistent bar (Height: 44px) */}
      <div className="bg-[#483a58] text-white/90 h-11 border-b border-[#56638a]/30 flex items-center shadow-xs">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between text-[12px] tracking-[-0.01em]">
          {/* Left: Brand mark and name */}
          <div className="flex items-center gap-2.5 text-white font-normal">
            <div className="w-5 h-5 rounded-full bg-[#56638a] flex items-center justify-center">
              <Bus className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-white">고속버스</span>
            <span className="text-[#a3c3d9]/50">/</span>
            <span className="text-[#a3c3d9] hidden sm:inline">국토교통부 TAGO</span>
          </div>

          {/* Right: Utility actions */}
          <div className="flex items-center gap-3">
            {apiStatus?.isConfigured ? (
              <div className="flex items-center gap-1.5 text-white/90 text-[11px] font-normal bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                <span className="w-2 h-2 rounded-full bg-[#a8c686] animate-pulse" />
                <span>실시간 연동</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenInfoModal}
                className="flex items-center gap-1 text-[#a3c3d9] hover:text-white text-[11px] transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#a8c686]" />
                <span>API 설정 필요</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenInfoModal}
              className="text-[#a3c3d9] hover:text-white transition-colors p-1"
              title="API 및 서비스 안내"
              aria-label="API 및 서비스 안내"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Nav Frosted */}
      <div className="bg-[#f7f8fa]/85 backdrop-blur-md border-b border-[#a3c3d9]/50 h-[52px] flex items-center">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-[21px] font-semibold text-[#FF206E] tracking-tight">
              고속버스 운행 정보
            </h1>
            <span className="hidden md:inline-block text-[13px] text-[#FF206E]/80 font-normal">
              전국 453개 터미널 실시간 배차
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenInfoModal}
              className="hidden sm:inline-flex items-center text-[13px] text-[#FF206E] hover:underline transition-colors"
            >
              API 상태
            </button>

            <a
              href="https://www.kobus.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#56638a] hover:bg-[#483a58] text-white text-[12px] sm:text-[13px] font-normal px-4 py-1.5 rounded-full transition-all active:scale-95 shadow-xs"
            >
              <span>코버스 예매</span>
              <ExternalLink className="w-3 h-3 text-white/90" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
