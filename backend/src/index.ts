import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./Router/auth.route";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
const port = process.env.PORT;
const allowedHosts = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedHosts.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to ChessAPI");
});

app.use("/auth", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
