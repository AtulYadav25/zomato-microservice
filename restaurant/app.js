import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//Mongoose
import {connectMongoose} from './config/db.js'

//Routes
import restaurantRoutes from './routes/restaurant.routes.js'
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);


dotenv.config();
const app = express();

connectMongoose();

//Middlewars
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

//Routes
app.use('/', restaurantRoutes);

export default app;