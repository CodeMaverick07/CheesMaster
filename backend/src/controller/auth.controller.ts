import { db } from "../db/index";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as z from "zod";
import { Request, Response } from "express";

interface CustomRequest extends Request {
  user?: { id: string; name?: string; email?: string };
}

const CreateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

interface CustomPayload {
  id: string;
  exp?: number;
}
export const generateAccessAndRefreshTokens = async (
  id: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, refreshToken: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    let refreshToken = user.refreshToken;

    if (!refreshToken || isRefreshTokenExpired(refreshToken)) {
      refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET! as jwt.Secret,
        { expiresIn: 60 * 60 * 24 }
      );

      await db.user.update({
        where: { id },
        data: { refreshToken },
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.ACCESS_TOKEN_SECRET! as jwt.Secret,
      { expiresIn: 60 * 60 }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generating tokens:", error);
    throw new Error("Error in generating tokens");
  }
};

const isRefreshTokenExpired = (token: string): boolean => {
  const decoded = jwt.decode(token) as CustomPayload;

  if (!decoded || !decoded.exp) {
    return true;
  }
  const currentTime = Math.floor(Date.now() / 1000);

  return currentTime > decoded.exp;
};

export const RegisterControlloer = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { name, email, password } = req.body;
    const data = await CreateUserSchema.parse({ name, email, password });
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email: data.email }, { name: data.name }],
      },
    });

    if (existingUser) {
      throw new Error("Email or username already taken");
    }

    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      newUser.id
    );
    const loggedInUser = await db.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
      select: { id: true, name: true, email: true },
    });
    const options = {
      httpOnly: true,
      secure: true,
      samesite: "none",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ success: true, user: loggedInUser, accessToken });
  } catch (error: any) {
    console.error("Error in user registration:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const LoginControlloer = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.user.findFirst({
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user.id
    );
    const loggedInUser = await db.user.update({
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
  } catch (error: any) {
    console.error("Error in user login:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const LogoutController = async (req: CustomRequest, res: Response) => {
  try {
    await db.user.update({
      where: { id: req?.user?.id },
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
  } catch (error: any) {
    console.error("Error in user logout:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const RefreshAccessTokenController = async (
  req: Request,
  res: Response
) => {
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

    const decodedToken = jwt.decode(incomingRefreshToken) as CustomPayload;

    const user = await db.user.findUnique({
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user.id
    );

    const loggedInUser = await db.user.update({
      where: { id: user.id },
      data: { refreshToken },
      select: { id: true, name: true, email: true },
    });

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ success: true, user: loggedInUser, accessToken });
  } catch (error: any) {
    console.error("Error in refreshing access token:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const validateToken = async (req: CustomRequest, res: Response) => {
  try {
    const incomingRefreshToken = await req.cookies.refreshToken;
    const incomingAccessToken = await req.cookies.accessToken;

    if (!incomingRefreshToken || !incomingAccessToken) {
      return res.status(400).json({
        success: false,
        message: "No refresh token or access token provided",
      });
    }

    if (isRefreshTokenExpired(incomingRefreshToken)) {
      return RefreshAccessTokenController(req, res);
    }

    const decodedAccessToken = jwt.decode(incomingAccessToken) as CustomPayload;
    const decodedRefreshToken = jwt.decode(
      incomingRefreshToken
    ) as CustomPayload;

    const user = await db.user.findUnique({
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
  } catch (error: any) {
    console.error("Error in validating token:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
