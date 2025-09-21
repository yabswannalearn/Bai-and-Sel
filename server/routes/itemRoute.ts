import { Router } from "express"
import { getItems, postItems, deleteItems, updateItems} from "../controller/itemsController"
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/items", getItems)
router.post("/items", authMiddleware, postItems)
router.delete("/items/:id", authMiddleware, deleteItems)
router.patch("/items/:id", authMiddleware, updateItems)

export default router;