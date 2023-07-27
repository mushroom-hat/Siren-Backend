const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    filename: {
        type: String,
        required: true,
    },

    // UUID
    file_identifier: {
        type: String,
        required: true,
    },

    // Datetime
    createdAt: {
        type: Date,
        required: true,
        default: Date.now, // Default to the current date and time
    }

});

// model name, schema, collection name
module.exports = mongoose.model('File', fileSchema, 'files')