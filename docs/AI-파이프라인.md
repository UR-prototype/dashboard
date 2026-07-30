# AI 분석 파이프라인 · Feature · Score

## 1. 파이프라인 단계

| Step | 상태 코드 | 입력 | 출력 |
|------|-----------|------|------|
| 0 | `uploaded` | 원본 영상 | video 메타 |
| 1 | `queued` | job | 큐 위치 |
| 2 | `preprocessing` | 영상 | 샘플 프레임, FPS, 구간 |
| 3 | `pose_extraction` | 프레임 | Joint 시계열 JSON |
| 4 | `analyzing` | joints | Feature 벡터 |
| 5 | `scoring` | features | metrics + skill_score |
| 6 | `completed` | score bundle | DB/리포트 |
| — | `failed` | 임의 단계 오류 | error_code, message |

## 2. Feature 정의 (금형조립 MVP)

| Feature | 키 | 산출 개요 | Score 기여 |
|---------|-----|-----------|------------|
| 손 이동거리 | `hand_travel` | 양손목 좌표 누적 이동량 (정규화) | stability↓ if 과다 |
| 관절 각도 | `joint_angle_var` | 팔꿈치·어깨 각도 분산 | accuracy / stability |
| 작업 속도 | `work_speed` | work_seconds 대비 cycle 처리량 | speed |
| 이동량 | `motion_energy` | 프레임간 좌표 변화량 합 | speed / stability |
| Idle Time | `idle_time` | 저움직임 연속 구간 초 | speed↓ |
| 작업 Cycle | `cycle_count` | 반복 패턴 검출 횟수 | repetition |
| Tool Switch | `tool_switch_count` | 급격한 자세 전환 횟수 | accuracy↓ |

### Feature JSON 예시

```json
{
  "video_id": "V-101",
  "job_type": "금형조립",
  "features": {
    "hand_travel": 142.6,
    "joint_angle_var": 0.18,
    "work_speed": 0.72,
    "motion_energy": 88.4,
    "idle_time": 45.0,
    "cycle_count": 12,
    "tool_switch_count": 5
  },
  "normalized_metrics": {
    "speed": 72,
    "stability": 75,
    "repetition": 81,
    "accuracy": 80
  }
}
```

## 3. Score Engine

```text
weights = { speed: 0.30, stability: 0.25, repetition: 0.20, accuracy: 0.25 }

skill_score = round(
  speed * 0.30 + stability * 0.25 + repetition * 0.20 + accuracy * 0.25
)

level =
  score >= 85 → 고급
  score >= 65 → 중급
  else        → 초급
```

직종별 가중치는 테이블로 분리 (`job_type_weights`). MVP는 금형조립만 활성.

## 4. Confidence

```text
pose_tracking_quality = mean(joint.confidence) * 100
detection_coverage    = valid_pose_frames / sampled_frames * 100
ai_confidence         = 0.6 * pose_tracking_quality + 0.4 * detection_coverage
```

## 5. Explainability 규칙 (예시)

| 조건 | 감점 라벨 | 영향 지표 | impact |
|------|-----------|-----------|--------|
| idle_time ≥ 30s | Idle Time 과다 | speed | −(idle/10) clamp 15 |
| hand_travel > threshold | 손 이동량 과다 | stability | −5 ~ −10 |
| cycle 변동계수 큼 | 반복 패턴 불안정 | repetition | −3 ~ −8 |
| tool_switch_count 높음 | Tool Switching 빈번 | accuracy | −3 ~ −7 |

UI는 감점 목록 + 해당 `t`로 타임라인 하이라이트.

## 6. 모델 로드맵

```text
Pose Estimation (MediaPipe)
        ↓
Feature Engineering (규칙·통계 기반 추출)
        ↓
Rule-based Score Engine     ← MVP (설명 가능, 가중치 고정)
        ↓
향후 ML Regression / Ranker ← 수기점수·채용성공 라벨 학습
```

| 단계 | 장점 | 전제 |
|------|------|------|
| Rule-based MVP | Explain 용이, 시연·감사 대응 | Feature·가중치 합의 |
| ML 고도화 | 직종·개인 편차 반영 | 라벨 데이터 축적 |

MVP에서는 MediaPipe + Feature + Rule Score만 구현하고, ML은 로드맵으로 명시한다.
