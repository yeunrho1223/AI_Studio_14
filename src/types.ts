export interface Terminal {
  id: string;
  name: string;
  region: '수도권' | '강원' | '충청' | '호남' | '영남';
  city: string;
  popular?: boolean;
}

export interface BusSchedule {
  routeId: string;
  gradeNm: string; // '우등' | '일반' | '프리미엄'
  depPlaceNm: string;
  arrPlaceNm: string;
  depPlandTime: string; // e.g. "202609220800"
  arrPlandTime: string; // e.g. "202609221215"
  charge: number; // e.g. 38800
  durationMinutes: number;
}

export interface BusSearchQuery {
  depTerminalId: string;
  arrTerminalId: string;
  depDate: string; // YYYYMMDD
  busGradeId?: string; // 1: 우등, 2: 고속, 3: 심야우등, 4: 심야고속, 5: 프리미엄, 6: 심야프리미엄
}

export interface ApiStatusResponse {
  isConfigured: boolean;
  hasKey: boolean;
  keyPrefix?: string;
  activeEndpoint?: string;
  mode: 'live' | 'mock';
  message: string;
}

export interface ScheduleResponse {
  success: boolean;
  isLive: boolean;
  totalCount: number;
  data: BusSchedule[];
  error?: string;
  notice?: string;
}
