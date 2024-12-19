import { Router, Request } from "express";
import { verifyJWT } from "../middleware/auth.middleware";

import {
  LoginControlloer,
  LogoutController,
  RegisterControlloer,
  validateToken,
} from "../controller/auth.controller";
const router = Router();

router.post("/register", RegisterControlloer);

router.post("/login", LoginControlloer);

router.post("/logout", verifyJWT, LogoutController);

router.post("/validate", validateToken);

export default router;
