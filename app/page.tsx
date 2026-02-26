"use client";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4 py-12 sm:px-6">
      <main className="flex w-full max-w-2xl flex-col items-center">
        {/* Logo */}
        <h1 className="mb-12 font-serif text-5xl font-normal tracking-tight text-[#171717] sm:mb-16 sm:text-6xl md:text-7xl">
          Newton
        </h1>

        {/* Search bar */}
        <div className="relative mb-10 w-full sm:mb-12">
          <input
            type="text"
            placeholder="Ask Newton anything..."
            className="w-full rounded-full border border-[#e5e5e5] bg-white py-3.5 pl-5 pr-14 text-base text-[#171717] placeholder:text-[#737373] transition-colors focus:border-[#a3a3a3] focus:outline-none focus:ring-0 sm:py-4 sm:pl-6 sm:pr-16 sm:text-lg"
            aria-label="Search"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#171717] text-white transition-opacity hover:opacity-90 sm:right-3 sm:h-10 sm:w-10"
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
