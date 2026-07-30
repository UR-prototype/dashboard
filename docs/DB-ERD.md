# DB · ERD 초안

## 엔티티

```text
Users (role: admin|evaluator|company)
   │
Workers 1───* Videos 1───* AnalysisJobs
                │              │
                │              └──> status timeline / step progress
                │
                └──1───0..1 AnalysisResults
                              ├── Features (JSON/columns)
                              ├── PoseFrames (or object storage path)
                              ├── Deductions
                              ├── ProductJudgments / ProductPhotos
                              ├── MatchingRecommendations
                              └── Reports

ReviewLogs *───1 AnalysisResults
Notifications *───1 Users (또는 Workers)
```

## 테이블

### users
`id, email, name, role, created_at`

### workers
`id, name, nationality, age, job_type, agency, company, registered_at`

### videos
`id, worker_id, job_type, file_path, file_name, duration_sec, fps, uploaded_at, status`

### analysis_jobs
`id, video_id, status, progress, step_progress_json, assignee, error_code, error_message, started_at, finished_at`

### analysis_results
`id, video_id, worker_id, skill_score, skill_level, speed, stability, repetition, accuracy, ai_confidence, pose_quality, detection_coverage, summary, manual_score, manual_comment, review_status, processed_at`

### matching_recommendations
`id, result_id, eligible, recommended_job, recommended_sites_json, reason`

### features
`id, result_id, hand_travel, joint_angle_var, work_speed, motion_energy, idle_time, cycle_count, tool_switch_count, raw_json`

### pose_frames
`id, video_id, t, joints_json` (대용량은 S3/로컬 파일 + path만 DB)

### deductions
`id, result_id, key, label, metric, impact, t`

### product_judgments
`id, result_id, overall, score, reference_path, candidate_path, summary`

### product_checks
`id, judgment_id, title, verdict, criteria, finding, score_impact, photo_path`

### score_history (또는 results 조회로 대체)
`id, worker_id, video_id, skill_score, recorded_at`

### job_type_weights
`job_type, speed_w, stability_w, repetition_w, accuracy_w, enabled`

### review_logs
`id, result_id, reviewer_id, from_status, to_status, manual_score, comment, created_at`

### notifications
`id, user_id, type, title, body, ref_type, ref_id, read_at, created_at`

## 인덱스 권장
- `videos(worker_id, uploaded_at)`
- `analysis_jobs(status, created_at)`
- `analysis_results(worker_id, processed_at)`
- `review_logs(result_id, created_at)`
- `notifications(user_id, read_at)`
