// ============================================================
// COURSE DATA — Single source of truth for curriculum structure
// Used by nav.js (sidebar) and index.html (course home)
// ============================================================

const COURSE = {
  title: "ServiceNow AI Agents",
  subtitle: "From Beginner to Builder",
  units: [
    {
      id: "unit-1",
      title: "Unit 1 · Foundations",
      lessons: [
        { id: "0001", file: "0001-what-are-servicenow-ai-agents.html", title: "What Are ServiceNow AI Agents?" },
        { id: "0002", file: "0002-core-concepts-and-terminology.html", title: "Core Concepts & Terminology" },
        { id: "0003", file: "0003-how-ai-agents-work.html", title: "How AI Agents Work (Architecture)" }
      ]
    },
    {
      id: "unit-2",
      title: "Unit 2 · Setup & Configuration",
      lessons: [
        { id: "0004", file: "0004-prerequisites-plugins-licensing.html", title: "Prerequisites, Plugins & Licensing" },
        { id: "0005", file: "0005-accessing-ai-agent-studio.html", title: "Accessing AI Agent Studio" },
        { id: "0006", file: "0006-roles-and-governance-setup.html", title: "Roles & Governance Setup" }
      ]
    },
    {
      id: "unit-3",
      title: "Unit 3 · Capabilities & Pre-built Agents",
      lessons: [
        { id: "0007", file: "0007-what-ai-agents-can-do.html", title: "What AI Agents Can Do" },
        { id: "0008", file: "0008-exploring-prebuilt-agents.html", title: "Exploring Pre-built Agents" }
      ]
    },
    {
      id: "unit-4",
      title: "Unit 4 · Building Your First Agent",
      lessons: [
        { id: "0009", file: "0009-anatomy-of-an-agent.html", title: "Anatomy of an Agent" },
        { id: "0010", file: "0010-writing-effective-instructions.html", title: "Writing Effective Instructions" },
        { id: "0011", file: "0011-build-your-first-agent.html", title: "Build Your First Agent (Hands-On)" }
      ]
    },
    {
      id: "unit-5",
      title: "Unit 5 · Customizing Skills & Tools",
      lessons: [
        { id: "0012", file: "0012-understanding-tools.html", title: "Understanding Tools" },
        { id: "0013", file: "0013-creating-custom-tools.html", title: "Creating Custom Tools" },
        { id: "0014", file: "0014-now-assist-skill-kit.html", title: "Custom Skills with Skill Kit" },
        { id: "0020", file: "0020-choosing-model-provider-and-byok.html", title: "Choosing the Model Provider & BYOK" },
        { id: "0015", file: "0015-testing-and-debugging-agents.html", title: "Testing & Debugging Agents" }
      ]
    },
    {
      id: "unit-6",
      title: "Unit 6 · Agentic Workflows & Production",
      lessons: [
        { id: "0016", file: "0016-ai-agents-and-workflows.html", title: "AI Agents + Flow/Workflow Studio" },
        { id: "0017", file: "0017-multi-agent-orchestration.html", title: "Multi-Agent Orchestration" },
        { id: "0018", file: "0018-deploying-to-production.html", title: "Deploying to Production & Governance" },
        { id: "0019", file: "0019-capstone-project.html", title: "Capstone Project" }
      ]
    }
  ]
};

// Reference pages (open in a new tab). File names are relative to /reference/.
const COURSE_REFERENCES = [
  { file: "glossary.html", title: "Glossary", icon: "📖" },
  { file: "plugins.html", title: "Plugins & Apps", icon: "🧩" },
  { file: "common-problems.html", title: "Common Problems", icon: "🛠️" }
];

// Flatten lessons into an ordered list (used for prev/next navigation)
const COURSE_LESSONS_FLAT = COURSE.units.flatMap(u =>
  u.lessons.map(l => ({ ...l, unitId: u.id, unitTitle: u.title }))
);

// ---- Progress tracking (localStorage) ----
const PROGRESS_KEY = "sn-aiagent-progress";

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function markVisited(lessonId) {
  const p = getProgress();
  if (!p[lessonId]) p[lessonId] = "visited";
  saveProgress(p);
}

function markComplete(lessonId) {
  const p = getProgress();
  p[lessonId] = "complete";
  saveProgress(p);
}

function saveProgress(p) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch (e) { /* storage unavailable */ }
}

function getLessonStatus(lessonId) {
  return getProgress()[lessonId] || "not-started";
}
