import app from "./app.js";
import http from 'http'
import { connectProducer, disconnectProducer } from "../kafka/producer.js";

const PORT = process.env.PORT

const server = http.createServer(app);
connectProducer();

server.listen(PORT,()=>{
    console.log(`Payment Service Started on port: ${PORT}`);
    console.log(`http://localhost:${PORT}`)
})

// graceful shutdown on SIGTERM (Docker sends this when container stops)
const shutdown = async () => {
  console.log('[PaymentService] Shutting down...');
  await disconnectProducer();
  process.exit(0);
};

process.on('SIGINT', shutdown);  // Ctrl+C in local dev