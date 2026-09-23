export interface Terminal {
  id: string;
  name: string;
  region: '수도권' | '강원' | '충청' | '호남' | '영남';
  city: string;
  popular?: boolean;
}

export const TERMINALS: Terminal[] = [
  // 수도권
  { id: 'NAEK010', name: '서울경부', region: '수도권', city: '서울', popular: true },
  { id: 'NAEK020', name: '센트럴시티(강남)', region: '수도권', city: '서울', popular: true },
  { id: 'NAEK030', name: '동서울', region: '수도권', city: '서울', popular: true },
  { id: 'NAEK040', name: '상봉', region: '수도권', city: '서울' },
  { id: 'NAEK100', name: '인천', region: '수도권', city: '인천', popular: true },
  { id: 'NAEK110', name: '성남(분당)', region: '수도권', city: '성남' },
  { id: 'NAEK115', name: '수원', region: '수도권', city: '수원', popular: true },
  { id: 'NAEK116', name: '고양종합', region: '수도권', city: '고양' },
  { id: 'NAEK120', name: '용인', region: '수도권', city: '용인' },
  { id: 'NAEK130', name: '의정부', region: '수도권', city: '의정부' },
  { id: 'NAEK140', name: '안산', region: '수도권', city: '안산' },
  { id: 'NAEK150', name: '평택', region: '수도권', city: '평택' },

  // 충청 / 대전 / 세종
  { id: 'NAEK300', name: '대전복합', region: '충청', city: '대전', popular: true },
  { id: 'NAEK310', name: '유성', region: '충청', city: '대전' },
  { id: 'NAEK344', name: '세종', region: '충청', city: '세종', popular: true },
  { id: 'NAEK320', name: '천안', region: '충청', city: '천안', popular: true },
  { id: 'NAEK330', name: '아산(온양)', region: '충청', city: '아산' },
  { id: 'NAEK400', name: '청주', region: '충청', city: '청주', popular: true },
  { id: 'NAEK410', name: '충주', region: '충청', city: '충주' },
  { id: 'NAEK420', name: '제천', region: '충청', city: '제천' },
  { id: 'NAEK350', name: '공주', region: '충청', city: '공주' },
  { id: 'NAEK360', name: '서산', region: '충청', city: '서산' },
  { id: 'NAEK370', name: '당진', region: '충청', city: '당진' },

  // 호남 / 광주
  { id: 'NAEK500', name: '광주(유스퀘어)', region: '호남', city: '광주', popular: true },
  { id: 'NAEK602', name: '전주', region: '호남', city: '전주', popular: true },
  { id: 'NAEK605', name: '익산', region: '호남', city: '익산' },
  { id: 'NAEK600', name: '군산', region: '호남', city: '군산' },
  { id: 'NAEK515', name: '순천', region: '호남', city: '순천', popular: true },
  { id: 'NAEK520', name: '여수', region: '호남', city: '여수', popular: true },
  { id: 'NAEK530', name: '목포', region: '호남', city: '목포', popular: true },
  { id: 'NAEK630', name: '남원', region: '호남', city: '남원' },

  // 영남 / 대구 / 부산 / 울산
  { id: 'NAEK700', name: '부산', region: '영남', city: '부산', popular: true },
  { id: 'NAEK703', name: '서부산(사상)', region: '영남', city: '부산', popular: true },
  { id: 'NAEK801', name: '동대구', region: '영남', city: '대구', popular: true },
  { id: 'NAEK802', name: '서대구', region: '영남', city: '대구' },
  { id: 'NAEK715', name: '울산', region: '영남', city: '울산', popular: true },
  { id: 'NAEK815', name: '포항', region: '영남', city: '포항', popular: true },
  { id: 'NAEK810', name: '경주', region: '영남', city: '경주', popular: true },
  { id: 'NAEK710', name: '창원', region: '영남', city: '창원', popular: true },
  { id: 'NAEK705', name: '마산', region: '영남', city: '창원' },
  { id: 'NAEK720', name: '진주', region: '영남', city: '진주', popular: true },
  { id: 'NAEK730', name: '김해', region: '영남', city: '김해' },
  { id: 'NAEK820', name: '구미', region: '영남', city: '구미' },
  { id: 'NAEK830', name: '안동', region: '영남', city: '안동' },
  { id: 'NAEK740', name: '통영', region: '영남', city: '통영' },

  // 강원
  { id: 'NAEK200', name: '원주', region: '강원', city: '원주', popular: true },
  { id: 'NAEK210', name: '강릉', region: '강원', city: '강릉', popular: true },
  { id: 'NAEK230', name: '속초', region: '강원', city: '속초', popular: true },
  { id: 'NAEK240', name: '삼척', region: '강원', city: '삼척' },
  { id: 'NAEK250', name: '동해', region: '강원', city: '동해' },
];

export const POPULAR_TERMINALS = TERMINALS.filter((t) => t.popular);

export function getTerminalById(id: string): Terminal | undefined {
  return TERMINALS.find((t) => t.id === id);
}

export function searchTerminals(query: string): Terminal[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return TERMINALS;
  return TERMINALS.filter(
    (t) =>
      t.name.toLowerCase().includes(clean) ||
      t.city.toLowerCase().includes(clean) ||
      t.region.toLowerCase().includes(clean)
  );
}
