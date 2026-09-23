import React from 'react';
import { X, ExternalLink, ShieldCheck, Key, HelpCircle, CheckCircle2 } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              국토교통부 TAGO API 연동 안내
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-stone-600 leading-relaxed">
          {/* Current Status Box */}
          <div className={`p-4 rounded-2xl border ${apiStatus?.isConfigured ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center gap-2 mb-1.5">
              {apiStatus?.isConfigured ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-950">API 키 연동 상태: 정상 감지됨</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-amber-950">API 키 연동 상태: 미설정 (사전 데이터 모드)</span>
                </>
              )}
            </div>
            <p className="text-xs text-stone-600">
              {apiStatus?.message || '공공데이터포털 TAGO API 키를 등록하면 전국 고속버스 실시간 배차를 직접 조회합니다.'}
            </p>
            {apiStatus?.keyPrefix && (
              <div className="mt-2 text-xs font-mono bg-white/80 px-2.5 py-1 rounded-md text-stone-700 inline-block border border-stone-200">
                인증키 접두사: {apiStatus.keyPrefix}
              </div>
            )}
          </div>

          {/* Guide Steps */}
          <div>
            <h3 className="font-bold text-stone-900 mb-2">공공데이터포털 API 키 등록 방법</h3>
            <ol className="space-y-2 text-xs text-stone-600 list-decimal list-inside bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <li>
                <strong>공공데이터포털(data.go.kr)</strong>에 로그인 후 마이페이지의{' '}
                <a
                  href="https://www.data.go.kr/iim/api/selectAPIAcountView.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5"
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
                본 AI Studio 앱의 <strong>설정(Settings) &gt; Secrets</strong> 메뉴에서 변수명 <code>VITE_TAGE_API_KEY</code> (또는 <code>TAGO_API_KEY</code>)로 값을 입력합니다.
              </li>
              <li>
                인증키를 발급받은 직후라면 공공데이터포털 서버의 인증 동기화에 <strong>약 1~2시간</strong> 정도 소요될 수 있습니다. 동기화 완료 전까지는 안전하게 시뮬레이션 배차 정보가 제공됩니다.
              </li>
            </ol>
          </div>

          {/* Direct Link */}
          <div className="pt-2 flex justify-end">
            <a
              href="https://www.data.go.kr/iim/api/selectAPIAcountView.do"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              <span>공공데이터포털 활용신청 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
