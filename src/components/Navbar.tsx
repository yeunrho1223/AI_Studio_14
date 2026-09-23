import React from 'react';
import { Bus, AlertCircle, Info, ExternalLink, HeartHandshake } from 'lucide-react';
import { ApiStatusResponse } from '../types';

interface NavbarProps {
  apiStatus: ApiStatusResponse | null;
  onOpenInfoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ apiStatus, onOpenInfoModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      {/* 1. Top Utility Bar: NHIS Deep Blue (#003B7B, Height: 40px) */}
      <div className="bg-[#003B7B] text-white h-10 flex items-center border-b border-[#002B5C]/30">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 flex items-center justify-between text-[13px] font-medium">
          {/* Left: Public Agency Label */}
          <div className="flex items-center gap-2 text-white/95">
            <span className="flex items-center gap-1 font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-[#E30613]" />
              h-well 대국민 공공교통 포털
            </span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-white/80 hidden sm:inline text-[12px] font-normal">
              국토교통부 TAGO 공공데이터포털 실시간 연계
            </span>
          </div>

          {/* Right: API Integration Status & Help */}
          <div className="flex items-center gap-3">
            {apiStatus?.isConfigured ? (
              <div className="flex items-center gap-1.5 text-white text-[12px] font-medium bg-[#00A05B]/20 px-2.5 py-0.5 rounded-full border border-[#00A05B]/40">
                <span className="w-2 h-2 rounded-full bg-[#00A05B] animate-pulse" />
                <span className="text-[#A7F3D0]">실시간 연동 가동 중</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenInfoModal}
                className="flex items-center gap-1 text-[#FECACA] hover:text-white text-[12px] transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#F87171]" />
                <span>API 설정 필요</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenInfoModal}
              className="text-white/80 hover:text-white transition-colors p-1"
              title="API 및 서비스 안내"
              aria-label="API 및 서비스 안내"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main GNB: Clean White with 1px Border Soft (#E2E8F0, Height: 64px) */}
      <div className="border-b border-[#E2E8F0] h-16 flex items-center shadow-xs">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-8 h-full">
            {/* Logo with NHIS Red heart/circle visual motif */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#E30613] flex items-center justify-center text-white shadow-xs">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[19px] sm:text-[21px] font-bold text-[#1E293B] tracking-tight leading-none">
                    전국 고속버스 운행정보
                  </span>
                  <span className="px-1.5 py-0.5 rounded-[4px] bg-[#E30613]/10 text-[#E30613] text-[11px] font-bold">
                    공공포털
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B] font-normal mt-0.5 hidden sm:inline">
                  전국 453개 공식 터미널 실시간 배차·요금 조회
                </span>
              </div>
            </div>

            {/* Navigation Category Tabs with Primary Red Active Line */}
            <nav className="hidden md:flex items-center gap-6 h-full text-[15px]">
              <span className="h-full flex items-center text-[#E30613] font-bold border-b-2 border-[#E30613] px-1 cursor-default">
                실시간 시간표 조회
              </span>
              <button
                type="button"
                onClick={onOpenInfoModal}
                className="h-full flex items-center text-[#64748B] hover:text-[#003B7B] font-medium border-b-2 border-transparent px-1 transition-colors"
              >
                공공데이터 API 상태
              </button>
            </nav>
          </div>

          {/* Right Action: button-navy (KOBUS Reservation) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://www.kobus.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#003B7B] hover:bg-[#002B5C] text-white text-[14px] font-semibold px-4 sm:px-5 py-2.5 rounded-full transition-all active:scale-[0.98] shadow-xs"
            >
              <span>코버스 승차권 예매</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/90" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

