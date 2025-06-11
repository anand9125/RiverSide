import  {Request,Response} from 'express'
import {prismaClient} from "@repo/db/src";
import bcrypt from "bcrypt"
import { SignupSchema,SigninSchema } from '../types';
import { JWT_PASSWORD } from '../types/config';
import jwt from 'jsonwebtoken'

const client = prismaClient

export const userSignup = async(req:Request,res:Response) => {
    const parseData = SignupSchema.safeParse(req.body)
    if (!parseData.success) {
        res.status(401).json({
            message: parseData.error
        });
    return
    }
    const hashedPassword = await bcrypt.hash(parseData.data.password, 10)

    try{
        const existingUser = await client.user.findUnique({
            where:{
                email:parseData.data.email
            }
        })
        if (existingUser) {
            res.status(403).json({
              message: "User already exists"
            });
        return
        } 
        const user = await client.user.create({
            data:{
                name:parseData.data.username,
                email:parseData.data.email,
                password:hashedPassword,
                
            }
        })
        const token = jwt.sign({userId:user.id},JWT_PASSWORD)
        res.status(201).json({
          message: "User created successfully",
          user:{
            id:user.id,
            name:user.name,
            email:user.email
          },
          token
        })
    }
    catch(e)
    {
        res.status(500).json({
           message: "Internal server error"
        })
    }
}

export const userSignin = async(req:Request,res:Response) => {
    const parseData = SigninSchema.safeParse(req.body)
    if (!parseData.success) {
        res.status(401).json({
          message: parseData.error
        });
    return
    }
    try{
    const user = await client.user.findUnique({
        where:{
            email:parseData.data.email
        }
    })
    if (!user) {
        res.status(404).json({
          message: "User not found"
        });
        return
    } 
    const isPasswordCorrect = await bcrypt.compare(parseData.data.password,user.password)
    if (!isPasswordCorrect) {
        res.status(401).json({
        message: "Incorrect password"
        });
        return
    }
    const token = jwt.sign({ userId: user.id }, JWT_PASSWORD)
    res.status(200).json({
       message: "User logged in successfully",
       user:{
        id:user.id,
        name:user.name,
        email:user.email
      },
      token
    })
    }
    catch(e){
       res.status(500).json({
       message: "Internal server error"
      })
    }
}

export const getUserDataer = async(req:Request,res:Response)=>{
   console.log("you are able to hit me ",req.userId)
    const userId = req.userId;
   if(!userId){
      res.status(404).json({
        message: "UserId not found"
      });
   }
   try{
    const user = await client.user.findUnique({
        where:{
            id:userId
        }
    })
    res.status(200).json({
      message: "User data fetched successfully",
      user:{
        id:user.id,
        name:user.name,
        email:user.email
      }
    })
   }
   catch(e){
       res.status(500).json({
       message: "Internal server error"
      })
   }
}

