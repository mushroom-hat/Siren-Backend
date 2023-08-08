const {redisClient} = require('../config/redisConn');

const rateLimit = async (req, res, next) => {
    const origin_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("RL IP:", origin_ip);
    const queried_api = req.originalUrl
    const rl = {
          [queried_api]: {
            rateLimitCount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
    };
      try {
        // Check if the key exists, if not, set it to 0
        host_cache = await redisClient.get(origin_ip) || JSON.stringify(rl);

        // Parse the cached JSON to a JavaScript object
        host_cache = JSON.parse(host_cache);
         // If queried api is not in redis, add it to existing host cache
         if (queried_api in host_cache === false)
         {  
          console.log("Adding new api to host cache")
             host_cache[queried_api] = {
                 rateLimitCount: 0,
                 createdAt: Date.now(),
                 updatedAt: Date.now()
             };
         }

        // Check if the key is greater than or equal to 10 (max request)
        if (host_cache[queried_api].rateLimitCount >= 10) {
            return res.status(429).send("You can't make any more requests at the moment. Please try again later.");
        }
       
        // Increment the rateLimitCount by 1
        host_cache[queried_api].rateLimitCount++;

        // Update updatedAt time
        host_cache[queried_api].updatedAt = Date.now();

        // Update the Redis cache with the new rateLimitCount value
        // Set the expiration time to 10 seconds
        await redisClient.setEx(origin_ip, 10, JSON.stringify(host_cache));
        console.log(`${origin_ip} has value: ${host_cache[queried_api].rateLimitCount} for ${queried_api}`)
        next();

    } catch (err) {
      console.log(err)                                           
      return res.status(500).send('Internal Server Error');
    }

}



module.exports = rateLimit;