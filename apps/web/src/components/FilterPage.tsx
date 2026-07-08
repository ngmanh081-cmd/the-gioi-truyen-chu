import { ArrowLeft, BookOpen, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandMark } from "./BrandMark";
import type { Novel } from "../types";

type FilterPageProps = {
  novels: Novel[];
  categories: string[];
  selectedCategory: string | null;
  onBack: () => void;
  onSelectNovel: (novelId: string) => void;
  onSelectCategory: (category: string | null) => void;
};

function displayText(value: string) {
  return value.normalize("NFC");
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parseViews(views: string) {
  const value = Number.parseFloat(views);
  const normalized = views.toUpperCase();

  if (normalized.includes("M")) {
    return value * 1000000;
  }

  if (normalized.includes("K")) {
    return value * 1000;
  }

  return value;
}

export function FilterPage({
  novels,
  categories,
  selectedCategory,
  onBack,
  onSelectNovel,
  onSelectCategory
}: FilterPageProps) {
  const [query, setQuery] = useState("");

  const suggestedNovels = useMemo(
    () => [...novels].sort((first, second) => parseViews(second.views) - parseViews(first.views)).slice(0, 12),
    [novels]
  );

  const visibleNovels = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    const source = normalizedQuery ? novels : suggestedNovels;

    return source
      .filter((novel) => {
        if (selectedCategory && !novel.categories.includes(selectedCategory)) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        return normalizeSearch(novel.title).includes(normalizedQuery);
      })
      .slice(0, 24);
  }, [novels, query, selectedCategory, suggestedNovels]);

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#102238]">
      <header className="sticky top-0 z-30 border-b border-[#d8b35f]/35 bg-[#050505]/95 text-white shadow-[0_12px_34px_rgba(0,0,0,0.34)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md text-left transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#d8b35f]/70 focus:ring-offset-2 focus:ring-offset-[#050505]"
            aria-label="Về trang chủ"
          >
            <BrandMark compact inverted />
          </button>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d8b35f]/35 bg-[#fff3c4]/8 px-3 text-sm font-semibold text-[#fff3c4] transition hover:border-[#d8b35f] hover:bg-[#fff3c4]/14"
          >
            <ArrowLeft size={17} />
            Trang chủ
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="shadow-paper-lg overflow-hidden rounded-lg border border-[#d8c6a5] bg-[#fbfaf7]">
          <div className="bg-gradient-to-r from-[#050505] via-[#3a2a12] to-[#d8b35f] px-5 py-5 text-white">
            <h1 className="text-2xl font-bold">{displayText("Lọc truyện")}</h1>
            <p className="mt-1 text-sm text-white/85">
              {displayText("Nhập tên truyện để danh sách khớp dần theo nội dung bạn gõ.")}
            </p>
          </div>

          <div className="space-y-5 p-4 sm:p-5">
            <label className="flex min-h-12 items-center gap-3 rounded-full border border-[#d8c6a5] bg-white px-4 text-[#70675c] shadow-[0_10px_24px_rgba(8,41,74,0.08)]">
              <Search size={19} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={displayText("Tìm tên truyện...")}
                className="h-full flex-1 bg-transparent text-sm font-semibold text-[#102238] outline-none placeholder:text-[#8c8174]"
                autoFocus
              />
            </label>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => onSelectCategory(null)}
                className={`min-h-9 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${
                  selectedCategory === null
                    ? "border-[#08294a] bg-[#08294a] text-white"
                    : "border-[#dacbb1] bg-white text-[#594f43] hover:border-[#b98b3b]"
                }`}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onSelectCategory(category)}
                  className={`min-h-9 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? "border-[#08294a] bg-[#08294a] text-white"
                      : "border-[#dacbb1] bg-white text-[#594f43] hover:border-[#b98b3b]"
                  }`}
                >
                  {displayText(category)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                {query.trim() ? displayText("Kết quả tìm kiếm") : displayText("Truyện gợi ý")}
              </h2>
              <p className="mt-1 text-sm text-[#70675c]">
                {displayText(`${visibleNovels.length} truyện đang hiển thị`)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleNovels.map((novel) => (
              <button
                key={novel.id}
                type="button"
                onClick={() => onSelectNovel(novel.id)}
                className="shadow-paper shadow-hover-lift group overflow-hidden rounded-lg border border-[#d8c6a5] bg-[#fbfaf7] text-left transition hover:-translate-y-0.5 hover:border-[#b98b3b]"
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={novel.coverImage}
                    alt={novel.title}
                    className="h-36 w-24 shrink-0 rounded object-cover shadow-md shadow-[#08294a]/15"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {novel.categories.slice(0, 2).map((category) => (
                        <span key={category} className="rounded bg-[#edf2f5] px-2 py-1 text-xs text-[#0d456f]">
                          {displayText(category)}
                        </span>
                      ))}
                    </div>
                    <h3 className="line-clamp-2 text-lg font-bold group-hover:text-[#0d456f]">
                      {displayText(novel.title)}
                    </h3>
                    <p className="mt-1 text-sm text-[#70675c]">{displayText(novel.author)}</p>
                    <p className="mt-3 line-clamp-2 text-sm leading-5 text-[#4c5560]">
                      {displayText(novel.description)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#70675c]">
                      <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-1">
                        <Star size={13} className="text-[#b98b3b]" />
                        {novel.rating}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-1">
                        <BookOpen size={13} className="text-[#b98b3b]" />
                        {displayText(`${novel.chapters.length} chương`)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {visibleNovels.length === 0 ? (
            <div className="shadow-paper rounded-lg border border-[#d8c6a5] bg-[#fbfaf7] p-6 text-[#70675c]">
              {displayText("Chưa tìm thấy truyện có tên khớp với từ khóa này.")}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
