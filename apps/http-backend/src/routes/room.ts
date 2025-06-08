import { createRoom } from "../controller/roomController";
import { userAuthMiddleware } from "../Middlewares/userMiddleware";
import { userRouter } from "./user";

const router = userRouter()

router.post("/create-room",userAuthMiddleware,createRoom)


export const roomRouter = router