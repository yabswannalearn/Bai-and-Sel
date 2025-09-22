// server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import itemRoutes from "./routes/itemRoute"
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute"
import path from "path";

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true}));
app.use(express.json());
app.use(cookieParser())

app.use("/api", itemRoutes);
app.use("/auth", authRoute)
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req: Request, res: Response) => {
  res.send("Backend running 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});

