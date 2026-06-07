import type { RequestHandler } from "express";
import { getAuth } from "@clerk/express";

/**
 * Gate for authenticated routes. The web client sends Clerk's session cookie
 * automatically with same-origin requests, so no bearer token handling is
 * needed here. Returns 401 when there is no signed-in user.
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as typeof req & { userId?: string }).userId = userId;
  next();
};
