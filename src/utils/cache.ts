import { IQueryWithCache } from '_app/interfaces';
import mongoose, { Document, Model } from 'mongoose';
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL!;

const redisClient = createClient({
  url: redisUrl,
});

const connectToRedis = (() => {
  async function connect() {
    try {
      await redisClient.connect();
      console.log('Connected to Redis!');
    } catch (err) {
      console.error('Error connecting to Redis:', err);
      console.log('Retrying in 5 seconds...');
      setTimeout(connect, 5000);
    }
  }

  connect();

  return {
    connect,
  };
})();

redisClient.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

export const queryWithCache: IQueryWithCache = async (modelName, query, cacheKey) => {
  const cacheValue = await redisClient.hGet(cacheKey, JSON.stringify(query));
  if (cacheValue) {
    return JSON.parse(cacheValue);
  }

  const model = mongoose.model(modelName) as Model<Document>;
  const result = await model.find(query).exec();
  const rows = result;

  redisClient
    .hSet(cacheKey, JSON.stringify(query), JSON.stringify(rows))
    .then(() => {
      return redisClient.expire(cacheKey, 300);
    })
    .then(() => {
      console.log('CACHE SET TO EXPIRE IN 5 MINUTES');
    })
    .catch((err) => {
      console.error('Error while setting cache:', err);
    });

  return rows;
};

export const clearCache = (hashKey: string) => {
  redisClient
    .del(hashKey)
    .then(() => {
      console.log('CACHE CLEARED FOR HASHKEY:', hashKey);
    })
    .catch((err) => {
      console.error('Error while clearing cache:', err);
    });
};
