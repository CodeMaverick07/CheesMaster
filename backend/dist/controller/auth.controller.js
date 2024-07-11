"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.RefreshAccessTokenController = exports.LogoutController = exports.LoginControlloer = exports.RegisterControlloer = exports.generateAccessAndRefreshTokens = void 0;
const index_1 = require("../db/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const z = __importStar(require("zod"));
const CreateUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
});
const generateAccessAndRefreshTokens = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.db.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, refreshToken: true },
        });
        if (!user) {
            throw new Error("User not found");
        }
        let refreshToken = user.refreshToken;
        if (!refreshToken || isRefreshTokenExpired(refreshToken)) {
            refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 60 * 60 * 24 });
            yield index_1.db.user.update({
                where: { id },
                data: { refreshToken },
            });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 * 60 });
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.error("Error in generating tokens:", error);
        throw new Error("Error in generating tokens");
    }
});
exports.generateAccessAndRefreshTokens = generateAccessAndRefreshTokens;
const isRefreshTokenExpired = (token) => {
    const decoded = jsonwebtoken_1.default.decode(token);
    if (!decoded || !decoded.exp) {
        return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > decoded.exp;
};
const RegisterControlloer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const data = CreateUserSchema.parse({ name, email, password });
        const existingUser = yield index_1.db.user.findFirst({
            where: {
                OR: [{ email: data.email }, { name: data.name }],
            },
        });
        if (existingUser) {
            throw new Error("Email or username already taken");
        }
        const newUser = yield index_1.db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
            },
        });
        const { accessToken, refreshToken } = yield (0, exports.generateAccessAndRefreshTokens)(newUser.id);
        const loggedInUser = yield index_1.db.user.update({
            where: { id: newUser.id },
            data: { refreshToken },
            select: { id: true, name: true, email: true },
        });
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ success: true, user: loggedInUser, accessToken });
    }
    catch (error) {
        console.error("Error in user registration:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.RegisterControlloer = RegisterControlloer;
const LoginControlloer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield index_1.db.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.password !== password) {
            throw new Error("Invalid password");
        }
        const { accessToken, refreshToken } = yield (0, exports.generateAccessAndRefreshTokens)(user.id);
        const loggedInUser = yield index_1.db.user.update({
            where: { id: user.id },
            data: { refreshToken },
            select: { id: true, name: true, email: true },
        });
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ success: true, user: loggedInUser, accessToken });
    }
    catch (error) {
        console.error("Error in user login:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.LoginControlloer = LoginControlloer;
const LogoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield index_1.db.user.update({
            where: { id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id },
            data: { refreshToken: null },
        });
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Error in user logout:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.LogoutController = LogoutController;
const RefreshAccessTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomingRefreshToken = req.cookies.refreshToken;
        if (!incomingRefreshToken) {
            return res
                .status(400)
                .json({ success: false, message: "No refresh token provided" });
        }
        if (isRefreshTokenExpired(incomingRefreshToken)) {
            return res
                .status(400)
                .json({ success: false, message: "Refresh token expired" });
        }
        const decodedToken = jsonwebtoken_1.default.decode(incomingRefreshToken);
        const user = yield index_1.db.user.findUnique({
            where: { id: decodedToken.id },
            select: { id: true, name: true, email: true, refreshToken: true },
        });
        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid refresh token" });
        }
        const options = {
            httpOnly: true,
            secure: true,
        };
        const { accessToken, refreshToken } = yield (0, exports.generateAccessAndRefreshTokens)(user.id);
        const loggedInUser = yield index_1.db.user.update({
            where: { id: user.id },
            data: { refreshToken },
            select: { id: true, name: true, email: true },
        });
        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ success: true, user: loggedInUser, accessToken });
    }
    catch (error) {
        console.error("Error in refreshing access token:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.RefreshAccessTokenController = RefreshAccessTokenController;
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomingRefreshToken = yield req.cookies.refreshToken;
        const incomingAccessToken = yield req.cookies.accessToken;
        if (!incomingRefreshToken || !incomingAccessToken) {
            return res.status(400).json({
                success: false,
                message: "No refresh token or access token provided",
            });
        }
        if (isRefreshTokenExpired(incomingRefreshToken)) {
            return (0, exports.RefreshAccessTokenController)(req, res);
        }
        const decodedAccessToken = jsonwebtoken_1.default.decode(incomingAccessToken);
        const decodedRefreshToken = jsonwebtoken_1.default.decode(incomingRefreshToken);
        const user = yield index_1.db.user.findUnique({
            where: { id: decodedRefreshToken.id },
            select: { id: true, name: true, email: true, refreshToken: true },
        });
        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid refresh token" });
        }
        req.user = decodedAccessToken;
        return res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error("Error in validating token:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.validateToken = validateToken;
