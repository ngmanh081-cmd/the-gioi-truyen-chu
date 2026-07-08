export type Chapter = {
  order: number;
  title: string;
  content: string;
  pdfUrl?: string;
};

export type Novel = {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  categories: string[];
  status: "Đang ra" | "Hoàn thành";
  rating: number;
  views: string;
  chapters: Chapter[];
};

export type ReadingProgress = {
  novelId: string;
  chapterOrder: number;
  progress: number;
  updatedAt: string;
};
