import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, the embedded Studio (/admin), Next.js and Vercel
  // internals, and any path with a file extension (e.g. favicon.ico).
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
