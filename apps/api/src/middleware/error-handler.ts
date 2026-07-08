import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { HttpError } from "../errors/http-error.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message,
      code: error.code
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    response.status(503).json({
      message: "Khong the ket noi database. Vui long thu lai sau.",
      code: "DATABASE_CONNECTION_ERROR"
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Du lieu dau vao khong hop le.",
      code: "VALIDATION_ERROR",
      issues: error.flatten()
    });
    return;
  }

  response.status(500).json({
    message: "Da co loi xay ra tren server.",
    code: "INTERNAL_SERVER_ERROR"
  });
};
