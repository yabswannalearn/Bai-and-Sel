// server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import itemRoutes from "./routes/itemRoute"

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", itemRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend running 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});

