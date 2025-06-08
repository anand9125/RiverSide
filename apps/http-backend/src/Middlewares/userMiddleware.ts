import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



export function userAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization;
 
  if (!token) {
    res.status(401).json({ message: "Token required" });
    return; 
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as { userId: string }; 
   req.userId = payload.userId
    next(); 
  } 
  catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }

}