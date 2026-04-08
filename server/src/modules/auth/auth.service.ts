import { prisma } from "@/config/prisma";
import { hashPassword, checkPassword } from "@/utils/hash";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt";
import crypto from "crypto";
import { sendEmail } from "@/utils/email";
import { OAuth2Client } from "google-auth-library";

// Refresh token cookie configuration
const REFRESH_COOKIE_SAME_SITE = "lax" as const;

const getGoogleClient = () =>
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

export const register = async (data: any) => {
  const { name, email, password } = data;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing)
    return { status: 409, data: { message: "Email already exists" } };

  const passwordHash = await hashPassword(password);

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      isEmailVerified: false,
      role: "BUYER",
      verificationToken: tokenHash,
      verificationExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${rawToken}`;

  await sendEmail(user.email, "Verify Email", `<a href="${verifyUrl}">Verify</a>`);

  return {
    status: 201,
    data: { message: "Registered successfully. Check email to verify." },
  };
};

export const registerSeller = async (data: any) => {
  const { name, email, password } = data;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing)
    return { status: 409, data: { message: "Email already exists" } };

  const passwordHash = await hashPassword(password);

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  // Create user as SELLER
  const { user } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        passwordHash,
        isEmailVerified: false,
        role: "SELLER",
        verificationToken: tokenHash,
        verificationExpires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await tx.sellerProfile.create({
      data: {
        userId: user.id,
        approvalStatus: "PENDING",
        profileCompletion: 0,
      },
    });

    return { user };
  });
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${rawToken}`;

  await sendEmail(user.email, "Verify Seller Account", `<a href="${verifyUrl}">Verify Seller Account</a>`);

  return {
    status: 201,
    data: { message: "Seller registered successfully. Please verify your email." },
  };
};

export const verifyEmail = async (token: string, res: any) => {
  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: tokenHash,
        verificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return { status: 400, data: { message: "Invalid or expired token" } };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    const accessToken = createAccessToken(
      user.id,
      user.role,
      user.tokenVersion
    );

    const refreshToken = createRefreshToken(
      user.id,
      user.tokenVersion
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: REFRESH_COOKIE_SAME_SITE,
      secure: process.env.NODE_ENV === "production",
    });

    return {
      status: 200,
      data: {
        message: "Email verified successfully",
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isEmailVerified: true,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    };
  } catch (error) {
    console.error("Email verification error:", error instanceof Error ? error.message : "Unknown error");
    return { status: 500, data: { message: "Internal server error" } };
  }
};

export const login = async (data: any, res: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return { status: 400, data: { message: "Invalid credentials" } };

  // Prevent password login for OAuth-only users
  if (!user.passwordHash) {
    return { status: 400, data: { message: "Invalid credentials" } };
  }

  const valid = await checkPassword(password, user.passwordHash);
  if (!valid)
    return { status: 400, data: { message: "Invalid credentials" } };
  if (!user.isEmailVerified)
    return { status: 403, data: { message: "Email not verified" } };

  const accessToken = createAccessToken(
    user.id,
    user.role,
    user.tokenVersion
  );

  const refreshToken = createRefreshToken(
    user.id,
    user.tokenVersion
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: REFRESH_COOKIE_SAME_SITE,
    secure: process.env.NODE_ENV === "production",
  });
  return {
    status: 200,
    data: {
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  };
};

export const refresh = async (req: any, res: any) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return { status: 401, data: { message: "Token missing" } };

  let payload: any;

  try {
    payload = verifyRefreshToken(token);
  } catch {
    return { status: 401, data: { message: "Invalid refresh token" } };
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user)
    return { status: 401, data: { message: "User not found" } };

  if (user.tokenVersion !== payload.tokenVersion)
    return { status: 401, data: { message: "Token revoked" } };

  const newAccess = createAccessToken(user.id, user.role, user.tokenVersion);
  const newRefresh = createRefreshToken(user.id, user.tokenVersion);

  res.cookie("refreshToken", newRefresh, {
    httpOnly: true,
    sameSite: REFRESH_COOKIE_SAME_SITE,
    secure: process.env.NODE_ENV === "production",
  });
  return {
    status: 200,
    data: {
      accessToken: newAccess,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  };
};

export const logout = async (res: any) => {
  res.clearCookie("refreshToken");
  return { status: 200, data: { message: "Logged out successfully" } };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return { status: 200, data: { message: "If exists, email sent" } };

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`;

  await sendEmail(user.email, "Reset Password", `<a href="${url}">Reset Password</a>`);

  return { status: 200, data: { message: "Reset link sent" } };
};

export const resetPassword = async (data: any) => {
  const { token, password } = data;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { gt: new Date() },
    },
  });

  if (!user)
    return { status: 400, data: { message: "Invalid token" } };

  const newHash = await hashPassword(password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      tokenVersion: { increment: 1 },
    },
  });

  return { status: 200, data: { message: "Password reset successful" } };
};

export const googleStart = async (res: any) => {
  const client = getGoogleClient();

  const url = client.generateAuthUrl({
    scope: ["openid", "email", "profile"],
  });

  // const url = client.generateAuthUrl({
  //   access_type: "offline",
  //   prompt: "consent",
  //   response_type: "code",
  //   scope: ["openid", "email", "profile"],
  //   redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
  // });

  res.redirect(url);
};

export const googleCallback = async (req: any, res: any) => {
  const code = req.query.code;
  const client = getGoogleClient();

  try {
    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email) {
      return { status: 400, data: { message: "Invalid Google token: email missing" } };
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: "",
          isEmailVerified: true,
          role: "BUYER",
        },
      });
    }

    const accessToken = createAccessToken(
      user.id,
      user.role,
      user.tokenVersion
    );

    const refreshToken = createRefreshToken(
      user.id,
      user.tokenVersion
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: REFRESH_COOKIE_SAME_SITE,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      status: 302,
      redirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth-callback?success=true`,
    };
  } catch (error) {
    console.error("Google OAuth error:", error);
    return { status: 500, data: { message: "Google authentication failed" } };
  }
};