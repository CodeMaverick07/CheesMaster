"use strict";
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
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../db/index");
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.accessToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        if (!token) {
            throw new Error("Unauthorized request");
        }
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "secret";
        const decodedToken = jsonwebtoken_1.default.verify(token, accessTokenSecret);
        if (!decodedToken.id) {
            throw new Error("Invalid token");
        }
        const newUser = yield index_1.db.user.findUnique({
            where: { id: decodedToken.id },
            select: { id: true, name: true, email: true },
        });
        if (!newUser) {
            throw new Error("Unauthorized request");
        }
        req.user = newUser;
        next();
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.verifyJWT = verifyJWT;
