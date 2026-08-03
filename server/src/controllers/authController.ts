import { Response } from "express";
import { Request } from "express-serve-static-core";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import asyncHandler from "../utils/asyncHandler";
import { signupSchema, loginSchema } from "../validators/authValidator";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const validation = signupSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      errors: validation.error.issues,
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "User created successfully",
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      errors: validation.error.issues,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = generateToken(user.id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "Login successful",
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token");

  res.json({
    message: "Logged out successfully",
  });
});

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user!.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
  });

  res.json(user);
});
