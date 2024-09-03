import express from 'express';
import dotenv from 'dotenv'
import connectDB from './db/db.js';

dotenv.config({ path: './.env' })

const app = express()
const PORT = process.env.PORT;

connectDB()


app.get('/', (req, res) => {
    res.send('<h2 style="text-align:center">Server connected successfully!</h2> ')
})

app.listen(PORT, () => {
    console.log('app is listening on port ' + PORT);
})