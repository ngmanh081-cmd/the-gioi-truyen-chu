import { BookOpen, Feather, Globe2, Sparkles } from "lucide-react";

type BrandMarkProps = {
  compact?: boolean;
  inverted?: boolean;
};

export function BrandMark({ compact = false, inverted = false }: BrandMarkProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#d8b35f] bg-[#050505] text-[#f8e7ae] shadow-[0_0_24px_rgba(216,179,95,0.28)] ${
          compact ? "h-11 w-11" : "h-14 w-14"
        }`}
      >
        <div className="absolute inset-1 rounded-full border border-[#f8e7ae]/25" />
        <Globe2 className="absolute top-1 text-[#c89537]/70" size={compact ? 21 : 26} strokeWidth={1.7} />
        <BookOpen className="absolute bottom-1 text-[#fff3c4]" size={compact ? 24 : 30} strokeWidth={2.1} />
        <Feather className="absolute -right-1 bottom-2 rotate-12 text-[#d8b35f]" size={compact ? 18 : 22} />
        <Sparkles className="absolute left-2 top-2 text-[#fff3c4]" size={compact ? 9 : 11} fill="currentColor" />
      </div>
      <div className="min-w-0">
        <p
          className={`font-serif font-bold leading-none ${
            compact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
          } ${inverted ? "text-[#fff3c4]" : "text-[#14110b]"}`}
        >
          Thế Giới
        </p>
        <p
          className={`mt-0.5 truncate text-[11px] font-semibold uppercase tracking-[0.2em] ${
            inverted ? "text-[#d8b35f]" : "text-[#9a6b20]"
          }`}
        >
          Truyện Chữ
        </p>
      </div>
    </div>
  );
}
