import { Router } from 'express'
import { getUserDataer, userSignin, userSignup } from '../controller/userController'
import { userAuthMiddleware } from '../Middlewares/userMiddleware'

const router = Router()

router.post('/signup', userSignup) 

router.post('/signin', userSignin)

router.get("/getUserDetails",userAuthMiddleware,getUserDataer)


export const userRouter = router