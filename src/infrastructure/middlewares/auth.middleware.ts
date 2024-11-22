import { Request, Response, NextFunction } from "express";
import { JWT } from "../../domain/services/jwt.service";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const verified = JWT.verifyToken(token);
  if (!verified) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
  //  req.user = verified
  next();
};
