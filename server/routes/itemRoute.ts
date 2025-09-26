import { Router } from "express"
import { getItems, postItems, deleteItems, updateItems, getItemById} from "../controller/itemsController"
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/items", getItems)
router.get("/items/:id", authMiddleware, getItemById)
router.post("/items", authMiddleware, upload.single("image"), postItems);
router.delete("/items/:id", authMiddleware, deleteItems)
router.patch("/items/:id", authMiddleware, upload.single("image"), updateItems)

export default router;