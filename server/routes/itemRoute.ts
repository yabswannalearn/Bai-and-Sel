import { Router } from "express"
import { getItems, postItems} from "../controller/itemsController"
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/items", getItems)
router.post("/items", authMiddleware, postItems)

export default router;