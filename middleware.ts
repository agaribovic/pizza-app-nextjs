import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname, method } = { pathname: req.nextUrl.pathname, method: req.method };

  const publicPaths = [
    "/api/pizza",        
    "/api/admin"         
  ];

  if (pathname === "/api/pizza" && method === "GET") return NextResponse.next();

  if (pathname === "/api/admin" && (method === "POST" || method === "DELETE")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: [
    "/api/pizza/:path*",  
    "/api/admin/:path*",  
  ],
};
