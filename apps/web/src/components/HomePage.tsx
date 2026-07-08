import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { BookOpen, ChevronDown, Flame, Gift, History, Search, Sparkles, Trophy } from "lucide-react";
import { BrandMark } from "./BrandMark";
import type { Novel, ReadingProgress } from "../types";

type HomePageProps = {
  novels: Novel[];
  allNovels: Novel[];
  categories: string[];
  selectedCategory: string | null;
  progressByNovel: Record<string, ReadingProgress>;
  onSelectNovel: (novelId: string) => void;
  onSelectCategory: (category: string | null) => void;
  onOpenFilter: () => void;
  onGoHome: () => void;
};

type PanelKey = "top" | "filter" | "history";
type StatusFilter = "all" | "ongoing" | "completed" | "paused";
type AudienceFilter = "all" | "female" | "male";
type SortFilter = "updated" | "new" | "chapters" | "follow" | "views" | "recommended";
type ChapterFilter = "all" | "under300" | "300to1000" | "1000to2000" | "over2000";

const audienceByNovel: Record<string, AudienceFilter> = {
  "nhat-ky-hai-vuong": "male",
  "thanh-pho-sau-trang-sach": "male",
  "kiem-anh-mua-ha": "male",
  "tram-tau-tinh-van": "female",
  "quan-tra-cuoi-hem": "female",
  "mat-ma-vuong-trieu": "male",
  "hoc-vien-lap-trinh-su": "male"
};

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

function displayText(value: string) {
  return value.normalize("NFC");
}

function Pill({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-9 rounded-full border px-4 text-sm font-semibold transition ${
        active
          ? "border-[#08294a] bg-[#08294a] text-white shadow-[0_10px_22px_rgba(8,41,74,0.18)]"
          : "border-[#dacbb1] bg-[#f7f2ea] text-[#594f43] hover:border-[#b98b3b] hover:bg-white hover:text-[#08294a] hover:shadow-[0_8px_18px_rgba(8,41,74,0.08)]"
      }`}
    >
      {displayText(children)}
    </button>
  );
}

function FilterGroup({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#e0d2ba] bg-white/80 p-4 shadow-[0_10px_24px_rgba(8,41,74,0.06)]">
      <div className="mb-3">
        <h3 className="text-base font-bold text-[#102238]">{displayText(title)}</h3>
        {description ? <p className="mt-0.5 text-xs text-[#7a6f62]">{displayText(description)}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function PanelNovelItem({
  novel,
  index,
  onSelectNovel
}: {
  novel: Novel;
  index: number;
  onSelectNovel: (novelId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectNovel(novel.id)}
      className="flex w-full min-w-0 items-center gap-3 rounded-md p-2 text-left transition hover:bg-[#f3ead8] hover:shadow-[0_8px_18px_rgba(8,41,74,0.08)]"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[#d7b56a] bg-[#fffaf0] text-sm font-bold text-[#8d6320]">
        {index + 1}
      </span>
      <img
        src={novel.coverImage}
        alt={novel.title}
        className="h-14 w-11 shrink-0 rounded object-cover shadow-md shadow-[#08294a]/15"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[#102238]">{displayText(novel.title)}</p>
        <p className="text-sm text-[#70675c]">{displayText(`${novel.views} lượt đọc`)}</p>
      </div>
    </button>
  );
}

export function HomePage({
  allNovels,
  categories,
  selectedCategory,
  progressByNovel,
  onSelectNovel,
  onSelectCategory,
  onOpenFilter,
  onGoHome
}: HomePageProps) {
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [audience, setAudience] = useState<AudienceFilter>("all");
  const [sort, setSort] = useState<SortFilter>("updated");
  const [chapterRange, setChapterRange] = useState<ChapterFilter>("all");

  const featuredNovel = allNovels[0];

  const topReadNovels = useMemo(
    () => [...allNovels].sort((first, second) => parseViews(second.views) - parseViews(first.views)).slice(0, 10),
    [allNovels]
  );

  const recommendedNovels = useMemo(
    () => [...allNovels].sort((first, second) => second.rating - first.rating).slice(0, 10),
    [allNovels]
  );

  const monthlyRecommendedNovels = useMemo(
    () =>
      [...allNovels]
        .sort((first, second) => second.rating * 10000 + parseViews(second.views) - (first.rating * 10000 + parseViews(first.views)))
        .slice(0, 10),
    [allNovels]
  );

  const topGiftNovels = useMemo(
    () =>
      [...allNovels]
        .sort((first, second) => second.rating * 5000 + second.chapters.length * 300 + parseViews(second.views) - (first.rating * 5000 + first.chapters.length * 300 + parseViews(first.views)))
        .slice(0, 10),
    [allNovels]
  );

  const readingHistory = useMemo(
    () =>
      Object.values(progressByNovel)
        .sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt))
        .map((progress) => allNovels.find((novel) => novel.id === progress.novelId))
        .filter((novel): novel is Novel => Boolean(novel)),
    [allNovels, progressByNovel]
  );

  const filteredNovels = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allNovels
      .filter((novel) => {
        if (normalizedQuery && !`${novel.title} ${novel.author}`.toLowerCase().includes(normalizedQuery)) {
          return false;
        }

        if (selectedCategory && !novel.categories.includes(selectedCategory)) {
          return false;
        }

        if (status === "ongoing" && novel.status !== "Đang ra") {
          return false;
        }

        if (status === "completed" && novel.status !== "Hoàn thành") {
          return false;
        }

        if (status === "paused") {
          return false;
        }

        if (audience !== "all" && (audienceByNovel[novel.id] ?? "male") !== audience) {
          return false;
        }

        if (chapterRange === "under300" && novel.chapters.length >= 300) {
          return false;
        }

        if (chapterRange === "300to1000" && (novel.chapters.length < 300 || novel.chapters.length > 1000)) {
          return false;
        }

        if (chapterRange === "1000to2000" && (novel.chapters.length < 1000 || novel.chapters.length > 2000)) {
          return false;
        }

        if (chapterRange === "over2000" && novel.chapters.length <= 2000) {
          return false;
        }

        return true;
      })
      .sort((first, second) => {
        if (sort === "views") {
          return parseViews(second.views) - parseViews(first.views);
        }

        if (sort === "recommended") {
          return second.rating - first.rating;
        }

        if (sort === "chapters") {
          return second.chapters.length - first.chapters.length;
        }

        if (sort === "follow") {
          return parseViews(second.views) * second.rating - parseViews(first.views) * first.rating;
        }

        if (sort === "new") {
          return second.title.localeCompare(first.title, "vi");
        }

        return second.rating + parseViews(second.views) / 100000 - (first.rating + parseViews(first.views) / 100000);
      });
  }, [allNovels, audience, chapterRange, query, selectedCategory, sort, status]);

  const togglePanel = (panel: PanelKey) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  const editorRecommendedNovels = filteredNovels.slice(0, 10);

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#102238]">
      <header className="sticky top-0 z-30 border-b border-[#d8b35f]/35 bg-[#050505]/95 text-white shadow-[0_12px_34px_rgba(0,0,0,0.34)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onGoHome}
            className="rounded-md text-left transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#d8b35f]/70 focus:ring-offset-2 focus:ring-offset-[#050505]"
            aria-label="Về trang chủ"
          >
            <BrandMark compact inverted />
          </button>

          <button
            type="button"
            onClick={onOpenFilter}
            className="hidden min-h-11 w-full max-w-md items-center gap-2 rounded-md border border-[#d8b35f]/45 bg-[#14110b] px-3 text-left text-[#d8b35f] shadow-[0_0_24px_rgba(216,179,95,0.12)] md:flex"
          >
            <Search size={18} />
            <span className="text-sm">{displayText(query || "Tìm truyện, tác giả, thể loại")}</span>
          </button>
        </div>

        <div className="border-t border-[#d8b35f]/20 bg-[#0b0906]/80">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6">
            {[
              { key: "top" as const, label: "Top truyện", icon: Trophy },
              { key: "filter" as const, label: "Lọc truyện", icon: Search },
              { key: "history" as const, label: "Đang đọc", icon: History }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (key === "filter") {
                    setOpenPanel(null);
                    onOpenFilter();
                    return;
                  }

                  togglePanel(key);
                }}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition ${
                  openPanel === key
                    ? "border-[#d8b35f] bg-[#d8b35f] text-[#11100d]"
                    : "border-[#d8b35f]/25 bg-[#fff3c4]/8 text-[#fff3c4] hover:border-[#d8b35f] hover:bg-[#fff3c4]/14"
                }`}
              >
                <Icon size={17} />
                {displayText(label)}
                {key === "filter" ? null : (
                  <ChevronDown size={16} className={openPanel === key ? "rotate-180 transition" : "transition"} />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {openPanel ? (
            <motion.div
              key={openPanel}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="shadow-paper-lg max-h-[75vh] overflow-y-auto border-t border-[#e6dcc9] bg-[#fbfaf7]"
            >
              <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
                {openPanel === "top" ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {[
                      { title: "Top đọc", icon: Flame, items: topReadNovels },
                      { title: "Top đề cử", icon: Trophy, items: recommendedNovels }
                    ].map(({ title, icon: Icon, items }) => (
                      <section key={title} className="shadow-paper rounded-lg border border-[#d8c6a5] bg-white p-4">
                        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                          <Icon size={18} className="text-[#b98b3b]" />
                          {displayText(title)}
                        </h3>
                        <div className="space-y-1">
                          {items.map((novel, index) => (
                            <PanelNovelItem
                              key={novel.id}
                              novel={novel}
                              index={index}
                              onSelectNovel={onSelectNovel}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : null}

                {openPanel === "filter" ? (
                  <div className="space-y-5">
                    <div className="flex flex-col gap-3 rounded-lg border border-[#d8c6a5] bg-[#fdfbf7] p-4 shadow-paper md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-[#102238]">{displayText("Lọc truyện")}</h2>
                        <p className="mt-1 text-sm text-[#7a6f62]">
                          {displayText("Tinh chỉnh danh sách theo gu đọc của bạn.")}
                        </p>
                      </div>
                      <div className="flex min-h-11 w-full items-center gap-2 rounded-full border border-[#d8c6a5] bg-white px-4 text-[#70675c] shadow-[0_8px_18px_rgba(8,41,74,0.06)] md:max-w-md">
                        <Search size={18} />
                        <input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder={displayText("Tìm tên truyện, tác giả...")}
                          className="h-full flex-1 bg-transparent text-sm font-medium outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <FilterGroup title="Trạng thái" description="Tình trạng phát hành của truyện">
                        {[
                          ["all", "Toàn bộ"],
                          ["ongoing", "Đang ra"],
                          ["completed", "Hoàn thành"],
                          ["paused", "Tạm dừng"]
                        ].map(([value, label]) => (
                          <Pill key={value} active={status === value} onClick={() => setStatus(value as StatusFilter)}>
                            {label}
                          </Pill>
                        ))}
                      </FilterGroup>

                      <FilterGroup title="Giới tính" description="Nhóm độc giả thường theo dõi">
                        {[
                          ["all", "Tất cả"],
                          ["female", "Truyện nữ"],
                          ["male", "Truyện nam"]
                        ].map(([value, label]) => (
                          <Pill
                            key={value}
                            active={audience === value}
                            onClick={() => setAudience(value as AudienceFilter)}
                          >
                            {label}
                          </Pill>
                        ))}
                      </FilterGroup>

                      <FilterGroup title="Sắp xếp theo" description="Cách ưu tiên kết quả hiển thị">
                        {[
                          ["updated", "Mới cập nhật"],
                          ["new", "Truyện mới"],
                          ["chapters", "Số chương"],
                          ["follow", "Theo dõi"],
                          ["views", "Lượt xem"],
                          ["recommended", "Đề cử"]
                        ].map(([value, label]) => (
                          <Pill key={value} active={sort === value} onClick={() => setSort(value as SortFilter)}>
                            {label}
                          </Pill>
                        ))}
                      </FilterGroup>

                      <FilterGroup title="Số chương" description="Độ dài bộ truyện">
                        {[
                          ["all", "Toàn bộ"],
                          ["under300", "<300"],
                          ["300to1000", "300-1000"],
                          ["1000to2000", "1000-2000"],
                          ["over2000", ">2000"]
                        ].map(([value, label]) => (
                          <Pill
                            key={value}
                            active={chapterRange === value}
                            onClick={() => setChapterRange(value as ChapterFilter)}
                          >
                            {label}
                          </Pill>
                        ))}
                      </FilterGroup>

                      <FilterGroup title="Thể loại" description="Chọn một dòng truyện chính">
                        <Pill active={selectedCategory === null} onClick={() => onSelectCategory(null)}>
                          Tất cả
                        </Pill>
                        {categories.map((category) => (
                          <Pill
                            key={category}
                            active={selectedCategory === category}
                            onClick={() => onSelectCategory(category)}
                          >
                            {category}
                          </Pill>
                        ))}
                      </FilterGroup>
                    </div>
                  </div>
                ) : null}

                {openPanel === "history" ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {readingHistory.length > 0 ? (
                      readingHistory.map((novel, index) => (
                        <PanelNovelItem key={novel.id} novel={novel} index={index} onSelectNovel={onSelectNovel} />
                      ))
                    ) : (
                      <p className="rounded-md border border-[#d8c6a5] bg-white p-4 text-sm text-[#70675c]">
                        Bạn chưa có truyện đang đọc.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section>
          <button
            type="button"
            onClick={() => onSelectNovel(featuredNovel.id)}
            className="shadow-paper-lg shadow-hover-lift group grid min-h-[360px] w-full overflow-hidden rounded-lg border border-[#b98b3b]/45 text-left md:grid-cols-[260px_minmax(0,1fr)]"
          >
            <div className="relative flex min-h-[360px] flex-col items-center justify-center gap-4 bg-[#071f38] p-5">
              <img
                src={featuredNovel.coverImage}
                alt={featuredNovel.title}
                className="aspect-[2/3] w-full max-w-[150px] rounded-md object-cover shadow-2xl shadow-black/35 transition duration-300 group-hover:scale-[1.02] sm:max-w-[164px]"
              />
              <div className="shadow-paper w-full max-w-[164px] rounded-md border border-[#d7b56a]/60 bg-[#fbfaf7]/92 px-3 py-2 text-[#08294a]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b98b3b]">Văn tuyển</p>
                <p className="mt-0.5 text-sm font-bold">{displayText("Đề cử trong ngày")}</p>
              </div>
            </div>

            <div className="ink-panel relative flex min-h-[360px] flex-col justify-center overflow-hidden p-6 text-white sm:p-8 lg:p-10">
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full border border-[#d7b56a]/40" />
              <div className="absolute right-8 top-8 h-24 w-24 rounded-full border border-[#fbfaf7]/15" />

              <div className="relative max-w-3xl">
                <div className="mb-3 flex flex-wrap gap-2">
                  {featuredNovel.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-md border border-[#d7b56a]/55 bg-[#d7b56a]/12 px-3 py-1 text-xs font-medium text-[#f5dfac]"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <p className="mb-2 flex items-center gap-2 text-sm text-[#d7b56a]">
                  <Sparkles size={16} />
                  {displayText("Mở một trang, bước vào một giới")}
                </p>
                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{displayText(featuredNovel.title)}</h2>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#e7edf2]">
                  {displayText(featuredNovel.description)}
                </p>
                <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-md bg-[#d7b56a] px-4 py-2.5 text-sm font-semibold text-[#081f36] transition group-hover:bg-[#edcf88]">
                  <BookOpen size={18} />
                  {displayText("Khám phá truyện")}
                </div>
              </div>
            </div>
          </button>

          <aside className="hidden">
            <section className="shadow-paper rounded-lg border border-[#d8c6a5] bg-[#fbfaf7] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Flame size={19} className="text-[#b98b3b]" />
                  {displayText("Top đọc")}
                </h2>
                <span className="text-sm text-[#70675c]">Lượt xem</span>
              </div>
              <div className="space-y-3">
                {topReadNovels.slice(0, 4).map((novel, index) => (
                  <PanelNovelItem key={novel.id} novel={novel} index={index} onSelectNovel={onSelectNovel} />
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-[#ee7ab5] bg-white shadow-paper">
              <div className="bg-gradient-to-r from-[#e9489d] to-[#d41472] px-5 py-4 text-white">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Gift size={19} />
                  {displayText("Top tặng quà")}
                </h2>
                <p className="mt-1 text-sm text-white/85">Truyện được tặng quà nhiều trong tuần</p>
              </div>
              <div className="space-y-2 p-4">
                {topGiftNovels.slice(0, 5).map((novel, index) => (
                  <button
                    key={novel.id}
                    type="button"
                    onClick={() => onSelectNovel(novel.id)}
                    className={`flex w-full items-center gap-3 rounded-md text-left transition hover:bg-[#fff0f7] ${
                      index === 0 ? "border border-[#e9489d] bg-[#fff0f7] p-3 shadow-[0_14px_30px_rgba(217,20,114,0.2)]" : "p-2"
                    }`}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e9489d] text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <img
                      src={novel.coverImage}
                      alt={novel.title}
                      className={`${index === 0 ? "h-20 w-14" : "h-12 w-9"} shrink-0 rounded object-cover shadow-md shadow-[#08294a]/15`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#102238]">{displayText(novel.title)}</p>
                      <p className="text-sm text-[#d41472]">{displayText(`${Math.round(parseViews(novel.views) / 2).toLocaleString("vi-VN")} gold`)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Top đọc",
              subtitle: "10 truyện có lượt đọc cao nhất",
              icon: Flame,
              items: topReadNovels,
              header: "from-[#050505] via-[#3a2a12] to-[#d8b35f]",
              accent: "text-[#9a6b20]",
              metric: (novel: Novel) => `${novel.views} lượt đọc`
            },
            {
              title: "Top đề cử",
              subtitle: "10 truyện được đề cử nổi bật",
              icon: Trophy,
              items: recommendedNovels,
              header: "from-[#120f09] via-[#5a3d13] to-[#c89537]",
              accent: "text-[#8a5a14]",
              metric: (novel: Novel) => `${Math.round(parseViews(novel.views) / 100).toLocaleString("vi-VN")} phiếu`
            },
            {
              title: "Top tặng quà",
              subtitle: "10 truyện được tặng quà nhiều trong tuần",
              icon: Gift,
              items: topGiftNovels,
              header: "from-[#e9489d] to-[#d41472]",
              accent: "text-[#d41472]",
              metric: (novel: Novel) => `${Math.round(parseViews(novel.views) / 2).toLocaleString("vi-VN")} gold`
            }
          ].map(({ title, subtitle, icon: Icon, items, header, accent, metric }) => (
            <section key={title} className="overflow-hidden rounded-lg border border-[#d8c6a5] bg-white shadow-paper">
              <div className={`bg-gradient-to-r ${header} px-5 py-4 text-white`}>
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Icon size={19} />
                  {displayText(title)}
                </h2>
                <p className="mt-1 text-sm text-white/85">{displayText(subtitle)}</p>
              </div>
              <div className="space-y-2 p-4">
                {items.map((novel, index) => (
                  <button
                    key={novel.id}
                    type="button"
                    onClick={() => onSelectNovel(novel.id)}
                    className={`flex w-full items-center gap-3 rounded-md text-left transition hover:bg-[#fff7ed] ${
                      index === 0
                        ? "border border-[#fb923c] bg-[#fff7ed] p-3 shadow-[0_14px_30px_rgba(249,115,22,0.18)]"
                        : "p-2"
                    }`}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#14110b] text-sm font-bold text-[#fff3c4] ring-1 ring-[#d8b35f]/60">
                      {index + 1}
                    </span>
                    <img
                      src={novel.coverImage}
                      alt={novel.title}
                      className={`${index === 0 ? "h-20 w-14" : "h-12 w-9"} shrink-0 rounded object-cover shadow-md shadow-[#08294a]/15`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#102238]">{displayText(novel.title)}</p>
                      <p className={`text-sm ${accent}`}>{displayText(metric(novel))}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="shadow-paper mt-8 overflow-hidden rounded-lg border border-[#d8c6a5] bg-[#fbfaf7]">
          <div className="bg-gradient-to-r from-[#050505] via-[#3a2a12] to-[#d8b35f] px-5 py-4 text-white">
            <h2 className="text-xl font-bold">{displayText("Top đề cử theo tháng")}</h2>
            <p className="mt-1 text-sm text-white/85">Những truyện được BTV và độc giả đề cử nổi bật</p>
          </div>
          <div className="grid auto-rows-fr gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
            {monthlyRecommendedNovels.map((novel, index) => (
              <button
                key={novel.id}
                type="button"
                onClick={() => onSelectNovel(novel.id)}
                className={`group flex h-full min-h-[132px] gap-3 rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:border-[#d8b35f] hover:shadow-[0_12px_28px_rgba(20,17,11,0.14)] ${
                  index === 0
                    ? "border-[#d8b35f] bg-[#fff7df]"
                    : "border-[#ead9bf] bg-white"
                }`}
              >
                <span className="relative h-[104px] w-[70px] shrink-0">
                  <img
                    src={novel.coverImage}
                    alt={novel.title}
                    className="h-full w-full rounded object-cover shadow-md shadow-[#08294a]/15"
                  />
                  <span className="absolute -left-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-[#14110b] text-xs font-bold text-[#fff3c4] shadow-md shadow-[#14110b]/25 ring-1 ring-[#d8b35f]/60">
                    {index + 1}
                  </span>
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="line-clamp-2 font-semibold text-[#102238] group-hover:text-[#9a6b20]">
                    {displayText(novel.title)}
                  </p>
                  <p className="mt-1 text-sm text-[#70675c]">{displayText(novel.author)}</p>
                  <p className="mt-auto pt-2 text-sm text-[#9a6b20]">
                    {displayText(`${Math.round(parseViews(novel.views) / 100).toLocaleString("vi-VN")} phiếu tháng`)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{displayText("BTV đề cử")}</h2>
            <span className="text-sm text-[#70675c]">{displayText(`${editorRecommendedNovels.length} truyện`)}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {editorRecommendedNovels.map((novel) => {
              const progress = progressByNovel[novel.id];

              return (
                <motion.button
                  key={novel.id}
                  type="button"
                  onClick={() => onSelectNovel(novel.id)}
                  className="shadow-paper shadow-hover-lift group overflow-hidden rounded-lg border border-[#d8c6a5] bg-[#fbfaf7] text-left hover:-translate-y-0.5 hover:border-[#b98b3b]"
                  whileTap={{ scale: 0.99 }}
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
                            {category}
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
                      {progress ? (
                        <div className="mt-3 h-1.5 rounded bg-[#e5d8bd]">
                          <div
                            className="h-full rounded bg-[#b98b3b]"
                            style={{ width: `${Math.max(6, progress.progress)}%` }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.button>
              );
            })}
            {editorRecommendedNovels.length === 0 ? (
              <div className="rounded-lg border border-[#d8c6a5] bg-[#fbfaf7] p-6 text-[#70675c] sm:col-span-2 lg:col-span-3">
                {displayText("Chưa có truyện phù hợp với bộ lọc này.")}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
