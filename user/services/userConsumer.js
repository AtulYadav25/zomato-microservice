import { createConsumer } from '../../kafka/consumer.js';
import { TOPICS } from '../../kafka/topics.js';
import { addToUserBuffer } from './userBulkUpdater.js';
// import { disconnectProducer } from '../../kafka/producer.js';

const disconnectConsumer = await createConsumer('user-service-group', TOPICS.PAYMENT_SUCCESS, (event) => {
  console.log(`[UserService] Received event for userId: ${event.userId}`);
  addToUserBuffer(event);
});


// graceful shutdown on SIGTERM (Docker sends this when container stops)
const shutdown = async () => {
  console.log('[User] Shutting down...');
  await disconnectConsumer();
  // await disconnectProducer();
  process.exit(0);
};

process.on('SIGINT', shutdown);  