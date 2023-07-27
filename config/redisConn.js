
const redis = require('redis');
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    password: process.env.REDIS_PASS
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected');
        return redisClient;
    }
    catch (err) {
        console.error(err.message);
    }
}

module.exports = {
    connectRedis,
    redisClient
                };
