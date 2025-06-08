import { Request,Response } from "express";
import { CreateRoomSchema } from "../types";
import {prismaClient  } from "@repo/db/src";

export const createRoom = async(req:Request,res:Response) => {
    const parseData = CreateRoomSchema.safeParse(req.body)
    if (!parseData.success) {
        res.status(401).json({
            message: parseData.error
        });
    return
    }
    try{
        const room = await prismaClient.room.create({
            data:{
                title:parseData.data.title,
                scheduledFor:parseData.data.scheduledFor
            }
        })
        res.status(201).json({
            message: "Room created successfully",
            room:{
                id:room.id,
                title:room.title,
                scheduledFor:room.scheduledFor
            }
        })
    }
    catch(e)
    {
        res.status(500).json({
           message: "Internal server error"
        })
    }
}