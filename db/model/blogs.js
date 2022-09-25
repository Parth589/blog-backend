const mongoose = require('mongoose');


const KEYWORD_VALIDATOR = (val) => {
    return (Array.isArray(val) && (val.length <= 5 && val.length >= 1));
};

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    brief: {
        type: String,
        required: true,
        trim: true
    },
    thumbnail_link: {
        type: String,
        default: null,
        trim: true
    },
    keywords: {
        type: [{ type: String, trim: true, required: true, lowercase: true }],
        required: true,
        validate: [KEYWORD_VALIDATOR, "number of keywords must be in range of 1 to 5"]
    },
    author: {
        type: String,
        required: true,
        trim: true
    }

});

const model = mongoose.model('blog', schema);
module.exports = model;