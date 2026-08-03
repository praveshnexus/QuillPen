import { Request, Response, NextFunction } from "express";

const asyncHandler =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- see note below
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// A stricter generic signature was tried here but cascades into ~90 type
// errors across every controller: this codebase imports `Request` from both
// "express" and "express-serve-static-core" inconsistently (controllers use
// the latter, this file and errorMiddleware use the former), and they are
// not structurally identical to TypeScript. Fixing that properly means
// auditing and unifying imports across every controller/middleware file -
// real, non-trivial risk to touch without dedicated testing. Left loosely
// typed here deliberately, flagged rather than silently patched over.
export default asyncHandler;