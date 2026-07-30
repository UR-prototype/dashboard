# UR Connection Docs

현재 저장소는 **AI 숙련도 분석 프로토타입(MVP)** 기준입니다.  
화면·시연 흐름은 완성되어 있으며, 실제 AI 분석(MediaPipe 등)은 Phase 3~7에서 순차 적용됩니다.

**GitHub Pages:** https://ur-prototype.github.io/dashboard/

> 최초 1회: [Settings → Pages](https://github.com/UR-prototype/dashboard/settings/pages)  
> Source = **Deploy from a branch** → Branch = **`gh-pages` / `/ (root)`** → Save  
> (`main` push 시 Actions가 `gh-pages`를 자동 갱신합니다.)

| 문서 | 내용 |
|------|------|
| [시스템-아키텍처.md](./시스템-아키텍처.md) | 전체 구성도 (맨 앞) |
| [프로토타입-정의서.md](./프로토타입-정의서.md) | MVP 설계 총괄 |
| [User-Journey-IA.md](./User-Journey-IA.md) | 사용자 여정 · 화면 연결 |
| [AI-파이프라인.md](./AI-파이프라인.md) | Feature · Score · 모델 로드맵 |
| [API-명세.md](./API-명세.md) | REST (+ retry/matching) |
| [DB-ERD.md](./DB-ERD.md) | 테이블·관계 |
| [FP-기능매핑.md](./FP-기능매핑.md) | FP ↔ 화면 |
| [**UI-현황-전달서.md**](./UI-현황-전달서.md) | **현재 UI 구성·시연 안내 (공유용)** |
| [화면설계서/](./화면설계서/) | As-is UI 참고 |

## 앱 실행

```bash
cd web
npm install
npm run dev
```

로컬은 basePath 없이 `http://localhost:3000`  
Pages 배포 빌드: `npm run build:pages` → `web/out`

## 시연

```text
/                         운영 현황 · Recent Jobs
    ↓
/workers/W-001            작업자 선택 · 분석 이력
    ↓
/analysis/V-101           AI 숙련도 분석 결과
    ↓
/analysis/V-101/pose      Pose Overlay (Original / Overlay / Skeleton)
    ↓
/reports/V-101            평가서 출력
```

흐름: **작업자 → 영상/분석 → Pose 근거 → 평가서**  
UI 상세·화면별 완성도는 [UI-현황-전달서.md](./UI-현황-전달서.md) 참고.
