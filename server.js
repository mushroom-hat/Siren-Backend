// 1) node on cli 2) require('crypto').randomBytes(64).toString('hex')
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.port || 5000;
const cors = require('cors');
const { logger, logEvents } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const rateLimit = require('./middleware/rateLimiter');
const { connectRedis }= require('./config/redisConn');

// Connect to MongoDB
connectDB();
connectRedis();

// custom Logger middleware 
app.use(logger);

// CORS middleware
app.use(credentials);
app.use(cors(corsOptions));

// built-in middle to handle urlencoded data
// application/www-form-urlencoded
app.use(express.urlencoded({ extended: true}));
// application/json
app.use(express.json());


// Cookies middleware
app.use(cookieParser());

// routes
app.get('/', async (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED' }); 
});
app.use(rateLimit);
app.use('/auth', require('./routes/auth'));
app.use('/register', require('./routes/register'));
app.use('/refresh', require('./routes/refresh')); // issues new access token once expired
app.use('/logout', require('./routes/logout'));
app.use('/otp', require('./routes/api/otp'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));
app.use('/files', require('./routes/api/s3files'));


// redirect to 404.html if status code is 404
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});


// custom middleware error handler
app.use(errorHandler)

// only listen for API requests if mongodb successfully connected
mongoose.connection.once('open', () => {
    console.log('MongoDB connection established successfully');
    app.listen(PORT, () => console.log(`Server is running on localhost ${PORT}`));
})
