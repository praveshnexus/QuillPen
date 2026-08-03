// eslint-disable-next-line @typescript-eslint/no-unused-vars -- required: without a top-level import/export, TS treats this .d.ts as an ambient global script instead of a module, which breaks the "declare module" augmentation below across every controller's Request type.
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
    };
  }
}