# Learning Resources: ServiceNow AI Agents

## Official Documentation
*Primary, high-trust sources from ServiceNow*

- **ServiceNow Product Documentation - AI Agent**
  - URL: https://docs.servicenow.com/
  - Trust Level: ⭐⭐⭐⭐⭐ (Official source)
  - Notes: Start here for accurate, version-specific information
  - Topics: Setup, configuration, plugins, capabilities

- **ServiceNow Developer Portal**
  - URL: https://developer.servicenow.com/
  - Trust Level: ⭐⭐⭐⭐⭐
  - Notes: Tutorials, code samples, API references
  - Topics: Custom skill development, integration patterns

## Community Resources
*Vetted community content*

- **ServiceNow Community Forums**
  - URL: https://www.servicenow.com/community/
  - Trust Level: ⭐⭐⭐⭐ (Moderated, peer-reviewed)
  - Notes: Real-world implementations, troubleshooting
  - Topics: Use cases, best practices, common issues

- **ServiceNow Developers YouTube Channel**
  - URL: https://www.youtube.com/@servicenowinc
  - Trust Level: ⭐⭐⭐⭐
  - Notes: Video tutorials and demonstrations
  - Topics: Feature walkthroughs, developer tips

## Learning Paths
*Structured courses*

- **ServiceNow Learning Portal**
  - URL: https://nowlearning.servicenow.com/
  - Trust Level: ⭐⭐⭐⭐⭐
  - Notes: Official training courses (may require subscription)
  - Topics: Comprehensive AI agent training paths

## Verified Primary Sources (Researched 2026-07-27)

### ServiceNow Fluent SDK Guides — ⭐⭐⭐⭐⭐ (best technical/architecture reference)
- **Building AI Agents Guide**: https://servicenow.github.io/sdk/guides/building-ai-agents-guide
  - Covers: agent identity fields (description/agentRole/instructions), ReAct loop, tool selection priority, single-agent vs workflow decisions, tables (`sn_aia_agent`, `sn_aia_usecase`)
- **AI Skills (NASK) Guide**: https://servicenow.github.io/sdk/guides/nowassist-skills-guide

### ServiceNow Official Docs — ⭐⭐⭐⭐⭐
- **Configure Now Assist AI agents (Zurich)**: https://www.servicenow.com/docs/r/intelligent-experiences/configuring-ai-agents.html
- **Create an agentic workflow**: https://www.servicenow.com/docs/r/intelligent-experiences/configure-use-case-ai-agents.html
- **Add a Now Assist skill to an AI agent**: https://www.servicenow.com/docs/r/intelligent-experiences/add-skill-ai-agent.html

### ServiceNow Community — ⭐⭐⭐⭐ (verified, practical walkthroughs)
- **Introducing AI Agents (Quick Start)**: https://www.servicenow.com/community/now-assist-articles/introducing-ai-agents-unlock-autonomous-productivity-at-scale/ta-p/3200447
- **Create your own AI Agent (walkthrough)**: https://www.servicenow.com/community/now-assist-articles/create-your-own-ai-agent-a-walkthrough-on-creating-an-ai-agent/ta-p/3208901
- **How to Build a Simple AI Agent**: https://www.servicenow.com/community/ceg-ai-coe-articles/how-to-build-a-simple-ai-agent/ta-p/3571607
- **AI Agent Tools (getting the most out of agentic workflows)**: https://www.servicenow.com/community/now-assist-articles/ai-agent-tools-getting-the-most-out-of-your-agentic-workflows/ta-p/3227648
- **NASK FAQ**: https://www.servicenow.com/community/now-assist-articles/now-assist-skill-kit-nask-faq/ta-p/3007953
- **NASK Tool & Deployment Options**: https://www.servicenow.com/community/now-assist-articles/now-assist-skill-kit-tool-and-deployment-options/ta-p/3284803
- **Creating a Custom Skill with NASK (Part 1)**: https://www.servicenow.com/community/developer-blog/creating-a-custom-skill-with-now-assist-skill-kit-part-1/bc-p/3452784
- **Agentic Workflows End-to-End Setup Guide**: https://www.servicenow.com/community/now-assist-articles/agentic-workflows-end-to-end-setup-guide/ta-p/3489031
- **Agentic AI: Building and Scaling on the Now Platform**: https://www.servicenow.com/community/developer-articles/agentic-ai-building-and-scaling-ai-agents-on-the-now-platform/ta-p/3423631

### Governance
- **AI Control Tower (Zurich)**: https://www.servicenow.com/community/grc-blog/servicenow-ai-control-tower-in-the-zurich-release-mastering-ai/ba-p/3365258

## Key Version Facts (verified)
- **AI Agents** natively available: **Yokohama** (early 2025); deepened in **Zurich** (late 2025)
- **Now Assist Skill Kit (NASK)**: shipped in **Xanadu**
- Prereq: Now Assist license; **Zurich Patch 2+ or Yokohama Patch 8+**; AI Search + Now Assist Panel enabled
- Key roles: **`sn_aia.admin`** (AI Agent Studio), **`sn_skill_builder.admin`** (NASK)
- Nesting model: **Tools → AI Agents → Agentic Workflows**
- Terminology: "Use Case" (legacy) → **"Agentic workflow"** (current); Now Assist Panel → **ServiceNow Otto Panel** (Zurich)
- **NASK not available on PDIs** (personal dev instances)

---

*Last Updated: 2026-07-27*
*Note: docs.servicenow.com deep pages often return nav menus only — page/step names verified, some body text pending confirmation*
