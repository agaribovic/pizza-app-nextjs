import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_MAX_AGE = 8;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: COOKIE_MAX_AGE * 3600,
  path: "/",
  sameSite: (process.env.NODE_ENV === "production" ? "strict" : "lax") as
    | "strict"
    | "lax",
};

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

interface AdminPayload {
  email: string;
  role: "admin";
  expiresIn: number;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return unauthorized();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;

    return NextResponse.json({
      email: payload.email,
      role: payload.role,
      expiresIn: payload.expiresIn,
    });
  } catch {
    return unauthorized();
  }
}

export async function POST(req: NextRequest) {
  const expiresAt = Date.now() + COOKIE_MAX_AGE * 60 * 60 * 1000;
  const expiresIn = expiresAt - Date.now();

  try {
    const { email, password } = await req.json();

    if (email !== process.env.ADMIN_EMAIL) return unauthorized();

    const isValid = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH!
    );
    if (!isValid) return unauthorized();

    const token = jwt.sign(
      { email, role: "admin", expiresIn: expiresIn },
      process.env.JWT_SECRET!,
      {
        expiresIn: `${COOKIE_MAX_AGE}h`,
      }
    );

    const response = NextResponse.json({
      message: "Login successful",
      email,
      role: "admin",
      expiresIn: expiresIn,
    });

    response.cookies.set("token", token, cookieOptions);
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });

    response.cookies.delete({
      name: "token",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
