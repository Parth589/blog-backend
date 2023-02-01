const mongoose = require('mongoose');

const KEYWORD_VALIDATOR = (val) => {
    return (Array.isArray(val) && (val.length <= 5 && val.length >= 1));
};

const schema = new mongoose.Schema({
        content: {
            title: {
                type: String,
                required: true,
                trim: true
            },
            post: {
                type: String,
                required: true,
            }
        },
        keywords: {
            type: [{type: String, trim: true, required: true, lowercase: true}],
            required: true,
            validate: [KEYWORD_VALIDATOR, "number of keywords must be in range of 1 to 5"]
        },
        author: {
            username: {
                type: String,
                required: true,
                trim: true
            },
            id: {
                type: String,
                required: true
            }
        },
        meta: {
            views: {
                type: Number,
                required: true
            },
            likes: {
                type: Number,
                required: true
            },
            stargazers: {
                type: [{type: String, trim: true}],
                required: true,
            },
        },
        thumbnail_link: String
    },

    {
        timestamps: true
    });

const model = mongoose.model('blog', schema);
module.exports = model;