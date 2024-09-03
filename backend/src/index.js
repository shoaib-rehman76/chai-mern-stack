import express, { urlencoded } from 'express';
import dotenv from 'dotenv'
import connectDB from './db/db.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'

const options = {
    origin: process.env.ORIGIN || '*',
    credentials: true,
}

dotenv.config({ path: './.env' })

app.use(cors(options))
app.use(cookieParser())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true })) // for understanding the url query params as well [extended] for understanding deep nested objects
app.use(express.static('public'))

const app = express()
const PORT = process.env.PORT;


connectDB()


app.get('/', (req, res) => {
    res.send('<h2 style="text-align:center">Server connected successfully!</h2> ')
})

app.listen(PORT, () => {
    console.log('app is listening on port ' + PORT);
})