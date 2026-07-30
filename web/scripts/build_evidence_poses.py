"""Generate original evidence frames + MediaPipe pose overlays (no copyrighted video)."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "evidence" / "_sources"
MODEL = Path(__file__).resolve().parent / "models" / "pose_landmarker_lite.task"
OUT_V101 = ROOT / "public" / "evidence" / "V-101"
OUT_V201 = ROOT / "public" / "evidence" / "V-201"
OUT_POSE = ROOT / "public" / "evidence" / "pose"
OUT_JSON = ROOT / "src" / "data" / "poseLandmarks.json"

# MediaPipe Pose connections (subset for clarity)
POSE_CONNECTIONS = [
    (11, 12),  # shoulders
    (11, 13),
    (13, 15),  # left arm
    (12, 14),
    (14, 16),  # right arm
    (11, 23),
    (12, 24),  # torso
    (23, 24),  # hips
    (23, 25),
    (25, 27),  # left leg
    (24, 26),
    (26, 28),  # right leg
    (15, 17),
    (15, 19),
    (15, 21),  # left hand
    (16, 18),
    (16, 20),
    (16, 22),  # right hand
    (0, 1),
    (1, 2),
    (2, 3),
    (3, 7),  # face L
    (0, 4),
    (4, 5),
    (5, 6),
    (6, 8),  # face R
]

JOINT_NAMES = {
    0: "nose",
    11: "left_shoulder",
    12: "right_shoulder",
    13: "left_elbow",
    14: "right_elbow",
    15: "left_wrist",
    16: "right_wrist",
    23: "left_hip",
    24: "right_hip",
    25: "left_knee",
    26: "right_knee",
    27: "left_ankle",
    28: "right_ankle",
}

# Map frame slots -> source scene + timestamp labels
FRAME_PLAN_V101 = [
    ("frame-01-0005s.jpg", "scene-01-start.png", 5, "work"),
    ("frame-02-0012s.jpg", "scene-02-align.png", 12, "work"),
    ("frame-03-0025s.jpg", "scene-05-precision.png", 25, "work"),
    ("frame-04-0042s.jpg", "scene-03-idle.png", 42, "idle"),
    ("frame-05-0055s.jpg", "scene-01-start.png", 55, "work"),
    ("frame-06-0070s.jpg", "scene-06-repeat.png", 70, "work"),
    ("frame-07-0085s.jpg", "scene-06-repeat.png", 85, "work"),
    ("frame-08-0095s.jpg", "scene-08-machine.png", 95, "anomaly"),
    ("frame-09-0110s.jpg", "scene-04-tool.png", 110, "anomaly"),
    ("frame-10-0118s.jpg", "scene-04-tool.png", 118, "anomaly"),
    ("frame-11-0135s.jpg", "scene-02-align.png", 135, "work"),
    ("frame-12-0150s.jpg", "scene-05-precision.png", 150, "work"),
    ("frame-13-0180s.jpg", "scene-07-inspect.png", 180, "key"),
    ("frame-14-0220s.jpg", "scene-08-machine.png", 220, "work"),
    ("frame-15-0280s.jpg", "scene-06-repeat.png", 280, "work"),
    ("frame-16-0340s.jpg", "scene-01-start.png", 340, "work"),
    ("frame-17-0420s.jpg", "scene-05-precision.png", 420, "work"),
    ("frame-18-0500s.jpg", "scene-02-align.png", 500, "key"),
    ("frame-19-0600s.jpg", "scene-07-inspect.png", 600, "key"),
    ("frame-20-0720s.jpg", "scene-07-inspect.png", 720, "key"),
]

FRAME_PLAN_V201 = [
    ("frame-13-0180s.jpg", "scene-08-machine.png", 180),
    ("frame-14-0220s.jpg", "scene-04-tool.png", 220),
    ("frame-15-0280s.jpg", "scene-08-machine.png", 280),
    ("frame-16-0340s.jpg", "scene-05-precision.png", 340),
    ("frame-17-0420s.jpg", "scene-06-repeat.png", 420),
    ("frame-18-0500s.jpg", "scene-01-start.png", 500),
    ("frame-19-0600s.jpg", "scene-07-inspect.png", 600),
    ("frame-20-0720s.jpg", "scene-07-inspect.png", 720),
]


def load_bgr(path: Path) -> np.ndarray:
    data = np.fromfile(str(path), dtype=np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)
    if img is None:
        raise RuntimeError(f"Failed to read {path}")
    return img


def save_jpg(path: Path, bgr: np.ndarray, quality: int = 88) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ok, buf = cv2.imencode(".jpg", bgr, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
    if not ok:
        raise RuntimeError(f"encode failed {path}")
    buf.tofile(str(path))


def resize_max(bgr: np.ndarray, max_w: int = 960) -> np.ndarray:
    h, w = bgr.shape[:2]
    if w <= max_w:
        return bgr
    scale = max_w / w
    return cv2.resize(bgr, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)


def detect_pose(landmarker: vision.PoseLandmarker, bgr: np.ndarray):
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    result = landmarker.detect(mp_image)
    if not result.pose_landmarks:
        return None
    return result.pose_landmarks[0]


def landmarks_to_dict(lms, t: float) -> dict:
    joints = []
    for idx, name in JOINT_NAMES.items():
        if idx >= len(lms):
            continue
        lm = lms[idx]
        joints.append(
            {
                "name": name,
                "x": round(float(lm.x), 4),
                "y": round(float(lm.y), 4),
                "z": round(float(lm.z), 4),
                "conf": round(float(getattr(lm, "visibility", 0.9) or 0.9), 3),
            }
        )
    return {"t": t, "joints": joints, "all": [
        {
            "i": i,
            "x": round(float(lm.x), 4),
            "y": round(float(lm.y), 4),
            "z": round(float(lm.z), 4),
            "conf": round(float(getattr(lm, "visibility", 0.9) or 0.9), 3),
        }
        for i, lm in enumerate(lms)
    ]}


def draw_overlay(bgr: np.ndarray, lms) -> np.ndarray:
    out = bgr.copy()
    h, w = out.shape[:2]

    def pt(i: int):
        lm = lms[i]
        return int(lm.x * w), int(lm.y * h)

    # connections
    for a, b in POSE_CONNECTIONS:
        if a >= len(lms) or b >= len(lms):
            continue
        if getattr(lms[a], "visibility", 1) < 0.35 or getattr(lms[b], "visibility", 1) < 0.35:
            continue
        cv2.line(out, pt(a), pt(b), (56, 189, 248), 2, cv2.LINE_AA)

    # joints
    key_idxs = set(JOINT_NAMES.keys())
    for i, lm in enumerate(lms):
        if getattr(lm, "visibility", 1) < 0.35:
            continue
        x, y = pt(i)
        if i in key_idxs:
            color = (16, 185, 129)  # emerald
            r = 6
        else:
            color = (251, 191, 36)  # amber
            r = 3
        cv2.circle(out, (x, y), r, color, -1, cv2.LINE_AA)
        cv2.circle(out, (x, y), r + 1, (255, 255, 255), 1, cv2.LINE_AA)

    # legend bar
    cv2.rectangle(out, (0, h - 36), (w, h), (15, 23, 42), -1)
    cv2.putText(
        out,
        "MediaPipe Pose · joint tracking",
        (12, h - 12),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (226, 232, 240),
        1,
        cv2.LINE_AA,
    )
    return out


def stamp_time(bgr: np.ndarray, t: int) -> np.ndarray:
    out = bgr.copy()
    m, s = divmod(t, 60)
    label = f"{m}:{s:02d}"
    cv2.rectangle(out, (8, 8), (78, 34), (0, 0, 0), -1)
    cv2.putText(
        out,
        label,
        (14, 28),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (255, 255, 255),
        1,
        cv2.LINE_AA,
    )
    return out


def main() -> None:
    if not MODEL.exists():
        raise SystemExit(f"Missing model: {MODEL}")

    options = vision.PoseLandmarkerOptions(
        base_options=mp_python.BaseOptions(model_asset_path=str(MODEL)),
        running_mode=vision.RunningMode.IMAGE,
        num_poses=1,
        min_pose_detection_confidence=0.4,
        min_pose_presence_confidence=0.4,
        min_tracking_confidence=0.4,
    )
    landmarker = vision.PoseLandmarker.create_from_options(options)

    # clear old copyrighted frames
    for d in (OUT_V101, OUT_V201, OUT_POSE):
        if d.exists():
            shutil.rmtree(d)
        d.mkdir(parents=True, exist_ok=True)

    pose_cache: dict[str, object] = {}
    export: dict[str, dict] = {"V-101": {}, "V-201": {}, "scenes": {}}

    def process_scene(scene_name: str):
        if scene_name in pose_cache:
            return pose_cache[scene_name]
        src = ASSETS / scene_name
        bgr = resize_max(load_bgr(src))
        lms = detect_pose(landmarker, bgr)
        pose_cache[scene_name] = (bgr, lms)
        if lms is None:
            print("NO_POSE", scene_name)
        else:
            print("POSE_OK", scene_name, "landmarks", len(lms))
            export["scenes"][scene_name] = landmarks_to_dict(lms, 0)
        return bgr, lms

    # warm all scenes
    scenes = sorted({p[1] for p in FRAME_PLAN_V101} | {p[1] for p in FRAME_PLAN_V201})
    for s in scenes:
        process_scene(s)

    for fname, scene, t, _tag in FRAME_PLAN_V101:
        bgr, lms = process_scene(scene)
        clean = stamp_time(bgr, t)
        save_jpg(OUT_V101 / fname, clean)
        if lms is not None:
            overlay = stamp_time(draw_overlay(bgr, lms), t)
            save_jpg(OUT_POSE / f"V-101-{fname}", overlay)
            export["V-101"][fname] = landmarks_to_dict(lms, float(t))
        else:
            save_jpg(OUT_POSE / f"V-101-{fname}", clean)

    for fname, scene, t in FRAME_PLAN_V201:
        bgr, lms = process_scene(scene)
        clean = stamp_time(bgr, t)
        save_jpg(OUT_V201 / fname, clean)
        if lms is not None:
            overlay = stamp_time(draw_overlay(bgr, lms), t)
            save_jpg(OUT_POSE / f"V-201-{fname}", overlay)
            export["V-201"][fname] = landmarks_to_dict(lms, float(t))
        else:
            save_jpg(OUT_POSE / f"V-201-{fname}", clean)

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(export, ensure_ascii=False, indent=2), encoding="utf-8")
    print("wrote", OUT_JSON)
    print("frames", len(list(OUT_V101.glob("*.jpg"))), len(list(OUT_V201.glob("*.jpg"))))


if __name__ == "__main__":
    main()
