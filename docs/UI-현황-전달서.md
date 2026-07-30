# UI 현황 전달서

> 작성일: 2026-07-30 (P0 인터랙션 반영)  
> 대상: 기획·개발·발표 공유용  
> 앱 경로: `ur-connection/web`  
> 상태: **프론트 프로토타입 (목데이터)** — 백엔드·실 AI 파이프라인 미연결

---

## 1. 한 줄 요약

작업 영상 기반 **숙련도 분석 결과**를 중심으로 한 관리자 콘솔입니다.  
**AI Explain · Pipeline · Pose Overlay · Timeline · Feature Drawer · 결과물 판정**까지 시연용 인터랙션이 연결되어 있습니다.

---

## 2. 실행 방법

```bash
cd ur-connection/web
npm install
npm run dev
```

브라우저: **http://localhost:3000**

| 참고 | 내용 |
|------|------|
| 샘플 분석 | `V-101` (DO TIEN DUC / 금형조립) |
| 샘플 고급 | `V-201` (기계가공) |
| 데이터 | `web/src/data/mock.ts` + `poseLandmarks.json` |
| 이미지 | `web/public/evidence/` (장면·자세·결과물) |

> `next build`와 `next dev`를 동시에 돌리면 `.next`가 깨질 수 있습니다. 문제 시 `.next` 삭제 후 `npm run dev`만 재실행하세요.

---

## 3. 화면 맵

```text
홈 (/)  ← Recent Jobs
 ├─ 업무 프로세스 (/journey)
 │
 ├─ [시연 핵심]
 │   ├─ 분석 결과 (/analysis/V-101) ★
 │   │    ├─ 자세 (/pose) ← Original / Overlay / Skeleton
 │   │    ├─ 작업 시간 (/time)
 │   │    ├─ 반복 패턴 (/repetition)
 │   │    ├─ 결과물 (/product)
 │   │    └─ 평가 승인 (/skill)
 │   ├─ 기술자 상세 (/workers/W-001) ← Analysis History
 │   └─ 숙련도 평가서 (/reports/V-101)
 │
 ├─ [운영]
 │   ├─ 운영 현황 (/ops) ← Recent Jobs
 │   ├─ 실패 건 관리 (/ops/failures)
 │   ├─ 기술자 · 작업 영상 · 분석 상태 · 직종
 │
 └─ 인력 비교 (/compare) · 로그인 (/login)
```

---

## 4. P0 시연 인터랙션 (필수 확인)

| 기능 | 위치 | 조작 |
|------|------|------|
| **AI Explain Card** | `/analysis/V-101` 상단 | 점수·강점·개선·매칭 10초 요약 |
| **Pipeline Progress** | 분석 결과·작업 영상 | 단계별 개별 진행 바 (Uploaded→…→Completed) |
| **Pose Overlay Viewer** | `/analysis/V-101/pose` | **Original / Pose Overlay / Skeleton** 토글 |
| **Timeline Scrubber** | `/analysis/V-101` | 마커·슬라이더 클릭 → 장면·감점 연동 |
| **Feature Detail Drawer** | 점수 구성 행 클릭 | Speed 등 → Cycle/Idle/Hand Travel 상세 |
| **Analysis History** | `/workers/W-001` | 날짜·영상·점수·상태 테이블 |
| **Recent Jobs** | `/`, `/ops` | 최근 잡·점수·상태 리스트 |
| **결과물 판정** | 종합·`/product` | 기준 샘플 vs 완성품 + 체크리스트 |

---

## 5. 화면별 현황

### 5.1 시연 핵심

| 경로 | 구성 요약 | 완성도 |
|------|-----------|--------|
| `/` | 소개, KPI, **Recent Jobs**, 바로가기 | ✅ |
| `/journey` | 8단계 업무 프로세스 | ✅ |
| `/analysis/V-101` | Pipeline · Explain · Timeline · 장면 · 결과물 · Feature Drawer · 매칭 | ✅ 핵심 |
| `/analysis/V-101/pose` | 3모드 Pose Viewer + 관절 좌표 | ✅ |
| `/analysis/V-101/product` | 결과물 판정 전용 | ✅ |
| `/analysis/V-101/skill` | 시스템 vs 평가자 · 감점 · 결과물 | ✅ |
| `/reports/V-101` | Explain · 점수 · 장면 · 결과물 · CSV/JSON | ✅ |
| `/workers/W-001` | 추이 + **Analysis History** | ✅ |
| `/compare` | 인력 비교 | ✅ |

### 5.2 운영

| 경로 | 요약 | 완성도 |
|------|------|--------|
| `/ops` | KPI · Recent Jobs · 분포 | ✅ |
| `/ops/failures` | 재실행·담당자 (목) | ✅ |
| `/jobs` | 영상 목록 + **상세 Pipeline** | ✅ |
| `/workers` 등 | 목록·폼 | ✅ / △저장 미연결 |
| `/login` | 로그인 UI | △ 인증 미연결 |

---

## 6. 추천 시연 순서 (7분)

```text
/                         운영 현황 · Recent Jobs
    ↓
/workers/W-001            작업자 · Analysis History
    ↓
/analysis/V-101           AI 숙련도 분석 (Explain · Timeline · Feature · 결과물)
    ↓
/analysis/V-101/pose      Pose Overlay 3모드
    ↓
/reports/V-101            평가서
```

1. `/` — Recent Jobs  
2. `/workers/W-001` — 누구의 분석인지 확인 (72→75→78)  
3. `/analysis/V-101` — Explain → Timeline 마커 → Feature Drawer → 결과물  
4. `/analysis/V-101/pose` — Original ↔ Overlay ↔ Skeleton  
5. `/reports/V-101` — 평가서  

---

## 7. 구현 / 미구현

| 구분 | 내용 |
|------|------|
| ✅ | 위 P0 인터랙션, 장면/자세/결과물 UI, 매칭, 평가서 내보내기 |
| △ | 로그인·CRUD 저장, 실패 재실행 실큐, 알림 Toast, 검색 |
| ❌ | FastAPI 실연결, 실시간 MediaPipe 추론, MySQL |

설계 문서: [API-명세.md](./API-명세.md) · [DB-ERD.md](./DB-ERD.md) · [AI-파이프라인.md](./AI-파이프라인.md)

---

## 8. 관련 문서

| 문서 | 용도 |
|------|------|
| [프로토타입-정의서.md](./프로토타입-정의서.md) | MVP · 점수 · 시연 UX |
| [User-Journey-IA.md](./User-Journey-IA.md) | 역할별 여정 |
| **이 문서** | **현재 UI·시연 조작 가이드** |
