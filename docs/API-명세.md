# API 명세 (초안)

Base: `/api/v1` · Auth: Bearer (추후) · 현재 정적 UI는 목데이터

## Endpoints

| Method | Path | 설명 |
|--------|------|------|
| POST | `/videos` | 영상 업로드 (multipart) → `video_id` |
| GET | `/videos/{id}` | 영상 메타·길이·FPS·상태 |
| POST | `/analyze` | 분석 잡 생성 `{ video_id }` |
| GET | `/analyze/{job_id}` | 잡 상태·단계별 progress |
| GET | `/results/{video_id}` | 분석 결과 번들 (점수·감점·매칭·결과물) |
| GET | `/results/{video_id}/features` | Feature JSON |
| GET | `/features/{result_id}` | Feature 상세 (Drawer용) |
| GET | `/timeline/{video_id}` | 구간·감점 마커·장면 프레임 인덱스 |
| GET | `/results/{video_id}/pose` | Pose 샘플/오버레이 URL |
| GET | `/results/{video_id}/product` | 결과물 판정·사진 |
| GET | `/workers` | 작업자 목록 |
| POST | `/workers` | 작업자 등록 |
| GET | `/workers/{id}` | 작업자 상세 |
| GET | `/workers/{id}/history` | Analysis History (영상·점수·상태·날짜) |
| PATCH | `/workers/{id}` | 작업자 수정 |
| GET | `/jobs` | 작업/영상 이력 (Recent Jobs) |
| PATCH | `/jobs/{id}/status` | 상태·검토 변경 |
| POST | `/review` | 평가자 점수·코멘트·승인 상태 |
| GET | `/reports/{video_id}` | 리포트 메타 |
| GET | `/reports/{video_id}.csv` | CSV |
| GET | `/reports/{video_id}.json` | JSON |
| GET | `/reports/{video_id}.pdf` | PDF (Phase 7) |
| GET | `/ops/summary` | 관리자 운영 KPI |
| GET | `/ops/failures` | 실패 잡 목록 |
| POST | `/analyze/{job_id}/retry` | 실패 잡 재실행 → queued |
| PATCH | `/jobs/{id}/assignee` | 담당자 배정 `{ assignee }` |
| GET | `/results/{video_id}/matching` | 숙련도 기반 매칭 추천 |
| GET | `/notifications` | 분석 완료 등 알림 |
| GET | `/job-types` | 직종 지원 현황 |

## 요청/응답 예시

### POST `/analyze`

```json
{ "video_id": "V-101" }
```

```json
{
  "job_id": "AJ-9001",
  "status": "queued",
  "progress": 0,
  "steps": {
    "uploaded": 100,
    "queued": 0,
    "preprocessing": 0,
    "pose_extraction": 0,
    "analyzing": 0,
    "scoring": 0,
    "completed": 0
  }
}
```

### GET `/timeline/{video_id}`

```json
{
  "video_id": "V-101",
  "duration_sec": 180,
  "segments": [
    { "start": 0, "end": 40, "type": "work", "label": "부품 정렬" },
    { "start": 40, "end": 55, "type": "idle", "label": "정지" }
  ],
  "markers": [
    { "t": 42.5, "label": "Idle Time 45초", "kind": "idle", "impact": -8 }
  ],
  "frames": [
    { "t": 42, "src": "/evidence/V-101/frame-04-0042s.jpg", "title": "장시간 정지" }
  ]
}
```

### GET `/features/{result_id}`

```json
{
  "result_id": "R-101",
  "metric": "speed",
  "score": 72,
  "weight": 0.3,
  "contribution": 21.6,
  "features": {
    "cycle_count": 12,
    "idle_time": 45,
    "motion_energy": 88.4,
    "work_speed": 0.72,
    "hand_travel": 142.6
  }
}
```

### POST `/review`

```json
{
  "video_id": "V-101",
  "manual_score": 82,
  "manual_comment": "현장 평가: 부품 정렬은 우수",
  "review_status": "승인"
}
```

### GET `/results/{video_id}`

```json
{
  "video_id": "V-101",
  "worker_id": "W-001",
  "skill_score": 78,
  "skill_level": "중급",
  "weights": { "speed": 0.3, "stability": 0.25, "repetition": 0.2, "accuracy": 0.25 },
  "metrics": { "speed": 72, "stability": 75, "repetition": 81, "accuracy": 80 },
  "contributions": { "speed": 21.6, "stability": 18.75, "repetition": 16.2, "accuracy": 20.0 },
  "confidence": {
    "ai_confidence": 94,
    "pose_tracking_quality": 96,
    "detection_coverage": 91
  },
  "deductions": [
    { "key": "idle_long", "label": "Idle Time 45초", "metric": "speed", "impact": -8, "t": 42.5 }
  ],
  "product_judgment": {
    "overall": "조건부합격",
    "score": 80
  },
  "matching": {
    "eligible": true,
    "recommended_job": "금형조립 (주작업 가능)",
    "recommended_sites": ["자동차부품 A라인", "금형셀 B"],
    "reason": "중급 · 조건부 매칭"
  },
  "summary": "...",
  "status": "completed"
}
```

### GET `/ops/summary`

```json
{
  "today_completed": 15,
  "avg_score": 76,
  "high_risk_workers": 2,
  "failed_jobs": 1,
  "in_pipeline": 4
}
```
