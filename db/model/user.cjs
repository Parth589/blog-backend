const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    }
});
const model = mongoose.model('user', schema);
module.exports = model;