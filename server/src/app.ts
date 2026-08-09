import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import userBookmarksRoutes from "./routes/userBookmarksRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bookmarks", userBookmarksRoutes);
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});
app.use(errorHandler);

export default app;
