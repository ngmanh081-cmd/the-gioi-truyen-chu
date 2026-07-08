import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../errors/http-error.js";
import { getRedisClient } from "../../lib/redis.js";

const chapterParamsSchema = z.object({
  novelId: z.string().min(1),
  order: z.coerce.number().int().min(1)
});

const CHAPTER_CACHE_TTL_SECONDS = 60 * 15;

type ChapterParamsInput = {
  novelId: string;
  order: unknown;
};

type ChapterDetail = {
  id: string;
  title: string;
  content: string;
  order: number;
  novel: {
    id: string;
    title: string;
    author: string;
  };
  previousChapter: {
    order: number;
    title: string;
  } | null;
  nextChapter: {
    order: number;
    title: string;
  } | null;
};

async function readCachedChapter(cacheKey: string) {
  try {
    const client = await getRedisClient();
    const cached = await client.get(cacheKey);
    return cached ? (JSON.parse(cached) as ChapterDetail) : null;
  } catch (error) {
    console.warn("Cannot read chapter cache:", error);
    return null;
  }
}

async function writeCachedChapter(cacheKey: string, chapter: ChapterDetail) {
  try {
    const client = await getRedisClient();
    await client.set(cacheKey, JSON.stringify(chapter), "EX", CHAPTER_CACHE_TTL_SECONDS);
  } catch (error) {
    console.warn("Cannot write chapter cache:", error);
  }
}

export async function getChapterDetail(input: ChapterParamsInput) {
  const { novelId, order } = chapterParamsSchema.parse(input);
  const cacheKey = `chapter:${novelId}:${order}`;
  const cachedChapter = await readCachedChapter(cacheKey);

  if (cachedChapter) {
    return cachedChapter;
  }

  const chapter = await prisma.chapter.findUnique({
    where: {
      novelId_order: {
        novelId,
        order
      }
    },
    select: {
      id: true,
      title: true,
      content: true,
      order: true,
      novel: {
        select: {
          id: true,
          title: true,
          author: true
        }
      }
    }
  });

  if (!chapter) {
    throw new HttpError(404, "Khong tim thay chuong truyen.", "CHAPTER_NOT_FOUND");
  }

  const [previousChapter, nextChapter] = await Promise.all([
    prisma.chapter.findFirst({
      where: {
        novelId,
        order: {
          lt: order
        }
      },
      orderBy: {
        order: "desc"
      },
      select: {
        order: true,
        title: true
      }
    }),
    prisma.chapter.findFirst({
      where: {
        novelId,
        order: {
          gt: order
        }
      },
      orderBy: {
        order: "asc"
      },
      select: {
        order: true,
        title: true
      }
    })
  ]);

  const result: ChapterDetail = {
    ...chapter,
    previousChapter,
    nextChapter
  };

  await writeCachedChapter(cacheKey, result);
  return result;
}
