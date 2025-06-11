import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_PASSWORD } from "../types/config";
dotenv.config();



export function userAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization;
  console.log("i am hittable")
 
  if (!token) {
    res.status(403).json({ message: "Token required" });
    return; 
  }
  try {
    console.log(process
      .env.JWT_SECRET)
    console.log(token)
    const payload = jwt.verify(token, JWT_PASSWORD ) as { userId: string }; 
    console.log(payload)
   
    req.userId = payload.userId
    next(); 
  } 
  catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }

}