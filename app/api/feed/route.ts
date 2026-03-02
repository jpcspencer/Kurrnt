import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type NewsApiArticle = {
  source?: { id?: string | null; name?: string | null };
  author?: string | null;
  title?: string | null;
  description?: string | null;
  url?: string | null;
  publishedAt?: string | null;
};

type EnrichedArticle = {
  title: string;
  newtonSummary: string;
  sourceName: string;
  publishedAt: string;
  url: string;
  importance: number;
  noc: string | null;
  tag: string;
};

type ClaudeEnrichment = {
  newtonSummary?: string;
  importance?: number;
  noc?: string | null;
  tag?: string;
};

const ENRICHMENT_SYSTEM =
  "You are Newton, a warm and curious AI research companion. You interpret science and technology news with intelligence and clarity. Always respond in valid JSON only, no markdown, no backticks.";

const ENRICHMENT_USER_TEMPLATE = `Enrich this article for the Newton feed. Return a JSON object with these fields:
- newtonSummary: a 2-3 sentence summary in Newton's voice — clear, intelligent, no jargon, written for a curious non-expert
- importance: a number 1-5 based on genuine significance to science and technology
- noc: one sentence describing a non-obvious connection this story has to another field — only include if genuinely interesting, otherwise return null
- tag: one word category tag like "AI", "Space", "Biotech", "Physics", "Climate"

Article title: {title}
Article description: {description}`;

async function enrichArticle(
  article: { title: string; description: string; sourceName: string; publishedAt: string; url: string },
  anthropicKey: string
): Promise<EnrichedArticle> {
  const userPrompt = ENRICHMENT_USER_TEMPLATE.replace("{title}", article.title).replace(
    "{description}",
    article.description
  );

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: ENRICHMENT_SYSTEM,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const text = await response.text();
    let parsed: ClaudeEnrichment = {};

    try {
      const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      parsed = JSON.parse(cleaned) as ClaudeEnrichment;
    } catch {
      console.warn("[Feed API] Failed to parse Claude response for article:", article.title.slice(0, 50));
    }

    const importance = typeof parsed.importance === "number" ? Math.min(5, Math.max(1, parsed.importance)) : 3;
    const newtonSummary =
      typeof parsed.newtonSummary === "string" && parsed.newtonSummary.trim()
        ? parsed.newtonSummary.trim()
        : article.description;
    const noc = typeof parsed.noc === "string" && parsed.noc.trim() ? parsed.noc.trim() : null;
    const tag = typeof parsed.tag === "string" && parsed.tag.trim() ? parsed.tag.trim() : "Science";

    return {
      ...article,
      newtonSummary,
      importance,
      noc,
      tag,
    };
  } catch (err) {
    console.warn("[Feed API] Enrichment failed for article:", article.title.slice(0, 50), err);
    return {
      ...article,
      newtonSummary: article.description,
      importance: 3,
      noc: null,
      tag: article.sourceName,
    };
  }
}

export async function GET() {
  try {
    const newsApiKey = process.env.NEWS_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!newsApiKey) {
      return NextResponse.json(
        { error: "NEWS_API_KEY is not configured" },
        { status: 500 }
      );
    }

    if (!anthropicKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const url =
      "https://newsapi.org/v2/everything?q=(artificial+intelligence+OR+science+OR+space+OR+biotech+OR+physics+OR+climate+technology)&sortBy=publishedAt&language=en&pageSize=20&apiKey=" +
      newsApiKey;

    const res = await fetch(url);

    const data = (await res.json()) as {
      status?: string;
      articles?: NewsApiArticle[];
      message?: string;
    };

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message ?? "NewsAPI request failed" },
        { status: res.status }
      );
    }

    const articles = data.articles ?? [];
    const seenTitles = new Set<string>();
    const cleaned = articles
      .filter((a): a is NewsApiArticle & { description: string } => {
        return Boolean(a.description?.trim());
      })
      .map((a) => ({
        title: a.title ?? "",
        description: a.description ?? "",
        sourceName: a.source?.name ?? "Unknown",
        publishedAt: a.publishedAt ?? "",
        url: a.url ?? "",
      }))
      .filter((a) => {
        const normalized = a.title.trim().toLowerCase();
        if (seenTitles.has(normalized)) return false;
        seenTitles.add(normalized);
        return true;
      });

    const enriched = await Promise.all(cleaned.map((a) => enrichArticle(a, anthropicKey)));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("[Feed API] Unexpected error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
