const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    content: {
        type: String, trim: true, required: true
    },
    by: {
        // * the user who wrote the comment
        type: {
            id: String, uname: String
        },
        required: true
    },
    of: {
        // * id of the blog post the comment belongs to
        type: String, required: true
    },
    parent: {
        //* the id of parent comment. this comment will be a reply for parent comment. if there's no parent comment, this filed either will be null or undefined
        type: String
    },
    replies: Boolean // indicator that is this comment have any replies or not
}, {
    timestamps: true
});
const model = mongoose.model('comment', schema);
module.exports = model;