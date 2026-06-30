# Kurrnt

**Intelligent media for the new age.**

Kurrnt is an AI-native news feed built for people who want to stay sharp on AI, science, and emerging technology — without drowning in noise. It aggregates stories from multiple sources, enriches each one with AI-generated insight, and lets you go deeper through Kepler, an AI companion built into every story.

Pure signal, no noise.

---

## What it does

- **Multi-source feed** — pulls stories from NewsAPI, Arxiv, HackerNews, GitHub, and Reddit across topics like AI, robotics, space, biotech, physics, quantum computing, neuroscience, climate tech, cybersecurity, and mathematics
- **Kepler's Insight** — every story is enriched with a short AI-generated insight that connects it to a broader pattern, often drawing on history, other fields, or non-obvious context
- **Ask Kepler** — an inline AI companion on every card. Ask follow-up questions, get context, or explore "what happens next" — all scoped to that specific story
- **Community Take** — for Reddit-sourced stories, Kepler reads the top comments and surfaces what the community is actually saying
- **Personalized feed** — choose your interests during onboarding and the feed filters and weights stories accordingly
- **Story of the Week** — the single most important story of the moment, pinned to the top of your feed
- **Importance scoring** — every story is scored on breadth of impact, novelty, recency, and cross-domain significance, so the feed surfaces what actually matters
- **Auth** — Google OAuth and email magic link via Supabase, fully passwordless

## Tech stack

- **Frontend** — Next.js, TypeScript, Tailwind CSS
- **Backend** — Next.js API routes
- **AI** — Claude (Anthropic API) — Haiku for feed enrichment, Sonnet for Kepler conversations
- **Auth & DB** — Supabase (Postgres, Auth, user metadata)
- **Email** — Resend (transactional email via custom domain)
- **Hosting** — Vercel
- **Sources** — NewsAPI, Arxiv, HackerNews, GitHub, Reddit (public JSON API)

## Live

[kurrnt.app](https://kurrnt.app)

## Status

Actively in development. Built solo, in public.

---

Built by [Jordan Spencer](https://jpcspencer.com)
