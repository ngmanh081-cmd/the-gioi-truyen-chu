import { Router } from "express";
import { getChapterDetail } from "./chapter.service.js";

export const chapterRouter = Router();

chapterRouter.get("/:novelId/chapters/:order", async (request, response, next) => {
  try {
    const result = await getChapterDetail(request.params);
    response.json(result);
  } catch (error) {
    next(error);
  }
});
