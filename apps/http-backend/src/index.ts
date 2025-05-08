import express from 'express'
import { userRouter } from './routes/user'


const app = express()

app.use(express.json())

app.use("/api/v1/user",userRouter)




app.listen(3002, () => {
  console.log('Listening on port 3000')
})