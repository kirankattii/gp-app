import jwt from "jsonwebtoken";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}

const ACCESS_TOKEN_SECRET = getEnvVar("JWT_ACCESS_SECRET");
const REFRESH_TOKEN_SECRET = getEnvVar("JWT_REFRESH_SECRET");

export const createAccessToken = (id: string, role: string, tokenVersion: number) =>
  jwt.sign({ sub: id, role, tokenVersion }, ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_TOKEN_SECRET) as any;

export const createRefreshToken = (id: string, tokenVersion: number) =>
  jwt.sign({ sub: id, tokenVersion }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_TOKEN_SECRET) as any;