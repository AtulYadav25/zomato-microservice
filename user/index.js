import app from "./app.js";
import http from 'http'
import './services/userConsumer.js'

const PORT = process.env.PORT

const server = http.createServer(app);

server.listen(PORT,()=>{
    console.log(`User Service Started on port: ${PORT}`);
    console.log(`http://localhost:${PORT}`)
})