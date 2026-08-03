import { Response, NextFunction } from "express";
import { Request } from "express-serve-static-core";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  console.log("Cookies:", req.cookies);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

 try {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as {
    userId: string;
  };

  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  console.log("TOKEN:", token);
  console.log("TOKEN RECEIVED:", token);

  req.user = decoded;

  next();
} catch (error) {
  console.log("JWT ERROR:", error);

};
}

export default authMiddleware;
