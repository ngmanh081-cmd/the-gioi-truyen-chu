import cors from "cors";
import express from "express";
import morgan from "morgan";
import { config } from "./config.js";
import { errorHandler } from "./middleware/error-handler.js";
import { chapterRouter } from "./modules/chapters/chapter.routes.js";
import { novelRouter } from "./modules/novels/novel.routes.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/novels", novelRouter);
  app.use("/api/novels", chapterRouter);
  app.use(errorHandler);

  return app;
}
