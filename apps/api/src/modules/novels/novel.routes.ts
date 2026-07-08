import { Router } from "express";
import { getLatestNovels } from "./novel.service.js";

export const novelRouter = Router();

novelRouter.get("/latest", async (request, response, next) => {
  try {
    const result = await getLatestNovels(request.query);
    response.json(result);
  } catch (error) {
    next(error);
  }
});
