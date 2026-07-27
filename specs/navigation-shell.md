# Spec: Course Navigation & Single-Page Reading Shell

**Status:** ready-for-agent
**Area:** Course front-end (sidebar navigation, page transitions, reading shell)

## Problem Statement

As a beginner working through the "ServiceNow AI Agents" course, I move between lessons constantly — from the home page into a lesson, from one lesson to the next, and back to the menu to see where I am. Each lesson was its own HTML page, so every move triggered a full browser page load. Three things hurt the experience:

1. **The window "blinked"** — on each navigation the whole page (including the menu) was torn down and rebuilt, flashing a blank frame. It felt jarring and made the course feel like disconnected files rather than one continuous product.
2. **I lost my orientation** — after a reload the sidebar rebuilt from scratch, so my sense of "where am I in the course" reset visually each time.
3. **I couldn't tuck the menu away** — on a laptop the sidebar always occupied the left third of the screen, leaving lesson content cramped, with no way to reclaim the space when I wanted to focus on reading.

The course runs directly from the local filesystem (`file://`) by double-clicking `index.html`, so any solution has to work without a web server, without a build step, and without cross-origin privileges that `file://` denies.

## Solution

The course becomes a **single-page shell**. `index.html` is a persistent frame that holds the navigation sidebar plus a content area; the top window never reloads. Lessons and the landing page load *inside* the content area, and swapping content is animated as a **crossfade** rather than a hard page load — so the sidebar and my place in the course stay rock-steady while only the lesson body changes.

The sidebar itself is **collapsible**: I can slide it away to read full-width and bring it back with one click, and my choice is remembered as I move around. Every content swap **crossfades** in and out. The course is **deep-linkable** — the address bar reflects the current lesson (e.g. `#0005`), so reload, bookmark, and browser back/forward all land on the right lesson. Lessons remain **self-contained files** that still work if opened directly, so nothing breaks if a file is opened outside the shell.

All of this respects the reader's motion preferences and works on both desktop and small screens.

## User Stories

1. As a learner, I want the menu and my place in the course to stay visible while I move between lessons, so that the course feels like one continuous experience rather than separate files.
2. As a learner, I want lessons to fade smoothly from one to the next, so that I am not distracted by a blank "blink" on every navigation.
3. As a learner, I want to click a lesson in the sidebar and have it open in place, so that I can jump anywhere in the course without a jarring reload.
4. As a learner, I want a Previous and Next control at the bottom of each lesson, so that I can move through the course in order without returning to the menu.
5. As a learner reading the first lesson, I want the Previous control to be inert, so that I understand I am at the start of the course.
6. As a learner reading the last lesson, I want the Next control to take me back to the course home, so that I have a clear sense of completion and a way back.
7. As a learner, I want the sidebar to show which unit and lesson I am currently on, so that I always know my position in the course.
8. As a learner, I want each lesson in the sidebar to show a status icon (not started, in progress, complete), so that I can see my overall progress at a glance.
9. As a learner, I want to mark a lesson complete from within the lesson, so that I can track what I have finished.
10. As a learner, I want to un-mark a completed lesson, so that I can correct a mistaken click or choose to revisit it.
11. As a learner, I want the sidebar status icons to update the moment I mark a lesson complete, so that my progress reflects reality without a refresh.
12. As a learner, I want my progress saved automatically, so that it is still there when I return to the course later.
13. As a learner on a laptop, I want to collapse the sidebar, so that I can read the lesson content full-width without distraction.
14. As a learner, I want to reopen the collapsed sidebar with one obvious control, so that I can get back to the menu whenever I want.
15. As a learner, I want my collapsed-or-open choice remembered as I move between lessons, so that I do not have to re-collapse the menu on every page.
16. As a learner, I want the collapsed state restored without a visible flash when a page loads, so that the interface feels intentional rather than glitchy.
17. As a learner on a phone or narrow window, I want the sidebar to become a slide-out drawer with a menu button, so that lesson content is readable on a small screen.
18. As a learner using the mobile drawer, I want tapping outside it (on the dimmed overlay) to close it, so that dismissing the menu is quick and natural.
19. As a learner, I want the address bar to reflect the lesson I am reading, so that I can bookmark or share a direct link to it.
20. As a learner, I want to reload the page and stay on the same lesson, so that I do not lose my place on refresh.
21. As a learner, I want the browser Back and Forward buttons to move me through the lessons I have visited, so that navigation behaves the way I expect from the web.
22. As a learner, I want the landing page to show all units, lessons, their status icons, and an overall progress bar, so that I can plan my path and see how far I have come.
23. As a learner, I want to open a lesson from the landing page and have it crossfade in, so that entering the course from home feels as smooth as moving between lessons.
24. As a learner, I want a way from any lesson back to the course home, so that I can return to the overview at any time.
25. As a learner who prefers reduced motion, I want transitions disabled when my system requests it, so that animations do not cause discomfort.
26. As a learner, I want external resource links to open in a new tab as before, so that leaving for reference material never disturbs my place in the course.
27. As a learner, I want Ctrl/Cmd/middle-clicking a link to open it in a new tab, so that standard browser shortcuts keep working.
28. As a learner who opens a single lesson file directly (outside the shell), I want that lesson to still render with working navigation, so that individual files remain usable and shareable.
29. As a learner, I want the sidebar to auto-scroll so my current lesson is in view, so that I can see my position even in a long menu.
30. As a learner, I want each lesson to keep its quiz and content exactly as before, so that adding smooth navigation does not change what I am learning.
31. As the course author, I want lessons defined once in a single data file, so that adding or reordering lessons updates the menu, home page, and prev/next everywhere without editing each page.
32. As the course author, I want navigation behavior centralized in shared scripts, so that a change applies to all lessons at once.
33. As the course author, I want the solution to run from the local filesystem with no server or build step, so that a beginner can use the course by double-clicking a file.

## Implementation Decisions

**Architecture: single-page shell with a content frame.**
- The course entry point is a **shell** document that owns the sidebar and hosts a **content frame**. The shell window never navigates; only the frame's source changes. This is the mechanism that removes the reload "blink" — the persistent chrome (sidebar, current-position highlight, scroll) survives every navigation because it is never rebuilt.
- The landing page (hero, unit cards, progress bar) is extracted into its **own document** loaded inside the frame, rather than living in the shell. This keeps the shell minimal and lets the home view participate in the same crossfade as lessons.
- Lessons remain **individual documents**. A lesson detects at runtime whether it is running inside the shell frame or standalone (top-level), and adapts.

**Two modes for a lesson document:**
- *Framed* (inside the shell): the lesson does **not** draw its own sidebar. It delegates all internal navigation to the shell so the shell can drive the crossfade. It reports its identity so the shell can sync the active highlight.
- *Standalone* (opened directly): the lesson draws its own sidebar and owns collapse + a page-level fade, preserving today's behavior. This is a graceful-degradation fallback, not the primary path.

**Cross-document coordination (constrained by `file://`).** Because the course runs on `file://`, the shell and the framed document are treated as distinct origins; direct cross-frame scripting (reading the frame's `location`, calling parent functions) is not reliable. Coordination therefore uses only mechanisms that work across `file://` boundaries:
- **`postMessage`** is the primary channel. A framed lesson posts a *navigate* intent (with a resolved target identifier) and a *progress-changed* notification to the shell. Navigation and highlight-sync do **not** depend on shared storage — they flow through messages — so they remain correct even where `file://` storage sharing is inconsistent.
- **Web Storage** remains the source of truth for **progress** and the **collapsed preference**, keyed by stable string keys. A framed page also records "which content is currently showing" as a secondary sync hint that the shell reads on frame-load; this is a safety net, not the load-bearing path.

**Navigation target model.** Navigation is expressed as a **target identifier** — either the sentinel `home` or a lesson id — rather than a URL. The shell resolves a target to a frame URL and back. Links (sidebar, prev/next, home-page cards, in-lesson links) are mapped to a target by matching the lesson-id prefix in their href; links that do not map to a known target are left to load in the frame normally.

**Deep-linking via the shell's URL fragment.** The shell reflects the current target in its location fragment (`home` clears it; a lesson id sets `#<id>`). The shell:
- On initial load, resolves the fragment to the starting target (fragment wins over the default home view).
- Listens for fragment changes (back/forward, manual edits) and navigates the frame accordingly, with a re-entrancy guard so programmatic fragment writes do not trigger a redundant navigation.
- Updates the fragment whenever it drives a navigation.

**Transitions (two coordinated layers).**
- *Shell-driven crossfade*: when the shell changes the frame's content, it fades the frame out, swaps the source, and fades it back in on load. This is the path for sidebar clicks, home-page card clicks, prev/next, and back/forward — i.e. essentially all navigation, giving one uniform crossfade.
- *Content fade-in*: each loaded document fades its content area in on load, so the incoming lesson also animates independently of the frame.
- *No-flash restore*: when a saved collapsed state is applied on load, transitions are suppressed for the first paint (a preload class removed after the first frame), so the restored layout does not visibly animate into place.
- All transition layers are disabled under a reduced-motion preference; navigation then happens instantly.

**Collapsible sidebar.**
- A collapse control lives in the sidebar header; a floating menu button reappears when the sidebar is collapsed (desktop) or on narrow screens (drawer).
- On desktop, collapsing hides the sidebar and lets the content area reclaim the full width; on narrow screens the sidebar is a drawer over a dimmed overlay, and the same controls open/close it.
- The collapsed/open choice is persisted and restored on every page.

**Single source of truth for curriculum.** Units, lessons, ordering, titles, and lesson ids remain defined in **one data module** consumed by the shell sidebar, the home page cards, and prev/next. Adding or reordering a lesson requires editing only that module (plus authoring the lesson document itself).

**Link-handling rules (shared across modes).** Interception applies only to plain left-clicks on internal `.html` targets in the same tab. External links, `target="_blank"`, downloads, non-`file` protocols, and modifier/middle clicks are always left to default browser behavior so new-tab and reference-link habits keep working.

**Modules built/modified (by responsibility, not path):**
- *Shell document* (new): hosts sidebar + content frame; minimal.
- *Home document* (new, extracted from the former landing page): hero, unit cards, progress bar; participates in crossfade; delegates lesson-open to the shell when framed.
- *Shell script* (new): sidebar rendering, collapse/drawer control, target↔URL resolution, frame navigation + crossfade, fragment routing, message + storage listeners, highlight/status sync.
- *Lesson navigation script* (modified): framed-vs-standalone detection; standalone sidebar + collapse + page fade; framed delegation via messages; prev/next + mark-complete footer in both modes.
- *Landing document* (modified): becomes the thin shell entry point.
- *Navigation stylesheet* (modified): shell layout (fixed sidebar + framed content area), frame crossfade, collapsed/drawer states, no-flash preload, reduced-motion handling, framed-lesson layout overrides.
- *Curriculum data module* (unchanged contract): remains the single source of truth.

## Testing Decisions

**What makes a good test here:** assert only **externally observable behavior** a learner would notice — what is on screen, what the address bar says, whether the top window reloaded, whether a choice persisted. Do **not** assert on internal helpers (target/URL resolution, message payload shapes, class-name plumbing); those are implementation details free to change.

**Seam:** a **single end-to-end browser test** (Playwright) driving the real shell from the filesystem is the highest and only seam. It is preferred over unit-testing the pure mapping/progress functions, which would couple tests to implementation. This establishes the test pattern for the project (no prior art exists yet).

**Modules under test:** the assembled experience (shell + home + a lesson + shared scripts + styles) exercised through the UI — never a function in isolation.

**Behaviors the E2E suite must cover:**
- *No-reload invariant:* plant a sentinel on the shell's top-level `window`; navigate via sidebar, prev/next, home-card, and back/forward; assert the sentinel persists every time while the frame's content changes — this is the concrete encoding of "no blink."
- *Navigation + highlight sync:* clicking a sidebar lesson / prev / next changes the visible lesson, updates the address fragment, and moves the active highlight to match.
- *Deep-linking:* loading the shell with a lesson fragment starts on that lesson; reloading stays put; back/forward step through visited lessons.
- *Progress persistence + live update:* marking a lesson complete updates its sidebar status icon without a manual refresh and survives a reload; un-marking reverts it.
- *Collapse persistence:* collapsing the sidebar reclaims width, the choice persists across a navigation, and the restore shows no animation flash.
- *Responsive drawer:* at a narrow viewport the sidebar is a drawer opened by the menu button and closed by the overlay.
- *Reduced motion:* under an emulated reduced-motion preference, navigation still changes content correctly (assertions must not depend on animation timing).
- *Standalone fallback:* opening a lesson document directly (not via the shell) still renders a working sidebar and prev/next.

**Prior art:** none — this suite defines the convention. Tests should read as user scenarios (locators by visible text/role, assertions on visible state and the address bar), not as checks of internal structure.

## Out of Scope

- **Authoring or editing lesson content**, quizzes, the glossary, or curriculum ordering — this spec is about the navigation/reading experience only.
- **Server-based delivery, a build step, bundlers, or a framework** — the course must keep running from `file://` by double-clicking.
- **Cross-device / cross-browser sync of progress** — progress stays local to the browser; no accounts, no backend.
- **View Transitions API or fetch-based SPA routing** — both were considered and ruled out because they do not work on `file://`; revisiting them belongs to a future "serve the course over HTTP" effort.
- **Visual redesign** — colors, typography, and lesson layout are unchanged; only navigation and transition behavior are in scope.
- **Analytics, telemetry, or completion reporting** beyond the local progress icons and bar.
- **Accessibility beyond the stated motion-preference and keyboard/new-tab behaviors** — a full assistive-technology audit is not part of this spec.

## Further Notes

- The former landing page's content is preserved verbatim; it simply moves into its own framed document. The shell entry point is intentionally thin.
- The design is deliberately robust to `file://` Web Storage sharing being unreliable: navigation and highlight sync ride on `postMessage`, with storage as a secondary hint — so the "no blink" and correct-highlight guarantees hold even if storage isolation varies by browser.
- Standalone lesson rendering is a genuine fallback path, not dead code: opening any lesson file directly must remain a first-class, working experience.
- Manual sanity pass to accompany the automated suite: from a cold open, click through several lessons and confirm the sidebar never flashes; confirm the address bar tracks the lesson; collapse, navigate, and confirm the state sticks; shrink the window and confirm the drawer behavior.
- Follow-up worth tracking separately: if the course is ever served over HTTP, the native View Transitions API could replace the frame-based crossfade for an even simpler implementation.

