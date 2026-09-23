import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { TERMINALS, getTerminalById } from './src/data/terminals';
import { BusSchedule, ScheduleResponse, ApiStatusResponse, Terminal } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get configured service key
function getServiceKey(): string | null {
  const key =
    process.env.TAGO_API_KEY ||
    process.env.DATA_GO_KR_API_KEY ||
    process.env.SERVICE_KEY ||
    process.env.TAGO ||
    process.env.TAGO_KEY ||
    null;

  if (!key || key.trim() === '' || key === 'MY_TAGO_API_KEY') {
    return null;
  }
  return key.trim();
}

// Calculate duration in minutes between YYYYMMDDHHmm strings
function calculateDuration(depTimeStr: string, arrTimeStr: string): number {
  try {
    if (!depTimeStr || !arrTimeStr) return 0;
    const cleanDep = depTimeStr.replace(/\D/g, '');
    const cleanArr = arrTimeStr.replace(/\D/g, '');
    if (cleanDep.length < 12 || cleanArr.length < 12) return 0;

    const depYear = parseInt(cleanDep.slice(0, 4), 10);
    const depMonth = parseInt(cleanDep.slice(4, 6), 10) - 1;
    const depDay = parseInt(cleanDep.slice(6, 8), 10);
    const depHour = parseInt(cleanDep.slice(8, 10), 10);
    const depMin = parseInt(cleanDep.slice(10, 12), 10);

    const arrYear = parseInt(cleanArr.slice(0, 4), 10);
    const arrMonth = parseInt(cleanArr.slice(4, 6), 10) - 1;
    const arrDay = parseInt(cleanArr.slice(6, 8), 10);
    const arrHour = parseInt(cleanArr.slice(8, 10), 10);
    const arrMin = parseInt(cleanArr.slice(10, 12), 10);

    const depDate = new Date(depYear, depMonth, depDay, depHour, depMin);
    const arrDate = new Date(arrYear, arrMonth, arrDay, arrHour, arrMin);

    const diffMs = arrDate.getTime() - depDate.getTime();
    return Math.max(0, Math.round(diffMs / (1000 * 60)));
  } catch {
    return 0;
  }
}

// Generate realistic simulated schedule for any terminal pair
function generateRealisticSchedule(
  depTerminalId: string,
  arrTerminalId: string,
  depDateStr: string,
  gradeFilter?: string
): BusSchedule[] {
  const dep: Terminal = getTerminalById(depTerminalId) || {
    id: depTerminalId,
    name: '출발지',
    region: '수도권',
    city: '기타',
    popular: false,
  };
  const arr: Terminal = getTerminalById(arrTerminalId) || {
    id: arrTerminalId,
    name: '도착지',
    region: '영남',
    city: '기타',
    popular: false,
  };

  // Estimate distance and travel time roughly based on regions
  let baseMinutes = 180; // default 3 hours
  let baseFare = 23000;

  if (dep.region === arr.region) {
    baseMinutes = 90;
    baseFare = 11000;
  } else if (
    (dep.name.includes('서울') || dep.name.includes('센트럴') || dep.name.includes('동서울')) &&
    (arr.name.includes('부산') || arr.name.includes('울산') || arr.name.includes('포항'))
  ) {
    baseMinutes = 260; // ~4 hours 20 mins
    baseFare = 28000;
  } else if (
    (dep.name.includes('서울') || dep.name.includes('센트럴')) &&
    (arr.name.includes('광주') || arr.name.includes('전주'))
  ) {
    baseMinutes = 200; // ~3 hours 20 mins
    baseFare = 21000;
  } else if (
    (dep.name.includes('서울') || dep.name.includes('센트럴')) &&
    (arr.name.includes('대전') || arr.name.includes('세종') || arr.name.includes('천안'))
  ) {
    baseMinutes = 110; // ~1 hour 50 mins
    baseFare = 14000;
  } else if (
    (dep.name.includes('서울') || dep.name.includes('센트럴')) &&
    (arr.name.includes('대구') || arr.name.includes('경주'))
  ) {
    baseMinutes = 210; // ~3 hours 30 mins
    baseFare = 22000;
  } else if (
    (dep.name.includes('서울') || dep.name.includes('동서울')) &&
    (arr.name.includes('강릉') || arr.name.includes('속초'))
  ) {
    baseMinutes = 160; // ~2 hours 40 mins
    baseFare = 18000;
  }

  const items: BusSchedule[] = [];
  const startHour = 6;
  const endHour = 23;
  let intervalMinutes = 35;

  if (dep.popular && arr.popular) {
    intervalMinutes = 25;
  }

  let currentMin = startHour * 60;
  let routeIdx = 1;

  while (currentMin <= endHour * 60) {
    const hour = Math.floor(currentMin / 60);
    const min = currentMin % 60;
    const depTimeFormatted = `${depDateStr}${String(hour).padStart(2, '0')}${String(min).padStart(2, '0')}`;

    // Add minutes
    const arrivalTotalMin = currentMin + baseMinutes;
    const arrHour = Math.floor(arrivalTotalMin / 60) % 24;
    const arrMin = arrivalTotalMin % 60;
    const arrDayOffset = Math.floor(arrivalTotalMin / 1440);
    
    // Format date with potential next-day offset
    const dateObj = new Date(
      parseInt(depDateStr.slice(0, 4), 10),
      parseInt(depDateStr.slice(4, 6), 10) - 1,
      parseInt(depDateStr.slice(6, 8), 10) + arrDayOffset
    );
    const arrYear = dateObj.getFullYear();
    const arrMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
    const arrDay = String(dateObj.getDate()).padStart(2, '0');
    const arrTimeFormatted = `${arrYear}${arrMonth}${arrDay}${String(arrHour).padStart(2, '0')}${String(arrMin).padStart(2, '0')}`;

    // Grade distribution: 60% 우등, 25% 일반, 15% 프리미엄
    let grade = '우등';
    let gradeCharge = Math.round(baseFare * 1.45 / 100) * 100;

    if (routeIdx % 5 === 0) {
      grade = '프리미엄';
      gradeCharge = Math.round(baseFare * 1.85 / 100) * 100;
    } else if (routeIdx % 3 === 0) {
      grade = '일반';
      gradeCharge = Math.round(baseFare / 100) * 100;
    }

    if (hour >= 22) {
      // Night charge +10%
      gradeCharge = Math.round(gradeCharge * 1.1 / 100) * 100;
      if (!grade.startsWith('심야')) {
        grade = `심야${grade}`;
      }
    }

    // Filter if requested
    if (!gradeFilter || grade.includes(gradeFilter)) {
      items.push({
        routeId: `MOCK-${depTerminalId}-${arrTerminalId}-${routeIdx}`,
        gradeNm: grade,
        depPlaceNm: dep.name,
        arrPlaceNm: arr.name,
        depPlandTime: depTimeFormatted,
        arrPlandTime: arrTimeFormatted,
        charge: gradeCharge,
        durationMinutes: baseMinutes,
      });
    }

    currentMin += intervalMinutes;
    routeIdx++;
  }

  return items;
}

// Live terminal cache
let liveTerminalsCache: Terminal[] | null = null;

async function getLiveTerminals(key: string): Promise<Terminal[]> {
  if (liveTerminalsCache && liveTerminalsCache.length > 0) {
    return liveTerminalsCache;
  }
  try {
    const url = `http://apis.data.go.kr/1613000/ExpBusInfo/GetExpBusTrminlList?serviceKey=${key}&numOfRows=500&pageNo=1&_type=json`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    const json: any = await res.json();
    const items = json?.response?.body?.items?.item;
    if (Array.isArray(items) && items.length > 0) {
      const knownMap = new Map(TERMINALS.map((t) => [t.id, t]));
      const seen = new Set<string>();
      const mapped: Terminal[] = [];

      for (const item of items) {
        const id = String(item.terminalId);
        if (seen.has(id)) continue;
        seen.add(id);

        const name = String(item.terminalNm);
        const known = knownMap.get(id);
        if (known) {
          mapped.push(known);
          continue;
        }

        let region: Terminal['region'] = '수도권';
        if (/부산|대구|울산|경북|경남|포항|경주|창원|마산|진주|김해|구미|안동/.test(name)) {
          region = '영남';
        } else if (/광주|전남|전북|전주|순천|여수|목포|군산|익산|남원/.test(name)) {
          region = '호남';
        } else if (/대전|충남|충북|세종|천안|청주|충주|제천|공주|서산|당진|아산/.test(name)) {
          region = '충청';
        } else if (/강원|강릉|속초|춘천|원주|동해|삼척/.test(name)) {
          region = '강원';
        }

        mapped.push({
          id,
          name,
          region,
          city: name.slice(0, 2),
          popular: false,
        });
      }
      liveTerminalsCache = mapped;
      return mapped;
    }
  } catch (err) {
    console.error('Failed to fetch live terminals:', err);
  }
  return TERMINALS;
}

// API Routes
// 1. Status Check
app.get('/api/bus/status', (req, res) => {
  const key = getServiceKey();
  const response: ApiStatusResponse = {
    isConfigured: !!key,
    hasKey: !!key,
    keyPrefix: key ? `${key.substring(0, 5)}...` : undefined,
    mode: key ? 'live' : 'mock',
    message: key
      ? '국토교통부(TAGO) 고속버스정보 공공데이터 API 키가 성공적으로 연결되었습니다.'
      : 'TAGO API 키가 아직 설정되지 않았습니다. AI Studio의 Settings에서 TAGO_API_KEY를 등록할 수 있습니다.',
  };
  res.json(response);
});

// 2. Terminal List (with live TAGO terminals)
app.get('/api/bus/terminals', async (req, res) => {
  const key = getServiceKey();
  if (key) {
    const list = await getLiveTerminals(key);
    res.json({
      totalCount: list.length,
      terminals: list,
    });
    return;
  }
  res.json({
    totalCount: TERMINALS.length,
    terminals: TERMINALS,
  });
});

// 3. Dispatch / Schedule Search
app.get('/api/bus/schedule', async (req, res) => {
  const { depTerminalId, arrTerminalId, depDate, busGradeId } = req.query as {
    depTerminalId?: string;
    arrTerminalId?: string;
    depDate?: string;
    busGradeId?: string;
  };

  if (!depTerminalId || !arrTerminalId || !depDate) {
    res.status(400).json({
      success: false,
      error: 'depTerminalId, arrTerminalId, depDate는 필수 요청 변수입니다.',
    });
    return;
  }

  const rawKey = getServiceKey();

  // If no key configured, immediately return realistic mock data
  if (!rawKey) {
    const mockData = generateRealisticSchedule(depTerminalId, arrTerminalId, depDate);
    const resp: ScheduleResponse = {
      success: true,
      isLive: false,
      totalCount: mockData.length,
      data: mockData,
      notice:
        '공공데이터포털 TAGO API 키가 설정되지 않아 사전 배차 데이터로 안내 중입니다. Settings에서 TAGO_API_KEY를 설정하시면 실시간 조회가 연동됩니다.',
    };
    res.json(resp);
    return;
  }

  // Attempt live request to TAGO API
  const endpoints = [
    'http://apis.data.go.kr/1613000/ExpBusInfo/GetStrtpntAlocFndExpbusInfo',
    'https://apis.data.go.kr/1613000/ExpBusInfo/GetStrtpntAlocFndExpbusInfo',
  ];

  let rawDecodedKey = rawKey;
  try {
    rawDecodedKey = decodeURIComponent(rawKey);
  } catch {
    // ignore
  }

  const keyVariants = [rawKey, rawDecodedKey, encodeURIComponent(rawDecodedKey)];
  // remove duplicates
  const uniqueKeys = Array.from(new Set(keyVariants));

  let lastErrorMsg = '';

  for (const endpoint of endpoints) {
    for (const keyCandidate of uniqueKeys) {
      try {
        const queryParams = new URLSearchParams({
          serviceKey: keyCandidate,
          depTerminalId,
          arrTerminalId,
          depPlandTime: depDate,
          numOfRows: '100',
          pageNo: '1',
          _type: 'json',
        });

        if (busGradeId) {
          queryParams.set('busGradeId', busGradeId);
        }

        const targetUrl = `${endpoint}?${queryParams.toString()}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(targetUrl, {
          signal: controller.signal,
          headers: {
            Accept: 'application/json, text/plain, */*',
          },
        });
        clearTimeout(timeoutId);

        const text = await response.text();

        // Check if response is JSON
        if (text.trim().startsWith('{')) {
          const json = JSON.parse(text);
          const header = json?.response?.header;
          const body = json?.response?.body;

          if (header?.resultCode === '00' || header?.resultCode === 0) {
            // Success!
            let rawItems = body?.items?.item;
            if (!rawItems) rawItems = [];
            else if (!Array.isArray(rawItems)) rawItems = [rawItems];

            const schedules: BusSchedule[] = rawItems.map((item: any) => {
              const depTimeStr = String(item.depPlandTime || '');
              const arrTimeStr = String(item.arrPlandTime || '');
              return {
                routeId: String(item.routeId || ''),
                gradeNm: String(item.gradeNm || '우등'),
                depPlaceNm: String(item.depPlaceNm || ''),
                arrPlaceNm: String(item.arrPlaceNm || ''),
                depPlandTime: depTimeStr,
                arrPlandTime: arrTimeStr,
                charge: parseInt(String(item.charge || '0'), 10),
                durationMinutes: calculateDuration(depTimeStr, arrTimeStr),
              };
            });

            // If empty (e.g. no buses scheduled for this pair), return live response with informative notice
            res.json({
              success: true,
              isLive: true,
              totalCount: schedules.length,
              data: schedules,
              notice:
                schedules.length === 0
                  ? '국토교통부(TAGO) 실시간 연동 결과, 해당 구간은 직통 고속버스 운행 노선이 없거나 선택한 일자의 잔여 배차가 없습니다.'
                  : undefined,
            });
            return;
          } else {
            lastErrorMsg = header?.resultMsg || 'API 응답 오류';
          }
        } else if (text.includes('OpenAPI_ServiceResponse') || text.includes('SERVICE_KEY')) {
          lastErrorMsg = '공공데이터포털 인증키(serviceKey)가 아직 등록 또는 활성화되지 않았습니다.';
        }
      } catch (err: any) {
        lastErrorMsg = err?.message || '네트워크 요청 실패';
      }
    }
  }

  // If live query failed (e.g. key pending approval or network limitation), gracefully fallback to mock data
  const fallbackData = generateRealisticSchedule(depTerminalId, arrTerminalId, depDate);
  res.json({
    success: true,
    isLive: false,
    totalCount: fallbackData.length,
    data: fallbackData,
    notice: `공공데이터포털(TAGO) 실시간 응답 지연 또는 인증키 활성화 대기 상태입니다 (${lastErrorMsg || '키 확인 필요'}). 원활한 이용을 위해 시뮬레이션 배차표를 함께 제공합니다.`,
  });
});

// Vite Middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
