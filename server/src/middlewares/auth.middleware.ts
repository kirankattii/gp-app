import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  let source: string = "none";

  // Diagnostic Logging
  console.log(`[AuthDebug] ${req.method} ${req.originalUrl}`);
  console.log(`[AuthDebug] Headers keys: ${Object.keys(req.headers).join(", ")}`);
  console.log(`[AuthDebug] Cookie keys: ${req.cookies ? Object.keys(req.cookies).join(", ") : "none"}`);

  // 1. Try to get token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    source = "header";
  }

  // 2. Fallback to gp_token or accessToken cookie
  if (!token) {
    if (req.cookies?.gp_token) {
      token = req.cookies.gp_token;
      source = "cookie (gp_token)";
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
      source = "cookie (accessToken)";
    }
  }

  console.log(`[AuthDebug] Token source: ${source}, Token present: ${!!token}`);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    );

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof (decoded as any).sub !== "string" ||
      typeof (decoded as any).role !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const payload = decoded as { sub: string; role: string };

    req.user = {
      id: payload.sub,
      role: payload.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};