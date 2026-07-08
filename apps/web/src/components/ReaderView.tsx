import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Minus, Moon, Plus, Sun, Type } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ReaderTheme = "light" | "dark" | "sepia";
type ReaderFont = "serif" | "sans" | "mono";

type ChapterLink = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type ReaderViewProps = {
  novelTitle: string;
  chapterTitle: string;
  content: string;
  pdfUrl?: string;
  initialProgress?: number;
  previousChapter?: ChapterLink | null;
  nextChapter?: ChapterLink | null;
  onBack?: () => void;
  onHome?: () => void;
  onProgressChange?: (progress: number) => void;
};

const MIN_FONT_SIZE = 16;
const MAX_FONT_SIZE = 28;

const fontOptions: Array<{ value: ReaderFont; label: string; family: string }> = [
  {
    value: "serif",
    label: "Serif",
    family: '"Times New Roman", "Noto Serif", Georgia, serif'
  },
  {
    value: "sans",
    label: "Sans",
    family: 'Arial, "Helvetica Neue", system-ui, sans-serif'
  },
  {
    value: "mono",
    label: "Mono",
    family: 'Consolas, "Courier New", monospace'
  }
];

function normalizeReaderText(value: string) {
  return value
    .normalize("NFC")
    .replace(/\s+([\u0300-\u036f])/g, "$1")
    .replace(/([\u0300-\u036f])\s+/g, "$1")
    .normalize("NFC");
}

const themeStyles: Record<
  ReaderTheme,
  {
    page: string;
    header: string;
    text: string;
    muted: string;
    control: string;
    activeControl: string;
    progress: string;
  }
> = {
  light: {
    page: "bg-[#f7f4ee]",
    header: "border-[#d8c6a5]/80 bg-[#fbfaf7]/92",
    text: "text-[#102238]",
    muted: "text-[#6f675c]",
    control:
      "border-[#d8c6a5] bg-white text-[#102238] shadow-[0_8px_18px_rgba(8,41,74,0.08)] hover:border-[#b98b3b] hover:bg-[#f3ead8]",
    activeControl: "border-[#b98b3b] bg-[#fff4d8] text-[#08294a] shadow-[0_8px_18px_rgba(8,41,74,0.1)]",
    progress: "bg-[#b98b3b]"
  },
  dark: {
    page: "bg-[#061b31]",
    header: "border-[#24415c]/80 bg-[#061b31]/92",
    text: "text-[#f4efe3]",
    muted: "text-[#b9c3cc]",
    control:
      "border-[#24415c] bg-[#0d2944] text-[#f4efe3] shadow-[0_10px_22px_rgba(0,0,0,0.24)] hover:border-[#d7b56a] hover:bg-[#143654]",
    activeControl: "border-[#d7b56a] bg-[#2c3a35] text-[#f5dfac] shadow-[0_10px_22px_rgba(0,0,0,0.28)]",
    progress: "bg-[#d7b56a]"
  },
  sepia: {
    page: "bg-[#efe3c9]",
    header: "border-[#c9ad76]/80 bg-[#efe3c9]/92",
    text: "text-[#2d2418]",
    muted: "text-[#6e5d3f]",
    control:
      "border-[#c9ad76] bg-[#fbefd3] text-[#2d2418] shadow-[0_8px_18px_rgba(84,58,21,0.1)] hover:bg-[#e8d6aa]",
    activeControl: "border-[#8f6324] bg-[#d7b56a] text-[#20170c] shadow-[0_8px_18px_rgba(84,58,21,0.14)]",
    progress: "bg-[#8f6324]"
  }
};

const themeOptions = [
  { value: "light" as const, icon: Sun, label: "Light mode" },
  { value: "dark" as const, icon: Moon, label: "Dark mode" },
  { value: "sepia" as const, icon: BookOpen, label: "Sepia mode" }
];

export function ReaderView({
  novelTitle,
  chapterTitle,
  content,
  pdfUrl,
  initialProgress = 0,
  previousChapter,
  nextChapter,
  onBack,
  onHome,
  onProgressChange
}: ReaderViewProps) {
  const [fontSize, setFontSize] = useState(18);
  const [readerFont, setReaderFont] = useState<ReaderFont>("serif");
  const [theme, setTheme] = useState<ReaderTheme>("light");
  const [progress, setProgress] = useState(initialProgress);
  const articleRef = useRef<HTMLElement | null>(null);
  const lastReportedProgressRef = useRef(Math.round(initialProgress));

  const styles = themeStyles[theme];

  const paragraphs = useMemo(
    () =>
      normalizeReaderText(content)
        .split(/\n{2,}/)
        .map((paragraph) => normalizeReaderText(paragraph.trim()))
        .filter(Boolean),
    [content]
  );

  const currentFont = fontOptions.find((font) => font.value === readerFont) ?? fontOptions[0];
  const articleSurface =
    theme === "dark"
      ? "rounded-lg border border-[#24415c] bg-[#09213a]/75 shadow-ink"
      : "paper-grain rounded-lg border border-[#d8c6a5]/75 shadow-paper-lg";
  const articleWidth = pdfUrl ? "max-w-5xl" : "max-w-3xl";

  const decreaseFontSize = useCallback(() => {
    setFontSize((current) => Math.max(MIN_FONT_SIZE, current - 2));
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((current) => Math.min(MAX_FONT_SIZE, current + 2));
  }, []);

  const updateProgress = useCallback(() => {
    const article = articleRef.current;

    if (!article) {
      return;
    }

    const viewportTop = window.scrollY;
    const articleTop = article.offsetTop;
    const readableHeight = article.scrollHeight - window.innerHeight;
    const current = viewportTop - articleTop;
    const nextProgress = readableHeight <= 0 ? 100 : (current / readableHeight) * 100;

    const clampedProgress = Math.min(100, Math.max(0, nextProgress));
    const roundedProgress = Math.round(clampedProgress);

    setProgress(clampedProgress);

    if (roundedProgress !== lastReportedProgressRef.current) {
      lastReportedProgressRef.current = roundedProgress;
      onProgressChange?.(clampedProgress);
    }
  }, [onProgressChange]);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const article = articleRef.current;

      if (article && initialProgress > 0) {
        const readableHeight = article.scrollHeight - window.innerHeight;
        const targetTop = article.offsetTop + readableHeight * (initialProgress / 100);
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }

      updateProgress();
    }, 0);

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.clearTimeout(restoreTimer);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [content, initialProgress, updateProgress]);

  const renderChapterLink = (link: ChapterLink, direction: "previous" | "next") => {
    const icon = direction === "previous" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />;
    const className = `inline-flex min-h-11 items-center gap-2 rounded-md border px-4 py-2 transition ${styles.control}`;

    if (link.onClick) {
      return (
        <button type="button" onClick={link.onClick} className={className}>
          {direction === "previous" ? icon : null}
          <span>{link.label}</span>
          {direction === "next" ? icon : null}
        </button>
      );
    }

    return (
      <a href={link.href ?? "#"} className={className}>
        {direction === "previous" ? icon : null}
        <span>{link.label}</span>
        {direction === "next" ? icon : null}
      </a>
    );
  };

  return (
    <div className={`min-h-screen ${styles.page} ${styles.text}`}>
      <div className={`shadow-paper sticky top-0 z-20 border-b backdrop-blur ${styles.header}`}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className={`mb-1 inline-flex items-center gap-1 text-sm ${styles.muted}`}
              >
                <ArrowLeft size={15} />
                Chi tiết truyện
              </button>
            ) : null}
            <button
              type="button"
              onClick={onHome}
              disabled={!onHome}
              className="block max-w-full rounded text-left transition hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-[#d7b56a]/70 disabled:cursor-default disabled:hover:opacity-100"
              aria-label="Về trang chủ"
            >
              <p className={`truncate text-sm ${styles.muted}`}>{novelTitle}</p>
              <h1 className="truncate text-lg font-semibold sm:text-xl">{chapterTitle}</h1>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decreaseFontSize}
              className={`grid h-10 w-10 place-items-center rounded-md border transition ${styles.control}`}
              aria-label="Decrease font size"
              title="Decrease font size"
            >
              <Minus size={18} />
            </button>
            <div className={`flex h-10 items-center gap-1 rounded-md border px-3 ${styles.control}`}>
              <Type size={17} />
              <span className="w-8 text-center text-sm tabular-nums">{fontSize}</span>
            </div>
            <button
              type="button"
              onClick={increaseFontSize}
              className={`grid h-10 w-10 place-items-center rounded-md border transition ${styles.control}`}
              aria-label="Increase font size"
              title="Increase font size"
            >
              <Plus size={18} />
            </button>
          </div>

          <label className={`flex h-10 items-center gap-2 rounded-md border px-3 ${styles.control}`}>
            <Type size={17} />
            <select
              value={readerFont}
              onChange={(event) => setReaderFont(event.target.value as ReaderFont)}
              className="bg-transparent text-sm font-medium outline-none"
              aria-label="Chọn font chữ"
              title="Chọn font chữ"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-2">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={`grid h-10 w-10 place-items-center rounded-md border transition ${
                  theme === value ? styles.activeControl : styles.control
                }`}
                aria-label={label}
                title={label}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
        <div className="h-1 bg-black/10">
          <motion.div className={`h-full ${styles.progress}`} animate={{ width: `${progress}%` }} />
        </div>
      </div>

      <article ref={articleRef} className={`mx-auto my-8 ${articleWidth} px-5 py-10 sm:px-8 sm:py-14 ${articleSurface}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${theme}-${fontSize}-${pdfUrl ?? "text"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="reader-content leading-[1.9]"
            style={{ fontSize, fontFamily: currentFont.family, letterSpacing: 0 }}
          >
            {paragraphs.length > 0 ? (
              <div className={pdfUrl ? "mx-auto mb-8 max-w-3xl" : undefined}>
                {paragraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 24)}-${index}`} className="mb-7">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {pdfUrl ? (
              <div className="overflow-hidden rounded-lg border border-[#d8c6a5] bg-white shadow-paper-lg">
                <iframe src={pdfUrl} title={chapterTitle} className="h-[78vh] min-h-[620px] w-full bg-white" />
                <div className="border-t border-[#e6dcc9] bg-[#fbfaf7] px-4 py-3 text-sm text-[#102238]">
                  Không xem được PDF?{" "}
                  <a className="font-semibold text-[#0d456f] underline" href={pdfUrl} target="_blank" rel="noreferrer">
                    Mở file trong tab mới
                  </a>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <nav className="mt-12 flex items-center justify-between gap-3">
          {previousChapter ? renderChapterLink(previousChapter, "previous") : <span />}
          {nextChapter ? renderChapterLink(nextChapter, "next") : <span />}
        </nav>
      </article>
    </div>
  );
}
