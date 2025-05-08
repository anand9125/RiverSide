import { Router } from 'express'

const router = Router()

router.get('/signup', userSignup)  

export const userRouter = router