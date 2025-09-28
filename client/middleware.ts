// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("accessToken")?.value;
//   console.log(token)

//   // If no token → redirect to login
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// // Apply only to /items/favorites
// export const config = {
//   matcher: ["/", "/items/favorites/:path*"],
// };
