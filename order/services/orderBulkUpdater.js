import mongoose from 'mongoose';
import OrderModel from '../models/order.model.js'; // your Order model

const buffer = [];
const FLUSH_INTERVAL_MS = 10000;

export const addToOrderBuffer = (event) => {
  buffer.push(event);
};

const flush = async () => {
  if (buffer.length === 0) return;

  const events = buffer.splice(0, buffer.length); // drain buffer atomically

  const bulkOps = events.map(({ orderId, paidAt }) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(orderId) },
      update: { $set: { paymentStatus: 'PAID', paidAt } },
    },
  }));

  try {
    const result = await OrderModel.bulkWrite(bulkOps, { ordered: false });
    console.log(`[OrderService] Bulk updated ${result.modifiedCount} orders`);
  } catch (err) {
    console.error('[OrderService] Bulk write failed:', err.message);
    // Optional: push events back to buffer or dead-letter queue
  }
};

setInterval(flush, FLUSH_INTERVAL_MS);