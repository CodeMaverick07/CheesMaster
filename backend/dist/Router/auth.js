"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controller/auth.controller");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.RegisterControlloer);
router.post("/login", auth_controller_1.LoginControlloer);
router.post("/logout", auth_middleware_1.verifyJWT, auth_controller_1.LogoutController);
router.post("/refresh-token", auth_controller_1.RefreshAccessTokenController);
router.post("/validate", auth_controller_1.validateToken);
router.post("/get-data", auth_controller_1.GetData);
exports.default = router;
