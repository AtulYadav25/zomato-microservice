import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//Mongoose
import {connectMongoose} from './config/db.js'

//Routes
import userRoutes from './routes/user.routes.js'
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);


dotenv.config();
const app = express();

connectMongoose();

//Middlewars
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.use((req, res, next) => {
   console.log({
    originalUrl: req.originalUrl,
    url: req.url,
    baseUrl: req.baseUrl
  });
  next();
});

//Routes
app.use('/', userRoutes);

export default app;