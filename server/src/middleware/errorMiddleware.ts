import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // Express only recognizes a middleware as an error handler when it has
  // exactly 4 parameters - `next` must stay in the signature even though
  // it's unused here, so it's prefixed with `_` instead of removed.
  _next: NextFunction
) => {
  console.error(err);

  if (res.headersSent) {
    return;
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};