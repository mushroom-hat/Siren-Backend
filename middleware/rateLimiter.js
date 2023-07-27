const {redisClient} = require('../config/redisConn');

const rateLimit = async (req, res, next) => {
    try {
        curr = await redisClient.get(req.ip)
        if (curr >= 5) {
            return res.status(429).send("You can't make any more requests at the moment. Please try again later.");
        }
        resp = await redisClient.incr(req.ip)
        console.log(`${req.ip} has value: ${resp}`)

    } catch (err) {
      console.log('Could not increment key')
      return res.status(500).send('Internal Server Error');
    }

    redisClient.expire(req.ip, 10); // Set the expiration time to 10 seconds
    next();
}



module.exports = rateLimit;