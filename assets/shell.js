// ============================================================
// SHELL.JS — Single-page shell: persistent sidebar + content iframe.
// The top window never reloads; only the iframe swaps, so there is
// no browser "blink" between lessons. Requires course-data.js.
// ============================================================

(function () {
  const CURRENT_KEY = "sn-aiagent-current";   // "home" or a lesson id, written by the framed page
  const COLLAPSE_KEY = "sn-aiagent-nav-collapsed";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = () => window.matchMedia("(min-width: 1000px)").matches;

  const frame = document.getElementById("content-frame");
  let currentTarget = "home";   // what the frame is currently showing
  let suppressHashNav = false;  // guard against reacting to our own hash writes

  // ---- Resolve a target ("home" | lessonId) to a frame URL ----
  function targetToUrl(target) {
    if (target === "home") return "home.html";
    const lesson = COURSE_LESSONS_FLAT.find(l => l.id === target);
    return lesson ? "lessons/" + lesson.file : "home.html";
  }
  function urlToTarget(url) {
    if (!url) return "home";
    const m = url.match(/(\d{4})-[^/]*\.html/);
    if (m) {
      const found = COURSE_LESSONS_FLAT.find(l => l.file.startsWith(m[1] + "-"));
      if (found) return found.id;
    }
    return "home";
  }

  // ---- Sidebar markup ----
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
        <a href="#home" class="nav-home-link" data-target="home">
          <div class="nav-course-title">${COURSE.title}</div>
          <div class="nav-course-sub">${COURSE.subtitle}</div>
        </a>
      </div>
      <nav class="nav-lessons">`;

    COURSE.units.forEach(unit => {
      const unitActive = unit.lessons.some(l => l.id === currentTarget);
      html += `<div class="nav-unit ${unitActive ? "active-unit" : ""}">
        <div class="nav-unit-title">${unit.title}</div>
        <ul>`;
      unit.lessons.forEach(lesson => {
        const isCurrent = lesson.id === currentTarget;
        html += `
          <li class="${isCurrent ? "current" : ""}">
            <a href="#${lesson.id}" data-target="${lesson.id}">
              ${statusIcon(lesson.id)}
              <span class="nav-lesson-title">${lesson.title}</span>
            </a>
          </li>`;
      });
      html += `</ul></div>`;
    });
    html += `</nav>`;
    html += buildReferenceSection("reference/");
    return html;
  }

  // ---- Reference links (open in a new tab; shared by both sidebars) ----
  function buildReferenceSection(basePath) {
    if (typeof COURSE_REFERENCES === "undefined") return "";
    let html = `<div class="nav-unit nav-reference">
      <div class="nav-unit-title">Reference</div><ul>`;
    COURSE_REFERENCES.forEach(ref => {
      html += `
        <li>
          <a href="${basePath}${ref.file}" target="_blank" rel="noopener">
            <span class="nav-status nav-ref-icon">${ref.icon}</span>
            <span class="nav-lesson-title">${ref.title}</span>
          </a>
        </li>`;
    });
    html += `</ul></div>`;
    return html;
  }

  // ---- Inject sidebar, toggle button, overlay ----
  const startCollapsed = localStorage.getItem(COLLAPSE_KEY) === "1";
  if (startCollapsed) document.body.classList.add("nav-preload", "sidebar-collapsed");

  const sidebar = document.createElement("aside");
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

  // ---- Collapse / drawer controls ----
  function collapseSidebar() {
    document.body.classList.add("sidebar-collapsed");
    localStorage.setItem(COLLAPSE_KEY, "1");
  }
  function expandSidebar() {
    document.body.classList.remove("sidebar-collapsed");
    localStorage.setItem(COLLAPSE_KEY, "0");
  }
  function closeDrawer() { document.body.classList.remove("sidebar-open"); }

  toggle.addEventListener("click", () => {
    if (isDesktop()) expandSidebar();
    else document.body.classList.toggle("sidebar-open");
  });
  overlay.addEventListener("click", closeDrawer);

  // ---- Refresh sidebar highlight + status icons ----
  function refreshSidebar() {
    sidebar.innerHTML = buildSidebar();
    const cur = sidebar.querySelector("li.current");
    if (cur) cur.scrollIntoView({ block: "nearest" });
  }

  // ---- Navigate the frame to a target, with a crossfade ----
  function navigateTo(target, updateHash) {
    if (target === currentTarget) { closeDrawer(); return; }
    currentTarget = target;
    try { localStorage.setItem(CURRENT_KEY, target); } catch (e) {}

    if (updateHash !== false) {
      suppressHashNav = true;
      location.hash = target === "home" ? "" : target;
    }

    const url = targetToUrl(target);
    if (reduceMotion) {
      frame.src = url;
    } else {
      document.body.classList.add("frame-leaving");
      setTimeout(() => { frame.src = url; }, 170);
    }
    refreshSidebar();
    closeDrawer();
  }

  // ---- Sidebar click delegation (collapse button + lesson links) ----
  sidebar.addEventListener("click", (e) => {
    if (e.target.closest("#sidebar-collapse")) {
      if (isDesktop()) collapseSidebar();
      else closeDrawer();
      return;
    }
    const link = e.target.closest("a[data-target]");
    if (!link) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigateTo(link.getAttribute("data-target"), true);
  });

  // ---- When the frame finishes loading, reveal it + sync highlight ----
  frame.addEventListener("load", () => {
    document.body.classList.remove("frame-leaving");
    // The framed page wrote its identity to localStorage; trust it.
    let shown = "home";
    try { shown = localStorage.getItem(CURRENT_KEY) || "home"; } catch (e) {}
    if (shown !== currentTarget) {
      currentTarget = shown;
      suppressHashNav = true;
      location.hash = shown === "home" ? "" : shown;
      refreshSidebar();
    }
  });

  // ---- Deep-linking: react to hash changes (back/forward, manual edits) ----
  function targetFromHash() {
    const h = location.hash.replace(/^#/, "");
    if (!h) return "home";
    return COURSE_LESSONS_FLAT.some(l => l.id === h) ? h : "home";
  }
  window.addEventListener("hashchange", () => {
    if (suppressHashNav) { suppressHashNav = false; return; }
    navigateTo(targetFromHash(), false);
  });

  // ---- Initial load: honor a deep-link hash if present ----
  const initial = targetFromHash();
  currentTarget = initial;
  try { localStorage.setItem(CURRENT_KEY, initial); } catch (e) {}
  frame.src = targetToUrl(initial);
  refreshSidebar();

  // ---- Messages from the framed lesson (navigation + progress updates) ----
  window.addEventListener("message", (e) => {
    const d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type === "navigate" && d.target) navigateTo(d.target, true);
    else if (d.type === "progress") refreshSidebar();
  });

  // ---- Live-update icons when progress changes in another tab ----
  window.addEventListener("storage", (e) => {
    if (e.key === PROGRESS_KEY) refreshSidebar();
  });
})();
