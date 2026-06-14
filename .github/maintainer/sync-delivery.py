#!/usr/bin/env python3
"""Maintainer-only sync for GitHub Project #2 and delivery-manifest.json."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from datetime import date, timedelta
from pathlib import Path

MANIFEST_PATH = Path(__file__).with_name("delivery-manifest.json")


def run(cmd: list[str], *, input_text: str | None = None) -> str:
    result = subprocess.run(
        cmd,
        input=input_text,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"Command failed ({result.returncode}): {' '.join(cmd)}\n"
            f"stdout: {result.stdout}\nstderr: {result.stderr}"
        )
    return result.stdout.strip()


def gh(*args: str) -> str:
    return run(["gh", *args])


def graphql(query: str, variables: dict | None = None) -> dict:
    payload: dict = {"query": query}
    if variables:
        payload["variables"] = variables
    path = MANIFEST_PATH.with_name(".graphql-payload.json")
    path.write_text(json.dumps(payload), encoding="utf-8")
    try:
        out = run(["gh", "api", "graphql", "--input", str(path)])
    finally:
        path.unlink(missing_ok=True)
    data = json.loads(out)
    if "errors" in data:
        raise RuntimeError(json.dumps(data["errors"], indent=2))
    return data["data"]


def load_manifest() -> dict:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def ensure_label(name: str, color: str, description: str, repo: str) -> None:
    try:
        gh("label", "create", name, "--repo", repo, "--color", color, "--description", description)
        print(f"  + label {name}")
    except RuntimeError as exc:
        if "already exists" not in str(exc):
            raise
        print(f"  = label {name} (exists)")


def cleanup_duplicate_issues(manifest: dict) -> None:
    repo = manifest["meta"]["repo"]
    duplicates = manifest["meta"].get("deleted_issues") or manifest["meta"].get("duplicates", {})
    print("Cleaning up duplicate issues...")
    ensure_label("duplicate", "EDEDED", "Duplicate of an existing canonical issue", repo)
    for dup_num, canonical in duplicates.items():
        dup_num = int(dup_num)
        try:
            gh("issue", "edit", str(dup_num), "--repo", repo, "--add-label", "duplicate")
        except RuntimeError as exc:
            print(f"  ! label #{dup_num}: {exc}")
        comment = (
            f"Closing as duplicate of canonical issue #{canonical}. "
            f"Track delivery on #{canonical} and [Project #2]"
            f"(https://github.com/users/{manifest['meta']['owner']}/projects/{manifest['meta']['project_number']})."
        )
        try:
            gh("issue", "comment", str(dup_num), "--repo", repo, "--body", comment)
        except RuntimeError as exc:
            print(f"  ! comment #{dup_num}: {exc}")
        try:
            state = json.loads(gh("issue", "view", str(dup_num), "--repo", repo, "--json", "state"))["state"]
            if state != "CLOSED":
                gh("issue", "close", str(dup_num), "--repo", repo)
        except RuntimeError as exc:
            print(f"  ! close #{dup_num}: {exc}")
        try:
            run(["gh", "api", "-X", "DELETE", f"repos/{repo}/issues/{dup_num}"])
            print(f"  - deleted issue #{dup_num}")
        except RuntimeError as exc:
            print(f"  = #{dup_num} kept closed (delete unavailable): {exc}")
        time.sleep(0.2)


def remove_duplicate_project_items(manifest: dict) -> None:
    owner = manifest["meta"]["owner"]
    project_number = manifest["meta"]["project_number"]
    dup_map = manifest["meta"].get("deleted_issues") or manifest["meta"].get("duplicates", {})
    duplicate_numbers = {int(k) for k in dup_map}
    print("Removing duplicate items from project (if present)...")
    out = gh(
        "project", "item-list", str(project_number),
        "--owner", owner, "--format", "json", "--limit", "100",
    )
    items = json.loads(out).get("items", [])
    for item in items:
        content = item.get("content") or {}
        number = content.get("number")
        if number in duplicate_numbers:
            try:
                gh("project", "item-delete", item["id"], "--owner", owner, "--format", "json")
                print(f"  - removed project item for duplicate #{number}")
            except RuntimeError as exc:
                print(f"  ! remove #{number} from project: {exc}")
            time.sleep(0.2)


def get_issue_node_id(number: int, repo: str) -> str:
    out = gh("issue", "view", str(number), "--repo", repo, "--json", "id")
    return json.loads(out)["id"]


def repair_hierarchy(manifest: dict) -> None:
    repo = manifest["meta"]["repo"]
    print("Repairing issue hierarchy...")
    hierarchy = manifest["hierarchy"]

    def link_parent_child(parent: int, child: int) -> None:
        try:
            graphql(
                """
                mutation($issueId: ID!, $subIssueId: ID!) {
                  addSubIssue(input: { issueId: $issueId, subIssueId: $subIssueId }) {
                    subIssue { id }
                  }
                }
                """,
                {
                    "issueId": get_issue_node_id(parent, repo),
                    "subIssueId": get_issue_node_id(child, repo),
                },
            )
            print(f"  + sub-issue #{parent} <- #{child}")
        except RuntimeError as exc:
            msg = str(exc).lower()
            if "already" in msg or "duplicate" in msg or "one parent" in msg:
                print(f"  = sub-issue #{parent} <- #{child} (exists)")
            else:
                print(f"  ! sub-issue #{parent} <- #{child}: {exc}")
        time.sleep(0.2)

    for parent, children in hierarchy["epic_children"].items():
        for child in children:
            link_parent_child(int(parent), int(child))

    for parent, children in hierarchy["story_children"].items():
        for child in children:
            link_parent_child(int(parent), int(child))


def get_project_fields(manifest: dict) -> dict[str, dict]:
    owner = manifest["meta"]["owner"]
    project_number = manifest["meta"]["project_number"]
    data = graphql(
        """
        query($login: String!, $number: Int!) {
          user(login: $login) {
            projectV2(number: $number) {
              fields(first: 50) {
                nodes {
                  ... on ProjectV2Field { id name }
                  ... on ProjectV2SingleSelectField {
                    id name
                    options { id name }
                  }
                  ... on ProjectV2IterationField {
                    id name
                    configuration {
                      iterations { id title startDate duration }
                      completedIterations { id title startDate duration }
                    }
                  }
                }
              }
            }
          }
        }
        """,
        {"login": owner, "number": project_number},
    )
    fields: dict[str, dict] = {}
    for node in data["user"]["projectV2"]["fields"]["nodes"]:
        if node and node.get("name"):
            fields[node["name"]] = node
    return fields


def project_item_map(manifest: dict) -> dict[int, str]:
    owner = manifest["meta"]["owner"]
    project_number = manifest["meta"]["project_number"]
    out = gh(
        "project", "item-list", str(project_number),
        "--owner", owner, "--format", "json", "--limit", "100",
    )
    mapping: dict[int, str] = {}
    for item in json.loads(out).get("items", []):
        content = item.get("content") or {}
        number = content.get("number")
        if number:
            mapping[int(number)] = item["id"]
    return mapping


def iteration_title_map(sprint_field: dict) -> dict[str, str]:
    """Map sprint title -> iteration id (active + completed)."""
    mapping: dict[str, str] = {}
    config = sprint_field.get("configuration") or {}
    for it in config.get("iterations", []):
        mapping[it["title"]] = it["id"]
    for it in config.get("completedIterations", []):
        mapping[it["title"]] = it["id"]
    return mapping


def option_id(fields: dict[str, dict], field_name: str, option_name: str) -> str:
    for opt in fields[field_name].get("options", []):
        if opt["name"] == option_name:
            return opt["id"]
    raise KeyError(f"{field_name} option not found: {option_name}")


def set_item_field(
    manifest: dict,
    item_id: str,
    field_key: str,
    *,
    option_id_val: str | None = None,
    text: str | None = None,
    iteration_id: str | None = None,
) -> None:
    field_ids = manifest["field_ids"]
    project_id = manifest["meta"]["project_id"]
    field_id = field_ids.get(field_key) or field_ids.get(field_key.replace("_", " "))
    args = [
        "project", "item-edit",
        "--id", item_id,
        "--project-id", project_id,
        "--field-id", field_id,
    ]
    if option_id_val:
        args.extend(["--single-select-option-id", option_id_val])
    elif text is not None:
        args.extend(["--text", text])
    elif iteration_id:
        args.extend(["--iteration-id", iteration_id])
    else:
        return
    gh(*args)


def populate_project_fields(manifest: dict) -> None:
    print("Populating project field values (Status, Epic, Priority, Ticket ID, Sprint)...")
    fields = ensure_iteration_field(manifest)
    sprint_field = fields.get("Sprint", {})
    iteration_by_title = iteration_title_map(sprint_field) if sprint_field else {}
    sprint_field_id = sprint_field.get("id")
    items = project_item_map(manifest)
    project_id = manifest["meta"]["project_id"]

    for ticket_id, entry in manifest["items"].items():
        issue_num = entry["issue"]
        item_id = items.get(issue_num)
        if not item_id:
            url = f"https://github.com/{manifest['meta']['repo']}/issues/{issue_num}"
            try:
                gh(
                    "project", "item-add", str(manifest["meta"]["project_number"]),
                    "--owner", manifest["meta"]["owner"], "--url", url,
                )
                items = project_item_map(manifest)
                item_id = items.get(issue_num)
                print(f"  + added #{issue_num} to project")
            except RuntimeError as exc:
                if "already" not in str(exc).lower():
                    print(f"  ! add #{issue_num}: {exc}")
                    continue
                items = project_item_map(manifest)
                item_id = items.get(issue_num)
        if not item_id:
            print(f"  ! no project item for #{issue_num}")
            continue

        try:
            set_item_field(
                manifest, item_id, "status",
                option_id_val=option_id(fields, "Status", entry["status"]),
            )
            set_item_field(
                manifest, item_id, "epic",
                option_id_val=option_id(fields, "Epic", entry["epic"]),
            )
            set_item_field(
                manifest, item_id, "priority",
                option_id_val=option_id(fields, "Priority", entry["priority"]),
            )
            set_item_field(manifest, item_id, "ticket_id", text=ticket_id)
            sprint_name = entry.get("sprint")
            iteration_id = iteration_by_title.get(sprint_name)
            if iteration_id and sprint_field_id:
                gh(
                    "project", "item-edit",
                    "--id", item_id,
                    "--project-id", project_id,
                    "--field-id", sprint_field_id,
                    "--iteration-id", iteration_id,
                )
            elif sprint_name and not iteration_id:
                print(f"  ! #{issue_num} sprint {sprint_name} not found in active/completed iterations")
            print(f"  = #{issue_num} ({ticket_id}) -> {entry['status']} / {sprint_name}")
        except (RuntimeError, KeyError) as exc:
            print(f"  ! fields #{issue_num}: {exc}")
        time.sleep(0.15)

    _ = project_id


def ensure_iteration_field(manifest: dict) -> dict[str, dict]:
    fields = get_project_fields(manifest)
    if "Sprint" in fields:
        print("  = Sprint iteration field (exists)")
        return fields

    print("Creating Sprint iteration field...")
    base = date.today() - timedelta(days=28)
    iterations = []
    for sprint in manifest["sprints"]:
        start = base + timedelta(days=sprint["start_offset_days"])
        iterations.append({
            "title": sprint["title"],
            "startDate": start.isoformat(),
            "duration": sprint["duration"],
        })

    try:
        first_start = base.isoformat()
        graphql(
            """
            mutation($projectId: ID!, $name: String!, $config: ProjectV2IterationFieldConfigurationInput!) {
              createProjectV2Field(input: {
                projectId: $projectId
                dataType: ITERATION
                name: $name
                iterationConfiguration: $config
              }) {
                projectV2Field { ... on ProjectV2IterationField { id name } }
              }
            }
            """,
            {
                "projectId": manifest["meta"]["project_id"],
                "name": "Sprint",
                "config": {
                    "startDate": first_start,
                    "duration": 14,
                    "iterations": iterations,
                },
            },
        )
        print("  + Sprint iteration field created")
        time.sleep(2)
    except RuntimeError as exc:
        print(f"  ! Sprint field: {exc}")

    return get_project_fields(manifest)


def populate_sprint_iterations(manifest: dict) -> None:
    print("Setting sprint iterations on project items...")
    fields = ensure_iteration_field(manifest)
    sprint_field = fields.get("Sprint")
    if not sprint_field or "configuration" not in sprint_field:
        print("  ! Sprint field unavailable; skip iteration assignment")
        return

    iteration_by_title = iteration_title_map(sprint_field)
    items = project_item_map(manifest)

    for ticket_id, entry in manifest["items"].items():
        sprint_name = entry.get("sprint")
        iteration_id = iteration_by_title.get(sprint_name)
        if not iteration_id:
            continue
        item_id = items.get(entry["issue"])
        if not item_id:
            continue
        sprint_field_id = sprint_field["id"]
        try:
            gh(
                "project", "item-edit",
                "--id", item_id,
                "--project-id", manifest["meta"]["project_id"],
                "--field-id", sprint_field_id,
                "--iteration-id", iteration_id,
            )
            print(f"  = #{entry['issue']} -> {sprint_name}")
        except RuntimeError as exc:
            print(f"  ! sprint #{entry['issue']}: {exc}")
        time.sleep(0.1)


def milestone_due_date(spec: dict) -> str:
    today = date.today()
    if "due_offset_weeks" in spec:
        due = today + timedelta(weeks=spec["due_offset_weeks"])
    elif "due_offset_months" in spec:
        due = today + timedelta(days=spec["due_offset_months"] * 30)
    else:
        due = today
    return f"{due.isoformat()}T23:59:59Z"


def normalize_title(value: str) -> str:
    return value.replace("\u2014", "-").replace("\u2013", "-").strip().lower()


def ensure_milestones(manifest: dict) -> dict[str, int]:
    preset = manifest["meta"].get("milestone_numbers", {})
    if preset:
        print("Using milestone numbers from manifest...")
        for title, number in preset.items():
            print(f"  = milestone '{title}' (#{number})")
        return dict(preset)

    repo = manifest["meta"]["repo"]
    print("Creating/updating repo milestones...")
    existing_raw = gh("api", f"repos/{repo}/milestones?state=all")
    existing_by_title: dict[str, dict] = {}
    existing_by_norm: dict[str, dict] = {}
    for ms in json.loads(existing_raw) if existing_raw else []:
        existing_by_title[ms["title"]] = ms
        existing_by_norm[normalize_title(ms["title"])] = ms

    milestone_numbers: dict[str, int] = {}
    for title, spec in manifest["milestones"].items():
        due_on = milestone_due_date(spec)
        state = spec.get("state", "open")
        ms = existing_by_title.get(title) or existing_by_norm.get(normalize_title(title))
        if ms:
            milestone_numbers[title] = ms["number"]
            print(f"  = milestone '{title}' (#{ms['number']})")
        else:
            payload = {
                "title": title,
                "description": spec.get("description", ""),
                "due_on": due_on,
                "state": state,
            }
            path = MANIFEST_PATH.with_name(".milestone-payload.json")
            path.write_text(json.dumps(payload), encoding="utf-8")
            created: dict
            try:
                out = run(["gh", "api", f"repos/{repo}/milestones", "--input", str(path)])
                created = json.loads(out)
            except RuntimeError as exc:
                err = str(exc)
                if "already_exists" not in err:
                    raise
                refreshed = json.loads(gh("api", f"repos/{repo}/milestones?state=all"))
                created = next(
                    (m for m in refreshed if normalize_title(m["title"]) == normalize_title(title)),
                    None,
                )
                if not created:
                    raise
            finally:
                path.unlink(missing_ok=True)
            milestone_numbers[title] = created["number"]
            print(f"  + milestone '{title}' (#{created['number']}) due {due_on}")
        time.sleep(0.2)

    return milestone_numbers


def assign_issue_milestones(manifest: dict, milestone_numbers: dict[str, int]) -> None:
    repo = manifest["meta"]["repo"]
    print("Assigning issues to milestones...")
    issue_to_milestone_num: dict[int, int] = {}
    for title, spec in manifest["milestones"].items():
        ms_num = milestone_numbers.get(title)
        if not ms_num:
            continue
        for issue_num in spec.get("issues", []):
            issue_to_milestone_num[int(issue_num)] = ms_num

    for ticket_id, entry in manifest["items"].items():
        issue_num = entry["issue"]
        gate = entry.get("gate")
        if issue_num in issue_to_milestone_num:
            continue
        for title, ms_num in milestone_numbers.items():
            if title.startswith(gate):
                issue_to_milestone_num[issue_num] = ms_num
                break

    for issue_num, ms_num in sorted(issue_to_milestone_num.items()):
        try:
            payload = json.dumps({"milestone": ms_num})
            path = MANIFEST_PATH.with_name(".issue-milestone.json")
            path.write_text(payload, encoding="utf-8")
            try:
                run(["gh", "api", "-X", "PATCH", f"repos/{repo}/issues/{issue_num}", "--input", str(path)])
            finally:
                path.unlink(missing_ok=True)
            print(f"  = #{issue_num} -> milestone #{ms_num}")
        except RuntimeError as exc:
            print(f"  ! milestone #{issue_num}: {exc}")
        time.sleep(0.15)


def verify_field_gaps(manifest: dict) -> bool:
    print("\nField gap verification (GraphQL)...")
    owner = manifest["meta"]["owner"]
    project_number = manifest["meta"]["project_number"]
    data = graphql(
        """
        query($login: String!, $number: Int!) {
          user(login: $login) {
            projectV2(number: $number) {
              items(first: 100) {
                nodes {
                  content { ... on Issue { number title } }
                  fieldValues(first: 20) {
                    nodes {
                      ... on ProjectV2ItemFieldSingleSelectValue {
                        name
                        field { ... on ProjectV2SingleSelectField { name } }
                      }
                      ... on ProjectV2ItemFieldIterationValue {
                        title
                        field { ... on ProjectV2IterationField { name } }
                      }
                      ... on ProjectV2ItemFieldTextValue {
                        text
                        field { ... on ProjectV2Field { name } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        """,
        {"login": owner, "number": project_number},
    )
    gaps: list[str] = []
    for node in data["user"]["projectV2"]["items"]["nodes"]:
        content = node.get("content") or {}
        num = content.get("number")
        if not num:
            continue
        names = set()
        has_sprint = False
        for fv in node.get("fieldValues", {}).get("nodes", []):
            if not fv:
                continue
            field = fv.get("field") or {}
            fname = field.get("name", "")
            if fname == "Sprint" and fv.get("title"):
                has_sprint = True
            if fv.get("name"):
                names.add(fname)
            if fv.get("text") and fname == "Ticket ID":
                names.add("Ticket ID")
        for required in ("Status", "Epic", "Priority", "Ticket ID"):
            if required not in names:
                gaps.append(f"#{num} missing {required}")
        if not has_sprint:
            gaps.append(f"#{num} missing Sprint")
    if gaps:
        print("  Gaps found:")
        for gap in gaps[:20]:
            print(f"    ! {gap}")
        if len(gaps) > 20:
            print(f"    ... and {len(gaps) - 20} more")
        return False
    print("  All canonical items have Status, Epic, Priority, Ticket ID, and Sprint")
    return True


def verify_manifest(manifest: dict) -> bool:
    print("\nVerification:")
    owner = manifest["meta"]["owner"]
    project_number = manifest["meta"]["project_number"]
    out = gh(
        "project", "item-list", str(project_number),
        "--owner", owner, "--format", "json", "--limit", "100",
    )
    parsed = json.loads(out)
    total = parsed.get("totalCount", len(parsed.get("items", [])))
    ok = True
    print(f"  Project item count: {total} (expected 46)")
    if total != 46:
        ok = False

    ms_out = gh("api", f"repos/{manifest['meta']['repo']}/milestones?state=all")
    ms_count = len(json.loads(ms_out) if ms_out else [])
    print(f"  Milestones: {ms_count} (expected >= 5)")
    if ms_count < 5:
        ok = False

    fields = get_project_fields(manifest)
    if "Sprint" not in fields:
        print("  Sprint field: missing")
        ok = False
    else:
        print("  Sprint field: present")

    if not verify_field_gaps(manifest):
        ok = False
    return ok


def main() -> int:
    parser = argparse.ArgumentParser(description="Maintainer sync for GitHub Project #2")
    parser.add_argument("--cleanup-dupes", action="store_true", help="Delete/close duplicate issues #61-68")
    parser.add_argument("--dedupe", action="store_true", help=argparse.SUPPRESS)
    parser.add_argument("--hierarchy", action="store_true", help="Repair epic/story sub-issue links")
    parser.add_argument("--fields", action="store_true", help="Populate Status/Epic/Priority/Ticket ID")
    parser.add_argument("--milestones", action="store_true", help="Create milestones and assign issues")
    parser.add_argument("--sprints", action="store_true", help="Create Sprint field and set iterations")
    parser.add_argument("--verify", action="store_true", help="Run verification checks")
    parser.add_argument("--all", action="store_true", help="Run all reconcile steps")
    args = parser.parse_args()

    flags = [args.cleanup_dupes, args.dedupe, args.hierarchy, args.fields,
             args.milestones, args.sprints, args.verify, args.all]
    if not any(flags):
        args.all = True

    manifest = load_manifest()

    if args.all or args.cleanup_dupes or args.dedupe:
        cleanup_duplicate_issues(manifest)
        remove_duplicate_project_items(manifest)

    if args.all or args.hierarchy:
        repair_hierarchy(manifest)

    if args.all or args.fields:
        populate_project_fields(manifest)

    if args.all or args.milestones:
        milestone_numbers = ensure_milestones(manifest)
        assign_issue_milestones(manifest, milestone_numbers)

    if args.all or args.sprints:
        if not (args.all or args.fields):
            populate_sprint_iterations(manifest)

    if args.all or args.verify:
        verify_manifest(manifest)

    print("\nSync complete.")
    print(
        f"Project: https://github.com/users/{manifest['meta']['owner']}"
        f"/projects/{manifest['meta']['project_number']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
