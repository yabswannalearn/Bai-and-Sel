import { Router } from "express"
import { authMiddleware } from "../middleware/auth";
import { getFavorites, getFavoriteStatus, toggleFavorite } from "../controller/favoriteController";

const router = Router();


router.get("/", authMiddleware, getFavorites)
router.post("/toggle", authMiddleware, toggleFavorite)
router.get("/status/:itemId", authMiddleware, getFavoriteStatus)


export default router;