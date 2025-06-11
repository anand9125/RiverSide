import { Request,Response } from "express";
import { CreateRoomSchema } from "../types";
import {prismaClient  } from "@repo/db/src";

export const createRoom = async(req:Request,res:Response) => {
    console.log("you are able to hit me ",req.body)
    const parseData = CreateRoomSchema.safeParse(req.body)
    console.log(parseData)
    if (!parseData.success) {
        res.status(401).json({
            message: parseData.error
        });
    return
    }
    try{
        console.log(parseData.data)
       const room = await prismaClient.room.create({
        data: {
            title: parseData.data.title,
            scheduledFor: parseData.data.scheduledFor,
            hostUser: {
            connect: {
                id: parseData.data.hostUserId,
            },
            },
        },
        });

        console.log(room)
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