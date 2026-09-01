import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 auto-generates AGENTS.md / CLAUDE.md at the repo root; disabled —
  // this project's instructions live in .claude/CLAUDE.md, not the repo root.
  agentRules: false,
};

export default nextConfig;
