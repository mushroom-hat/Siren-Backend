const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email_address: {
        type: String,
        unique: true,
    },

    otp: String,
    createdAt: Date,
    expiresAt: Date, 
});

// model name, schema, collection name
module.exports = mongoose.model('OTP', otpSchema, 'otps')