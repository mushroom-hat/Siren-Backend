const {redisClient} = require('../config/redisConn');

const rateLimit = async (req, res, next) => {
    const rl = {
        ip: req.ip,
        queried_api: req.originalUrl,
        rateLimitCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

    try {
        // Check if the key exists, if not, set it to 0
        host_cache = await redisClient.get(req.ip) || JSON.stringify(rl);
        // Parse the cached JSON to a JavaScript object
        host_cache = JSON.parse(host_cache);
        
         // Check if the key is greater than or equal to 5 (max request)
        if (host_cache.rateLimitCount >= 5) {
            return res.status(429).send("You can't make any more requests at the moment. Please try again later.");
        }
        // Increment the rateLimitCount by 1
        host_cache.rateLimitCount++;

        // Update updatedAt time
        host_cache.updatedAt = Date.now();

        // Update the Redis cache with the new rateLimitCount value
        // Set the expiration time to 10 seconds
        await redisClient.setEx(req.ip, 10, JSON.stringify(host_cache));
        console.log(`${req.ip} has value: ${host_cache.rateLimitCount}`)
        next();

    } catch (err) {
      console.log(err)                                           
      return res.status(500).send('Internal Server Error');
    }

}



module.exports = rateLimit;