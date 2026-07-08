import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { FilterPage } from "./components/FilterPage";
import { HomePage } from "./components/HomePage";
import { NovelDetailPage } from "./components/NovelDetailPage";
import { ReaderView } from "./components/ReaderView";
import { categories, novels } from "./data/novels";
import type { ReadingProgress } from "./types";

const READING_PROGRESS_KEY = "vangioi:reading-progress";

type PageState =
  | { name: "home" }
  | { name: "filter" }
  | { name: "detail"; novelId: string }
  | { name: "reader"; novelId: string; chapterOrder: number; resumeProgress: number };

function readStoredProgress() {
  try {
    const rawValue = localStorage.getItem(READING_PROGRESS_KEY);
    return rawValue ? (JSON.parse(rawValue) as Record<string, ReadingProgress>) : {};
  } catch {
    return {};
  }
}

function writeStoredProgress(progressByNovel: Record<string, ReadingProgress>) {
  localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(progressByNovel));
}

export default function App() {
  const [page, setPage] = useState<PageState>({ name: "home" });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [progressByNovel, setProgressByNovel] = useState<Record<string, ReadingProgress>>(readStoredProgress);

  const visibleNovels = useMemo(
    () =>
      selectedCategory
        ? novels.filter((novel) => novel.categories.includes(selectedCategory))
        : novels,
    [selectedCategory]
  );

  const selectedNovel =
    page.name === "detail" || page.name === "reader"
      ? novels.find((novel) => novel.id === page.novelId)
      : null;
  const selectedChapter =
    page.name === "reader"
      ? selectedNovel?.chapters.find((chapter) => chapter.order === page.chapterOrder)
      : null;

  const showNovelDetail = useCallback((novelId: string) => {
    setPage({ name: "detail", novelId });
  }, []);

  const showHome = useCallback(() => {
    setPage({ name: "home" });
  }, []);

  const showFilter = useCallback(() => {
    setPage({ name: "filter" });
  }, []);

  const startReading = useCallback((novelId: string, chapterOrder: number, resumeProgress = 0) => {
    setPage({ name: "reader", novelId, chapterOrder, resumeProgress });
  }, []);

  const saveReadingProgress = useCallback((novelId: string, chapterOrder: number, progress: number) => {
    setProgressByNovel((current) => {
      const nextProgress = {
        ...current,
        [novelId]: {
          novelId,
          chapterOrder,
          progress,
          updatedAt: new Date().toISOString()
        }
      };

      writeStoredProgress(nextProgress);
      return nextProgress;
    });
  }, []);

  if (selectedNovel && page.name === "detail") {
    const progress = progressByNovel[selectedNovel.id];

    return (
      <motion.main
        className="min-h-screen"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <NovelDetailPage
          novel={selectedNovel}
          progress={progress}
          onBack={showHome}
          onReadFromStart={() => startReading(selectedNovel.id, 1, 0)}
          onContinueReading={() => {
            if (progress) {
              startReading(selectedNovel.id, progress.chapterOrder, progress.progress);
            }
          }}
          onReadChapter={(chapterOrder) => startReading(selectedNovel.id, chapterOrder, 0)}
        />
      </motion.main>
    );
  }

  if (page.name === "filter") {
    return (
      <motion.main
        className="min-h-screen"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <FilterPage
          novels={novels}
          categories={categories}
          selectedCategory={selectedCategory}
          onBack={showHome}
          onSelectNovel={showNovelDetail}
          onSelectCategory={setSelectedCategory}
        />
      </motion.main>
    );
  }

  if (selectedNovel && selectedChapter && page.name === "reader") {
    const previousChapter = selectedNovel.chapters.find((chapter) => chapter.order === selectedChapter.order - 1);
    const nextChapter = selectedNovel.chapters.find((chapter) => chapter.order === selectedChapter.order + 1);

    return (
      <motion.main
        className="min-h-screen"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <ReaderView
          novelTitle={selectedNovel.title}
          chapterTitle={`Chương ${selectedChapter.order}: ${selectedChapter.title}`}
          content={selectedChapter.content}
          pdfUrl={selectedChapter.pdfUrl}
          initialProgress={page.resumeProgress}
          onBack={() => showNovelDetail(selectedNovel.id)}
          onHome={showHome}
          onProgressChange={(progress) => saveReadingProgress(selectedNovel.id, selectedChapter.order, progress)}
          previousChapter={
            previousChapter
              ? {
                  label: `Chương ${previousChapter.order}`,
                  onClick: () => startReading(selectedNovel.id, previousChapter.order, 0)
                }
              : null
          }
          nextChapter={
            nextChapter
              ? {
                  label: `Chương ${nextChapter.order}`,
                  onClick: () => startReading(selectedNovel.id, nextChapter.order, 0)
                }
              : null
          }
        />
      </motion.main>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={`home-${selectedCategory ?? "all"}`}
        className="min-h-screen"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <HomePage
          novels={visibleNovels}
          allNovels={novels}
          categories={categories}
          selectedCategory={selectedCategory}
          progressByNovel={progressByNovel}
          onSelectNovel={showNovelDetail}
          onSelectCategory={setSelectedCategory}
          onOpenFilter={showFilter}
          onGoHome={showHome}
        />
      </motion.main>
    </AnimatePresence>
  );
}
