import express, { urlencoded } from 'express';
import dotenv from 'dotenv'
import connectDB from './db/db.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
dotenv.config({ path: './.env' })

const app = express()
const options = {
    origin: process.env.ORIGIN || '*',
    credentials: true,
}

app.use(morgan('dev'))
app.use(cors(options))
app.use(express.json())
app.use(cookieParser())
app.use(express.json({ limit: "16kb" }))
app.use(urlencoded({ extended: true })) // for understanding the url query params as well [extended] for understanding deep nested objects
app.use(express.static('public'))
const PORT = process.env.PORT;

// router import 
import userRouter from './routes/user.routes.js';

app.use('/api/v1/users', userRouter)

connectDB()


app.get('/', (req, res) => {
    res.send('<h2 style="text-align:center">Server connected successfully!</h2> ')
})

app.listen(PORT, () => {
    console.log('app is listening on port ' + PORT);
})