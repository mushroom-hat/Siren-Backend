const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    }


});

// model name, schema, collection name
module.exports = mongoose.model('Employee', employeeSchema, 'employees')