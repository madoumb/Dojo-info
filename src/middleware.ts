import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware minimal — la session est gérée côté client via localStorage
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
