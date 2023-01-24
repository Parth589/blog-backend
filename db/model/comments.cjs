const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    content: {
        type: String, trim: true, required: true
    }, by: {
        type: {
            id: String, uname: String
        }, required: true
    }, of: {
        // * id of the blog post the comment belongs to
        type: String, required: true
    }
}, {
    timestamps: true
});
const model = mongoose.model('comment', schema);
module.exports = model;