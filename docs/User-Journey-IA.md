# User Journey · IA

## 1. 핵심 사용자 여정 (기업 담당자 기준)

```text
[1] 기술자 등록          /workers/new
        ↓
[2] 현장·기량 영상 촬영   (오프라인)
        ↓
[3] 영상 업로드           /jobs (업로드)
        ↓
[4] AI 분석 실행          Analysis Queue
        ↓
[5] 결과 확인             /analysis/{videoId}
        ↓
[6] 평가자 검토·승인      /analysis/{videoId}/skill
        ↓
[7] 숙련도 기반 매칭 추천  결과 화면 Matching 카드
        ↓
[8] PDF 평가서 출력       /reports/{videoId}
        ↓
[9] 채용·현장 배치 의사결정 (UR 기존 매칭 연계)
```

### Role별 여정 차이

| 단계 | company | evaluator | admin |
|------|---------|-----------|-------|
| 등록·업로드 | ● | ○ | ● |
| 분석 실행 | ○ 요청 | ○ | ● |
| 결과 조회 | ● | ● | ● |
| 수기 점수·승인 | — | ● | ● |
| 실패 재실행·담당자 배정 | — | ○ | ● |
| 운영 KPI | ○ 자기 건 | ○ | ● |
| 매칭 추천 확인 | ● | ● | ● |
| PDF 출력 | ● | ● | ● |

---

## 2. Information Architecture (화면 연결)

```text
/ (운영 Dashboard)
  ├─ 실패 건 → /ops/failures  (재실행·담당자 배정)
  ├─ 작업자 카드 → /workers/{id}
  │                    ├─ Trend
  │                    └─ 영상 행 → /analysis/{videoId}
  │                                      ├─ /pose
  │                                      ├─ /time
  │                                      ├─ /repetition
  │                                      ├─ /skill
  │                                      ├─ Matching 추천
  │                                      └─ /reports/{videoId}
  ├─ /workers → /workers/new
  ├─ /jobs (업로드·이력)
  ├─ /analysis/status
  ├─ /compare
  ├─ /job-types
  └─ /journey (본 여정 가이드)
```

### 핵심 Drill-down

```text
Dashboard → Worker → Video → Analysis → Report
     │                              └→ Matching
     └→ Failed Jobs → Retry / Assign
```

---

## 3. 시연용 Happy Path (3분)

1. `/journey` 에서 전체 흐름 확인  
2. `/` KPI → 실패 1건 클릭 → 재실행·담당자 배정  
3. `/workers/W-001` Trend  
4. `/analysis/V-101` 점수·Explain·**매칭 추천**  
5. `/reports/V-101` 인쇄/PDF  
