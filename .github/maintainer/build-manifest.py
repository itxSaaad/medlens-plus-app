#!/usr/bin/env python3
"""Regenerate sprint metadata in delivery-manifest.json from planning/sprints."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PLANNING = ROOT / "planning"
MANIFEST_PATH = Path(__file__).with_name("delivery-manifest.json")

SPRINT_OFFSETS = {
    "SPRINT-01": (-28, 14),
    "SPRINT-02": (-14, 14),
    "SPRINT-03": (0, 14),
    "SPRINT-04": (14, 21),
    "SPRINT-05": (35, 21),
    "SPRINT-06": (56, 14),
}

EPIC_SPRINT = {
    "EPIC-001": "SPRINT-01",
    "EPIC-002": "SPRINT-03",
    "EPIC-003": "SPRINT-05",
    "EPIC-004": "SPRINT-06",
}


def parse_sprint_file(path: Path) -> tuple[str, list[str]]:
    text = path.read_text(encoding="utf-8")
    sprint_id = re.search(r"SPRINT-(\d+)", path.stem, re.I)
    title = f"SPRINT-{sprint_id.group(1).zfill(2)}" if sprint_id else path.stem
    tickets: list[str] = []
    if "## Tickets" in text:
        block = text.split("## Tickets", 1)[1].split("##", 1)[0]
        for line in block.splitlines():
            match = re.search(r"(TKT-\d+)", line)
            if match:
                tickets.append(match.group(1))
    return title, tickets


def main() -> int:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    ticket_to_issue = {
        ticket_id: entry["issue"]
        for ticket_id, entry in manifest["items"].items()
        if ticket_id.startswith("TKT-") and "." not in ticket_id
    }
    epic_to_issue = {
        ticket_id: entry["issue"]
        for ticket_id, entry in manifest["items"].items()
        if ticket_id.startswith("EPIC-")
    }

    sprints: list[dict] = []
    for path in sorted((PLANNING / "sprints").glob("SPRINT-*.md")):
        title, ticket_ids = parse_sprint_file(path)
        issue_nums = [ticket_to_issue[t] for t in ticket_ids if t in ticket_to_issue]
        for epic_id, sprint_name in EPIC_SPRINT.items():
            if sprint_name == title and epic_id in epic_to_issue:
                epic_num = epic_to_issue[epic_id]
                if epic_num not in issue_nums:
                    issue_nums.insert(0, epic_num)
        offset = SPRINT_OFFSETS.get(title, (0, 14))
        sprints.append({
            "title": title,
            "start_offset_days": offset[0],
            "duration": offset[1],
            "issues": issue_nums,
        })
        print(f"  {title}: {len(issue_nums)} issues from {path.name}")

    manifest["sprints"] = sprints
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {MANIFEST_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
