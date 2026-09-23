import React from 'react';
import { X, ExternalLink, Key, Check } from 'lucide-react';
import { ApiStatusResponse } from '../types';

interface ApiInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiStatus: ApiStatusResponse | null;
}

export const ApiInfoModal: React.FC<ApiInfoModalProps> = ({
  isOpen,
  onClose,
  apiStatus,
}) => {
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
      <div className="bg-white rounded-[24px] border border-[#a3c3d9]/60 shadow-[0_25px_60px_rgba(72,58,88,0.22)] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] text-[#FF206E]">
        {/* Header */}
        <div className="p-5 border-b border-[#a3c3d9]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#a3c3d9]/30 flex items-center justify-center">
              <Key className="w-4 h-4 text-[#FF206E]" />
            </div>
            <h3 className="text-[19px] font-semibold text-[#FF206E] tracking-tight">
              국토교통부 TAGO API 연동
            </h3>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-[14px] text-[#FF206E]/90 leading-[1.47]">
          {/* Current Status Box */}
          <div className="p-5 rounded-[16px] bg-[#fafafc] border border-[#a3c3d9]/60 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5">
              {apiStatus?.isConfigured ? (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#a8c686] animate-pulse" />
                  <span className="font-semibold text-[#FF206E] text-[15px]">API 연동 상태: 정상 연동 (Live)</span>
                </>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#56203d]" />
                  <span className="font-semibold text-[#FF206E] text-[15px]">API 연동 상태: 키 등록 대기</span>
                </>
              )}
            </div>
            <p className="text-[13px] text-[#FF206E]/80">
              {apiStatus?.message || '공공데이터포털 TAGO API 키를 등록하면 전국 고속버스 실시간 배차를 직접 조회합니다.'}
            </p>
            {apiStatus?.keyPrefix && (
              <div className="mt-3 text-[12px] font-mono bg-white px-3 py-1 rounded-full text-[#FF206E] inline-block border border-[#a3c3d9]">
                인증키: {apiStatus.keyPrefix}
              </div>
            )}
          </div>

          {/* Guide Steps */}
          <div>
            <h4 className="font-semibold text-[#FF206E] text-[15px] mb-2.5">인증키 발급 및 등록 안내</h4>
            <ol className="space-y-2 text-[13px] text-[#FF206E] list-decimal list-inside bg-[#f0f3f8] p-5 rounded-[16px] border border-[#a3c3d9]/40">
              <li>
                <strong>공공데이터포털(data.go.kr)</strong>에 로그인 후 마이페이지의{' '}
                <a
                  href="https://www.data.go.kr/iim/api/selectAPIAcountView.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF206E] hover:underline font-semibold inline-flex items-center gap-0.5"
                >
                  활용신청 상세내역
                  <ExternalLink className="w-3 h-3" />
                </a>
                으로 이동합니다.
              </li>
              <li>
                <strong>국토교통부_(TAGO)_고속버스정보</strong> 서비스의 <strong>일반 인증키(Encoding 또는 Decoding)</strong>를 복사합니다.
              </li>
              <li>
                본 앱의 환경변수 <code>VITE_TAGE_API_KEY</code> 또는 <code>TAGO_API_KEY</code>로 값을 입력합니다.
              </li>
              <li>
                인증키 등록 후 공공데이터포털 서버의 동기화에 <strong>약 1~2시간</strong> 소요될 수 있으며, 동기화 전에도 시뮬레이션 배차표가 안전하게 제공됩니다.
              </li>
            </ol>
          </div>

          {/* Direct Link */}
          <div className="pt-2 flex justify-end">
            <a
              href="https://www.data.go.kr/iim/api/selectAPIAcountView.do"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#56638a] hover:bg-[#483a58] text-white rounded-full text-[13px] font-normal transition-all active:scale-95 shadow-xs"
            >
              <span>공공데이터포털 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
