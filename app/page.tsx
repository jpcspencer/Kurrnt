"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getTextContent).join("");
  if (children && typeof children === "object" && "props" in children) {
    return getTextContent((children as React.ReactElement).props.children);
  }
  return "";
}

function ResponseContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => {
          const text = getTextContent(children);
          if (text.trimStart().startsWith("⚡ NoC")) {
            return (
              <div className="mt-4 rounded-lg border border-[#e5e0da] bg-[#f5f2ee] px-4 py-3.5 first:mt-0">
                <p className="text-[15px] leading-relaxed text-[#171717] [&>strong]:font-bold [&>strong]:text-[#171717]">
                  {children}
                </p>
              </div>
            );
          }
          return <p className="mb-3 last:mb-0 text-[15px] leading-relaxed text-[#171717]">{children}</p>;
        },
        strong: ({ children }) => <strong className="font-semibold text-[#171717]">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="my-3 list-disc pl-5 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="my-3 list-decimal pl-5 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-[15px] leading-relaxed">{children}</li>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const text = await res.text();
      let data: { error?: string; response?: string };
      try {
        data = JSON.parse(text);
      } catch {
        setError(
          res.status === 404
            ? "Chat API not found (404). Restart the dev server and try again."
            : `Server returned ${res.status}. ${text ? `Response: ${text.slice(0, 100)}` : ""}`
        );
        return;
      }

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      setResponse(data.response ?? "");
      setMessage("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect";
      setError(msg.includes("fetch") || msg.includes("network") ? "Failed to connect. Check your network." : msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4 py-12 sm:px-6">
      <main className="flex w-full max-w-2xl flex-col items-center">
        {/* Logo */}
        <h1 className="mb-12 font-serif text-5xl font-normal tracking-tight text-[#171717] sm:mb-16 sm:text-6xl md:text-7xl">
          Newton
        </h1>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="relative mb-10 w-full sm:mb-12">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Newton anything..."
            disabled={isLoading}
            className="w-full rounded-full border border-[#e5e5e5] bg-white py-3.5 pl-5 pr-14 text-base text-[#171717] placeholder:text-[#737373] transition-colors focus:border-[#a3a3a3] focus:outline-none focus:ring-0 disabled:opacity-60 sm:py-4 sm:pl-6 sm:pr-16 sm:text-lg"
            aria-label="Search"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#171717] text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:right-3 sm:h-10 sm:w-10"
            aria-label="Send"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 translate-x-0.5 sm:h-[18px] sm:w-[18px]"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>

        {/* AI News Feed */}
        <section className="mb-10 w-full max-w-xl sm:mb-12">
          <div className="flex flex-col items-center gap-4 sm:gap-5">
            {/* Card 1 */}
            <article className="w-full rounded-lg border border-[#e8e8e8] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:px-6 sm:py-6">
              <span className="mb-3 inline-block text-xs font-medium uppercase tracking-wider text-[#737373]">
                Research
              </span>
              <h2 className="mb-2 font-serif text-xl font-normal leading-tight text-[#171717] sm:text-2xl">
                Multimodal models achieve human-level reasoning on science benchmarks
              </h2>
              <p className="mb-4 text-[15px] leading-relaxed text-[#525252]">
                A new evaluation framework reveals that frontier models now match expert human performance across physics, chemistry, and biology. The gap between AI and human scientific reasoning has narrowed significantly in the past year.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[#171717] bg-white px-4 py-2 text-sm font-medium text-[#171717] transition-colors hover:bg-[#171717] hover:text-white"
                >
                  Go deeper with Newton
                </button>
                <time className="text-xs text-[#a3a3a3]" dateTime="2025-02-26">
                  2 hours ago
                </time>
              </div>
            </article>

            {/* Card 2 */}
            <article className="w-full rounded-lg border border-[#e8e8e8] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:px-6 sm:py-6">
              <span className="mb-3 inline-block text-xs font-medium uppercase tracking-wider text-[#737373]">
                Industry
              </span>
              <h2 className="mb-2 font-serif text-xl font-normal leading-tight text-[#171717] sm:text-2xl">
                Major cloud providers announce unified AI inference pricing
              </h2>
              <p className="mb-4 text-[15px] leading-relaxed text-[#525252]">
                Three leading cloud platforms have aligned their pricing models for large language model inference, potentially lowering costs for enterprise deployments. Analysts expect the move to accelerate adoption of on-demand AI workloads.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[#171717] bg-white px-4 py-2 text-sm font-medium text-[#171717] transition-colors hover:bg-[#171717] hover:text-white"
                >
                  Go deeper with Newton
                </button>
                <time className="text-xs text-[#a3a3a3]" dateTime="2025-02-26">
                  5 hours ago
                </time>
              </div>
            </article>

            {/* Card 3 */}
            <article className="w-full rounded-lg border border-[#e8e8e8] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:px-6 sm:py-6">
              <span className="mb-3 inline-block text-xs font-medium uppercase tracking-wider text-[#737373]">
                Breakthrough
              </span>
              <h2 className="mb-2 font-serif text-xl font-normal leading-tight text-[#171717] sm:text-2xl">
                First AI system passes full medical licensing exam without fine-tuning
              </h2>
              <p className="mb-4 text-[15px] leading-relaxed text-[#525252]">
                A zero-shot model achieved passing scores across all sections of a national medical board exam. The result suggests general-purpose models may soon assist in high-stakes clinical decision support without domain-specific training.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[#171717] bg-white px-4 py-2 text-sm font-medium text-[#171717] transition-colors hover:bg-[#171717] hover:text-white"
                >
                  Go deeper with Newton
                </button>
                <time className="text-xs text-[#a3a3a3]" dateTime="2025-02-25">
                  Yesterday
                </time>
              </div>
            </article>
          </div>
        </section>

        {/* Response / Loading / Error */}
        <div className="mb-10 w-full sm:mb-12">
          {isLoading && (
            <div className="flex items-center gap-2 text-[#737373]">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm">Thinking...</span>
            </div>
          )}
          {error && !isLoading && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {response && !isLoading && (
            <div className="rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-5 py-4">
              <ResponseContent content={response} />
            </div>
          )}
        </div>

        {/* Navigation strip */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-[#525252] sm:gap-x-10">
          <a
            href="#"
            className="transition-colors hover:text-[#171717]"
          >
            Recent Papers
          </a>
          <a
            href="#"
            className="transition-colors hover:text-[#171717]"
          >
            Science News
          </a>
          <a
            href="#"
            className="transition-colors hover:text-[#171717]"
          >
            Discoveries
          </a>
        </nav>
      </main>
    </div>
  );
}
