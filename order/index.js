import app from "./app.js";
import http from 'http';
import { connectProducer } from "../kafka/producer.js";
import './services/orderConsumer.js'

const PORT = process.env.PORT

const server = http.createServer(app);
await connectProducer();

server.listen(PORT,()=>{
    console.log(`Order Service Started on port: ${PORT}`);
    console.log(`http://localhost:${PORT}`)
})