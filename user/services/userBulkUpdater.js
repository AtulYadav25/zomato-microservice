import User from '../models/user.model.js';
import mongoose from 'mongoose';

const buffer = [];
const FLUSH_INTERVAL_MS = 10000;

export const addToUserBuffer = (event) => {
  buffer.push(event);
};

const flush = async () => {
  if (buffer.length === 0) return;

  const events = buffer.splice(0, buffer.length);

  const bulkOps = events.map(({ userId, amount }) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(userId) },
      update: {
        $inc: { totalSpent: amount, totalOrders: 1 },
        $set: { lastOrderAt: new Date() },
      },
    },
  }));

  console.log(events);
  console.log(bulkOps[0])

  try {
    const result = await User.bulkWrite(bulkOps, { ordered: false });
    console.log(result)
    console.log(`[UserService] Bulk updated ${result.modifiedCount} users`);
  } catch (err) {
    console.error('[UserService] Bulk write failed:', err.message);
  }
};

setInterval(flush, FLUSH_INTERVAL_MS);