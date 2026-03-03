import dotenv from "dotenv";
import { decode } from "next-auth/jwt";
import type { JWTPayload } from "../global";
import { parseCookies } from "../utils/cookie";
import type { NextFunction, Request, Response } from "express";

dotenv.config();

export default async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const cookie = parseCookies(req);

    const session_token =
      cookie["next-auth.session-token"] ||
      cookie["__Secure-next-auth.session-token"]; // production

    console.log("reached auth");

    if (!session_token) {
       res.status(401).json({
        message: "Not authenticated",
      });
    }

    const payload = (await decode({
      token: session_token,
      secret: process.env.NEXTAUTH_SECRET!,
    })) as JWTPayload | null;

    if (!payload) {
       res.status(401).json({
        message: "Invalid token",
      });
      return
    }

    req.user = payload;

    next(); 
  } catch (error) {
    console.error("Auth error:", error);

    res.status(500).json({
      message: "Authentication error",
    });
  }
}
