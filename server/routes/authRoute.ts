import { Router } from "express"
import { authMiddleware } from "../middleware/auth";
import { register, login, logout, contactUs, authChecker } from "../controller/authController"

const router = Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/contact", contactUs)

router.get("/me", authMiddleware, (req: any, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  res.json({ id: req.user.id, email: req.user.email, name: req.user.name });
});

router.get("/isLoggedIn", authChecker);


export default router