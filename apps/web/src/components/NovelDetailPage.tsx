import { ArrowLeft, BookOpen, Clock3, Play, Star } from "lucide-react";
import { BrandMark } from "./BrandMark";
import type { Novel, ReadingProgress } from "../types";

type NovelDetailPageProps = {
  novel: Novel;
  progress?: ReadingProgress;
  onBack: () => void;
  onReadFromStart: () => void;
  onContinueReading: () => void;
  onReadChapter: (chapterOrder: number) => void;
};

export function NovelDetailPage({
  novel,
  progress,
  onBack,
  onReadFromStart,
  onContinueReading,
  onReadChapter
}: NovelDetailPageProps) {
  const continueLabel = progress
    ? `Đọc tiếp chương ${progress.chapterOrder} (${Math.round(progress.progress)}%)`
    : "Đọc tiếp";

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#102238]">
      <header className="shadow-paper border-b border-[#d8c6a5] bg-[#fbfaf7]/92 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md text-left transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#b98b3b]/70 focus:ring-offset-2 focus:ring-offset-[#fbfaf7]"
            aria-label="Về trang chủ"
          >
            <BrandMark compact />
          </button>
          <button
            type="button"
            onClick={onBack}
            className="shadow-paper inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d8c6a5] bg-white px-3 text-sm font-medium text-[#102238] transition hover:border-[#b98b3b] hover:bg-[#f3ead8]"
          >
            <ArrowLeft size={17} />
            Trang chủ
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="grid gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
          <div className="paper-grain shadow-paper-lg rounded-lg border border-[#d8c6a5] p-4">
            <img
              src={novel.coverImage}
              alt={novel.title}
              className="aspect-[2/3] w-full rounded-md border border-[#b98b3b]/35 object-cover shadow-xl shadow-[#08294a]/20"
            />
          </div>

          <div className="ink-panel shadow-ink relative overflow-hidden rounded-lg border border-[#b98b3b]/45 p-6 text-white sm:p-8">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-[#d7b56a]/40" />
            <div className="absolute bottom-6 right-8 h-28 w-28 rounded-full border border-white/10" />

            <div className="relative">
              <div className="mb-4 flex flex-wrap gap-2">
                {novel.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-md border border-[#d7b56a]/55 bg-[#d7b56a]/12 px-3 py-1 text-sm font-medium text-[#f5dfac]"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-3xl font-bold leading-tight sm:text-5xl">{novel.title}</h1>
              <p className="mt-3 text-lg text-[#d7b56a]">{novel.author}</p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2">
                  <Star size={16} fill="currentColor" className="text-[#d7b56a]" />
                  {novel.rating} điểm
                </span>
                <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2">
                  <BookOpen size={16} className="text-[#d7b56a]" />
                  {novel.chapters.length} chương
                </span>
                <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2">
                  <Clock3 size={16} className="text-[#d7b56a]" />
                  {novel.status}
                </span>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-8 text-[#e7edf2]">{novel.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onReadFromStart}
                className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[#d7b56a] px-5 font-semibold text-[#081f36] shadow-lg shadow-[#030f1d]/25 transition hover:bg-[#edcf88]"
                >
                  <Play size={18} fill="currentColor" />
                  Đọc từ đầu
                </button>
                <button
                  type="button"
                  onClick={onContinueReading}
                  disabled={!progress}
                  className="inline-flex min-h-12 items-center gap-2 rounded-md border border-[#d7b56a]/70 bg-white/8 px-5 font-semibold text-white shadow-lg shadow-[#030f1d]/20 transition hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <BookOpen size={18} />
                  {continueLabel}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="shadow-paper mt-10 rounded-lg border border-[#d8c6a5] bg-[#fbfaf7] p-5">
          <h2 className="mb-4 font-serif text-2xl font-bold">Mục lục chương</h2>
          <div className="shadow-paper overflow-hidden rounded-md border border-[#d8c6a5] bg-white">
            {novel.chapters.map((chapter) => (
              <button
                key={chapter.order}
                type="button"
                onClick={() => onReadChapter(chapter.order)}
                className="flex w-full items-center justify-between border-b border-[#eee4d2] px-4 py-4 text-left last:border-b-0 hover:bg-[#f3ead8]"
              >
                <span className="font-medium">
                  Chương {chapter.order}: {chapter.title}
                </span>
                {progress?.chapterOrder === chapter.order ? (
                  <span className="text-sm font-semibold text-[#b98b3b]">{Math.round(progress.progress)}%</span>
                ) : null}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
