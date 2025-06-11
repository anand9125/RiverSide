import { createRoom } from "../controller/roomController";
import { userAuthMiddleware } from "../Middlewares/userMiddleware";
import { Router } from 'express'

const router = Router()

router.post("/create-room",createRoom)




export const roomRouter = router
