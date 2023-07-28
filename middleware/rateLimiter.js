const {redisClient} = require('../config/redisConn');

const rateLimit = async (req, res, next) => {
    try {
        // Check if the key exists, if not, set it to 0
        curr = await redisClient.get(req.ip) || 0;

        // Check if the key is greater than or equal to 5 (max request)
        if (curr >= 5) {
            return res.status(429).send("You can't make any more requests at the moment. Please try again later.");
        }
        // Increment the key by 1
        resp = await redisClient.incr(req.ip)
        console.log(`${req.ip} has value: ${resp}`)
        redisClient.expire(req.ip, 10); // Set the expiration time to 10 seconds
        next();

    } catch (err) {
      console.log('Could not increment key')
      return res.status(500).send('Internal Server Error');
    }

}



module.exports = rateLimit;