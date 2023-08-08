const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    // if origin does not match the whitelist, CORS will fail
    origin: (origin, callback) => {

        // check if "postman" in allowOrigins, if so, bypass CORS
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.indexOf("postman") !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;