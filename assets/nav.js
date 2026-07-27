// ============================================================
// NAV.JS — Lesson-page navigation.
// Two modes:
//   • Standalone (file opened directly): draws its own sidebar.
//   • Framed (inside the index.html shell): skips the sidebar and
//     delegates navigation to the shell for a seamless crossfade.
// Requires course-data.js + a global CURRENT_LESSON_ID.
// ============================================================

(function () {
  const currentId = (typeof CURRENT_LESSON_ID !== "undefined") ? CURRENT_LESSON_ID : null;
  const inFrame = window.self !== window.top;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CURRENT_KEY = "sn-aiagent-current";
  const COLLAPSE_KEY = "sn-aiagent-nav-collapsed";

  // Which folder is this page in? Lessons live in /lessons/, reference pages
  // in /reference/ — both one level below root, so links must be prefixed
  // accordingly. Defaults to lesson behavior when NAV_SECTION is unset.
  const section = (typeof NAV_SECTION !== "undefined") ? NAV_SECTION : "lesson";
  const lessonPrefix = section === "reference" ? "../lessons/" : "";
  const refPrefix = section === "reference" ? "" : "../reference/";
  const currentRefFile = (typeof CURRENT_REF_FILE !== "undefined") ? CURRENT_REF_FILE : null;

  if (currentId) {
    markVisited(currentId);
    // Tell the shell (if any) which lesson is now showing.
    try { localStorage.setItem(CURRENT_KEY, currentId); } catch (e) {}
  }
  if (inFrame) document.body.classList.add("in-frame");

  // Map an href to a shell target ("home" or a lesson id), or null if unknown.
  function hrefToTarget(href) {
    if (!href) return null;
    if (/index\.html|home\.html/i.test(href)) return "home";
    const m = href.match(/(\d{4})-[^/]*\.html/);
    if (m && typeof COURSE_LESSONS_FLAT !== "undefined") {
      const f = COURSE_LESSONS_FLAT.find(l => l.file.startsWith(m[1] + "-"));
      if (f) return f.id;
    }
    return null;
  }

  function statusIcon(lessonId) {
    const status = getLessonStatus(lessonId);
    if (status === "complete") return '<span class="nav-status complete" title="Completed">✓</span>';
    if (status === "visited") return '<span class="nav-status visited" title="In progress">◐</span>';
    return '<span class="nav-status" title="Not started">○</span>';
  }

  function buildSidebar() {
    let html = `
      <div class="nav-header">
        <button id="sidebar-collapse" aria-label="Collapse menu" title="Collapse menu">«</button>
        <a href="../index.html" class="nav-home-link">
          <div class="nav-course-title">${COURSE.title}</div>
          <div class="nav-course-sub">${COURSE.subtitle}</div>
        </a>
      </div>
      <nav class="nav-lessons">`;
    COURSE.units.forEach(unit => {
      const unitActive = unit.lessons.some(l => l.id === currentId);
      html += `<div class="nav-unit ${unitActive ? "active-unit" : ""}">
        <div class="nav-unit-title">${unit.title}</div>
        <ul>`;
      unit.lessons.forEach(lesson => {
        const isCurrent = lesson.id === currentId;
        html += `
          <li class="${isCurrent ? "current" : ""}">
            <a href="${lessonPrefix}${lesson.file}">
              ${statusIcon(lesson.id)}
              <span class="nav-lesson-title">${lesson.title}</span>
            </a>
          </li>`;
      });
      html += `</ul></div>`;
    });
    html += `</nav>`;
    html += buildReferenceSection(refPrefix);
    return html;
  }

  // ---- Reference links ----
  // On a lesson page they open in a new tab (refPrefix "../reference/").
  // On a reference page they navigate in-place, and the current one is marked.
  function buildReferenceSection(basePath) {
    if (typeof COURSE_REFERENCES === "undefined") return "";
    const openInTab = section !== "reference";
    let html = `<div class="nav-unit nav-reference">
      <div class="nav-unit-title">Reference</div><ul>`;
    COURSE_REFERENCES.forEach(ref => {
      const isCurrent = ref.file === currentRefFile;
      const tabAttrs = openInTab ? ` target="_blank" rel="noopener"` : "";
      html += `
        <li class="${isCurrent ? "current" : ""}">
          <a href="${basePath}${ref.file}"${tabAttrs}>
            <span class="nav-status nav-ref-icon">${ref.icon}</span>
            <span class="nav-lesson-title">${ref.title}</span>
          </a>
        </li>`;
    });
    html += `</ul></div>`;
    return html;
  }

  let sidebar = null;

  if (!inFrame) {
    // ===== Standalone: draw the sidebar + own the collapse/fade behavior =====
    const startCollapsed = localStorage.getItem(COLLAPSE_KEY) === "1";
    if (startCollapsed) document.body.classList.add("nav-preload", "sidebar-collapsed");

    sidebar = document.createElement("aside");
    sidebar.id = "course-sidebar";
    sidebar.innerHTML = buildSidebar();
    document.body.appendChild(sidebar);

    const toggle = document.createElement("button");
    toggle.id = "sidebar-toggle";
    toggle.setAttribute("aria-label", "Open course menu");
    toggle.innerHTML = "☰ Menu";
    document.body.appendChild(toggle);

    const overlay = document.createElement("div");
    overlay.id = "sidebar-overlay";
    document.body.appendChild(overlay);

    if (startCollapsed) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => document.body.classList.remove("nav-preload"));
      });
    }

    const isDesktop = () => window.matchMedia("(min-width: 1000px)").matches;
    const collapse = () => { document.body.classList.add("sidebar-collapsed"); localStorage.setItem(COLLAPSE_KEY, "1"); };
    const expand = () => { document.body.classList.remove("sidebar-collapsed"); localStorage.setItem(COLLAPSE_KEY, "0"); };
    const closeDrawer = () => document.body.classList.remove("sidebar-open");

    toggle.addEventListener("click", () => {
      if (isDesktop()) expand(); else document.body.classList.toggle("sidebar-open");
    });
    overlay.addEventListener("click", closeDrawer);
    sidebar.addEventListener("click", (e) => {
      if (e.target.closest("#sidebar-collapse")) {
        if (isDesktop()) collapse(); else closeDrawer();
      }
    });

    // Fade the content out before navigating the whole window.
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey ||
          e.shiftKey || e.altKey) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || !href.toLowerCase().includes(".html")) return;
      if (/^[a-z]+:/i.test(href) && !href.startsWith("file:")) return;
      if (reduceMotion) return;
      e.preventDefault();
      document.body.classList.add("page-leaving");
      setTimeout(() => { window.location.href = link.href; }, 170);
    });

    const cur = sidebar.querySelector("li.current");
    if (cur) cur.scrollIntoView({ block: "center" });

  } else {
    // ===== Framed: hand navigation to the shell for a seamless crossfade =====
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey ||
          e.shiftKey || e.altKey) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || !href.toLowerCase().includes(".html")) return;
      if (/^[a-z]+:/i.test(href) && !href.startsWith("file:")) return;
      const target = hrefToTarget(href);
      if (target === null) return; // unknown internal link — let it load in-frame
      e.preventDefault();
      try {
        window.parent.postMessage({ type: "navigate", target: target }, "*");
      } catch (err) {
        window.location.href = link.href; // fallback if messaging blocked
      }
    });
  }

  window.addEventListener("pageshow", () => document.body.classList.remove("page-leaving"));

  // ---- Prev / Next footer + mark-complete (both modes) ----
  if (currentId) {
    const idx = COURSE_LESSONS_FLAT.findIndex(l => l.id === currentId);
    const prev = idx > 0 ? COURSE_LESSONS_FLAT[idx - 1] : null;
    const next = idx < COURSE_LESSONS_FLAT.length - 1 ? COURSE_LESSONS_FLAT[idx + 1] : null;
    const total = COURSE_LESSONS_FLAT.length;

    const footer = document.createElement("div");
    footer.className = "lesson-nav-footer";

    let footerHtml = `<div class="lesson-progress-indicator">Lesson ${idx + 1} of ${total}</div>`;
    footerHtml += `<button id="mark-complete-btn" class="mark-complete-btn">✓ Mark this lesson complete</button>`;
    footerHtml += `<div class="lesson-nav-buttons">`;
    footerHtml += prev
      ? `<a href="${prev.file}" class="lesson-nav-btn prev">← <span>${prev.title}</span></a>`
      : `<span class="lesson-nav-btn disabled">← Start</span>`;
    footerHtml += next
      ? `<a href="${next.file}" class="lesson-nav-btn next"><span>${next.title}</span> →</a>`
      : `<a href="../index.html" class="lesson-nav-btn next"><span>Course Home</span> ★</a>`;
    footerHtml += `</div>`;
    footer.innerHTML = footerHtml;

    const main = document.querySelector(".lesson-content") || document.body;
    main.appendChild(footer);

    const btn = footer.querySelector("#mark-complete-btn");
    function refreshCompleteBtn() {
      if (getLessonStatus(currentId) === "complete") {
        btn.classList.add("done");
        btn.innerHTML = "✓ Completed — click to unmark";
      } else {
        btn.classList.remove("done");
        btn.innerHTML = "✓ Mark this lesson complete";
      }
    }
    btn.addEventListener("click", () => {
      if (getLessonStatus(currentId) === "complete") {
        const p = getProgress();
        p[currentId] = "visited";
        saveProgress(p);
      } else {
        markComplete(currentId);
      }
      refreshCompleteBtn();
      if (inFrame) {
        // Ask the shell to refresh its sidebar icons.
        try { window.parent.postMessage({ type: "progress" }, "*"); } catch (e) {}
      } else if (sidebar) {
        sidebar.innerHTML = buildSidebar();
        const cur = sidebar.querySelector("li.current");
        if (cur) cur.scrollIntoView({ block: "center" });
      }
    });
    refreshCompleteBtn();
  }
})();
