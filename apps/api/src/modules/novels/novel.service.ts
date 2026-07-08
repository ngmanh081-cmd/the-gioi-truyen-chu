import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12)
});

export type PaginationInput = z.input<typeof paginationSchema>;

export async function getLatestNovels(input: PaginationInput) {
  const { page, limit } = paginationSchema.parse(input);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.novel.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        author: true,
        createdAt: true,
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            chapters: true
          }
        }
      }
    }),
    prisma.novel.count()
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
