# Learning Record 0002: Full Curriculum Authored

**Date:** 2026-07-27
**Topic:** Complete course build-out with navigation
**Trigger:** Learner reviewed Lesson 1 and requested all remaining materials, start to end, with a navigation menu to track/navigate lessons.

## What Was Built

A complete 6-unit, 19-lesson course on ServiceNow AI Agents, plus a navigation system:

- **Unit 1 — Foundations** (L1–3): what agents are, core terminology, architecture
- **Unit 2 — Setup & Configuration** (L4–6): prerequisites/plugins/licensing, accessing AI Agent Studio, roles & governance
- **Unit 3 — Capabilities** (L7–8): what agents can do, exploring pre-built agents
- **Unit 4 — Building Your First Agent** (L9–11): anatomy, writing instructions, hands-on build
- **Unit 5 — Custom Skills & Tools** (L12–15): tools, custom tools, NASK, testing/debugging
- **Unit 6 — Workflows & Production** (L16–19): agents+flows, multi-agent orchestration, deployment/governance, capstone

## Navigation System (learner's explicit request)
- Fixed left **sidebar** (`assets/nav.js` + `nav-styles.css`) lists all units/lessons, highlights current, shows per-lesson status icons (○ not started, ◐ visited, ✓ complete)
- **Prev/Next** footer + "Mark complete" button on every lesson
- **Progress saved** in browser localStorage (`assets/course-data.js`)
- **Course home** (`index.html`) shows full outline + overall progress bar
- Responsive: collapses to ☰ toggle under 1000px width

## Key Grounding Decision
Content was grounded in **verified web research** (3 parallel research agents), not parametric knowledge. Sources captured in RESOURCES.md. Best technical source: the ServiceNow Fluent SDK "Building AI Agents" guide.

## Accuracy Caveats Baked Into Lessons
Every setup/version-specific lesson includes a "verify against your release notes" warning because:
- Plugin names, patch levels, and entitlements shift each release
- "Use Case" (legacy) vs "Agentic Workflow" (current) terminology
- Now Assist Panel → Otto Panel rename in Zurich
- OOB agent catalog is version/license dependent

## Open Follow-ups
- Two research agents (architecture, setup/plugins) were still running when Lessons 3–6 were authored from the already-completed skills/workflows research. **If they return additional verified detail, cross-check and refine Lessons 3–6.**
- Consider adding reference cheat-sheets: a "tool types" quick card and an "agent build checklist" card.
- Confirm whether the learner has an entitled instance for hands-on practice (affects how Unit 4+ is taught).

## Related
- [[foundation-established]]
