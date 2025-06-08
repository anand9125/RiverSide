import express from 'express'
import { userRouter } from './routes/user'
import { roomRouter } from './routes/room';


const app = express()

app.use(express.json())
const cors = require('cors');
app.use(cors());

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/v1/user",userRouter)

app.use("api/v1/user",roomRouter)




app.listen(3002, () => {
  console.log('Listening on port 3000')
})