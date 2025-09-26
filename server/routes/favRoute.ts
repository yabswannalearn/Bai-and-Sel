import { Router } from "express"
import { authMiddleware } from "../middleware/auth";
import { deleteFavorites, getFavorites, postFavorites } from "../controller/favoriteController";

const router = Router();


router.get("/", authMiddleware, getFavorites)
router.post("/", authMiddleware, postFavorites)
router.delete('/', authMiddleware, deleteFavorites)

export default router;