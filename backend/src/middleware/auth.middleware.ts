import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "../db/index";

interface CustomRequest extends Request {
  user?: { id: string; name?: string; email?: string };
}

export const verifyJWT = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Unauthorized request");
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "secret";
    const decodedToken: JwtPayload = jwt.verify(
      token,
      accessTokenSecret
    ) as JwtPayload;

    if (!decodedToken.id) {
      throw new Error("Invalid token");
    }

    const newUser = await db.user.findUnique({
      where: { id: decodedToken.id },
      select: { id: true, name: true, email: true },
    });

    if (!newUser) {
      throw new Error("Unauthorized request");
    }

    req.user = newUser;
    next();
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
