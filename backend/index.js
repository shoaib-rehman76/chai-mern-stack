import express from 'express';
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })
const app = express()

const PORT = process.env.PORT;


app.get('/', (req, res) => {
    res.send('<h2 style="text-align:center">Server connected successfully!</h2> ')
})

app.listen(PORT, () => {
    console.log('app is listening on port ' + PORT);
})