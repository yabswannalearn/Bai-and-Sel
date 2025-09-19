import { Router } from "express"
import { getItems, postItems} from "../controller/itemsController"

const router = Router();

router.get("/items", getItems)
router.post("/items", postItems)

export default router;