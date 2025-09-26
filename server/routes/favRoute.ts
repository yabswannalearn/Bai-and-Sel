import { Router } from "express"
import { authMiddleware } from "../middleware/auth";
import { getFavorites, toggleFavorite } from "../controller/favoriteController";

const router = Router();


router.get("/", authMiddleware, getFavorites)
router.post("/toggle", authMiddleware, toggleFavorite)


export default router;