import express from 'express';
import dotenv from 'dotenv';
import { PORT } from './utils/constants.js';
dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('HELLO WORLD')
});

app.listen(PORT, ()=> console.log('server started'));