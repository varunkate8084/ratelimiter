import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { taskQueue } from '../app';

// const redisHost = 'redis-12572.c16.us-east-1-3.ec2.redns.redis-cloud.com';
// const redisPort = '12572';
// const password = 'GLvbmHTmyyLErevEqaACk5saVNs9zg5v'

// Setup Redis client with error handling
// const redisClient = new Redis({
//     port: redisPort,
//     host: redisHost,
//     password: password,
// });
const redisClient = new Redis()

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Setup rate limiter
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiter',
  points: 20, // 20 tasks per minute
  duration: 60, // Per minute
  blockDuration: 1, // Block for 1 second if exceeded
});

// Rate limiter middleware function
const rateLimiterMiddleware = (req, res, next) => {
  const { user_id } = req.body;

  rateLimiter.consume(user_id)
    .then(() => {
      next(); // Proceed to the next middleware or route handler if rate limit is not exceeded
    })
    .catch(() => {
      taskQueue.add({ user_id });
      res.status(429).json({ message: 'Rate limit exceeded, task queued for later processing' });
    });
};

export default rateLimiterMiddleware;
