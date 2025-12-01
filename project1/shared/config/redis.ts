import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export const connectRedis = async (url: string): Promise<RedisClientType> => {
  try {
    redisClient = createClient({ url });
    
    redisClient.on('error', (error) => {
      console.error('❌ Redis error:', error);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    console.log('Redis connection closed');
  }
};
