"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_route_1 = __importDefault(require("./Router/auth.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT;
const allowedHosts = process.env.ALLOWED_HOSTS
    ? process.env.ALLOWED_HOSTS.split(",")
    : [];
app.use((0, cors_1.default)({
    origin: allowedHosts,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("welcome to ChessAPI");
});
app.use("/auth", auth_route_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
