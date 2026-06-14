import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'zomato-service',
  brokers: ['localhost:9092'],
});

export const createConsumer = async (groupId, topic, onMessage) => {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      await onMessage(data);
    },
  });

  console.log(`[Kafka] Consumer (${groupId}) subscribed to ${topic}`);

  return async () => {
    await consumer.disconnect();
    console.log(`[Kafka] Consumer (${groupId}) disconnected`);
  };
};