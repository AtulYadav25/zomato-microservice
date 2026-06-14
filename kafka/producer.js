import { Kafka } from 'kafkajs';
import { TOPICS } from './topics.js';

const kafka = new Kafka({
  clientId: 'zomato-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log('[Kafka] Producer connected');
};

export const disconnectProducer = async () => {
  await producer.disconnect();
  console.log('[Kafka] Producer disconnected');
};

export const publishEvent = async (topic, data, key = null) => {
  await producer.send({
    topic,
    messages: [
      {
        key: key ? String(key) : null,
        value: JSON.stringify(data),
      },
    ],
  });
  console.log(`[Kafka] Event published → topic: ${topic}, key: ${key}`);
};