import { createConsumer } from '../../kafka/consumer.js';
import { TOPICS } from '../../kafka/topics.js';
import { addToOrderBuffer } from './orderBulkUpdater.js';
import { disconnectProducer } from '../../kafka/producer.js';

const disconnectConsumer = await  createConsumer('order-service-group', TOPICS.PAYMENT_SUCCESS, (event) => {
  console.log(`[OrderService] Received event for orderId: ${event.orderId}`);
  addToOrderBuffer(event); // just buffer it
});


// graceful shutdown on SIGTERM (Docker sends this when container stops)
const shutdown = async () => {
  console.log('[OrderService] Shutting down...');
  await disconnectConsumer();
  await disconnectProducer();
  process.exit(0);
};

process.on('SIGINT', shutdown);