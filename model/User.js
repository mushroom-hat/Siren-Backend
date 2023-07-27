const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    },
    email_address:
    {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 3 // default role is User
        },
        Admin: Number,
        Alumni: Number
    },
    verified: {
        type: Boolean,
        default: false
    },

    refreshToken: String

});

// model name, schema, collection name
module.exports = mongoose.model('User', userSchema, 'users')