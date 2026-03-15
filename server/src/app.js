import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import routes from './routes/url.routes.js';
import { errorHandler } from './middlewares/errorHandlers.js';

dotenv.config();

const app = express();
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests, try again later.",
});

app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}));
app.use(mongoSanitize());
app.use(xss());

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
};

if(process.env.NODE_ENV === "production"){
    app.use(compression());
};

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", apiLimiter);
app.use('/api', routes);

app.use(errorHandler);

export default app;