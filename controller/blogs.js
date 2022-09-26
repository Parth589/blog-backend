const { Error } = require('mongoose');
const model = require('../db/model/blogs');

const VALIDATE_ID = (id) => {
    // validation of mongodb's _id
    return id.match(/^[0-9a-fA-F]{24}$/);
};
const converter = require('../libraries/showdown');
const filterObjectsByKeyRegEx = (obj, filterKeys) => {

    // all keys other than filterKeys would be rejected and final object will be returned

    const res = {};
    filterKeys.forEach((e) => {
        if (obj[e])
            res[e] = new RegExp(obj[e], 'i');
    });
    return res;

};

const getFewBlogs = async (_req, res, next) => {
    // send blogs without their content field
    const LIMIT = 15;
    try {
        const data = await model.find({}, { "content": 0 }).limit(LIMIT);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error);
        next();
    }
};
const getOneBlog = async (req, res, next) => {
    // get a blog by it's id
    try {
        if (!VALIDATE_ID(req.params.id))
            return res.status(400).json({ success: false, data: [] });
        const data = await model.findOne({ _id: req.params.id });
        if (data)
            return res.status(200).json({ success: true, data });
        return res.status(404).json({ success: false, data });
    } catch (error) {
        console.log(error);
        next();
    }
};

const cerateBlog = async (req, res, next) => {
    // create a new blog (data would be sent via post request)
    try {
        let body = req.body;
        const a = ['keywords', 'title', 'author', 'content', 'brief', 'thumbnail_link'];
        body = filterObjectsByKey(req.body, a);
        body.content = converter.makeHtml(body.content);
        let data = await model.create(body);
        data = data.toJSON();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error.message });
        next();
    }
};
const deleteBlog = async (req, res, next) => {
    // delete blog by it's id
    try {
        if (!VALIDATE_ID(req.params.id)) return res.status(400).json({ success: false, data: [] });
        const data = await model.findByIdAndDelete({ _id: req.params.id });
        if (data)
            return res.status(200).json({ success: true, data });
        return res.status(404).json({ success: false, data });
    } catch (error) {
        console.log(error);
        next();
    }
};
const searchBlog = async (req, res, next) => {
    // Search blogs using their keywords, title or author (multiple feilds also can be specified)
    try {
        const a = ['keywords', 'title', 'author'];
        let fullObject = false;
        if (req.query['fullObject'])
            fullObject = true;

        const q = filterObjectsByKeyRegEx(req.query, a);// user can search on these feilds
        console.log('query is :',
            q);
        if (fullObject) {
            const data = await model.find({ $or: [{ keywords: q.keywords }, { title: q.title }, { author: q.author }] });
            if (data)
                return res.status(200).json({ success: true, data });
            return res.status(404).json({ success: false, data });
        }
        else {
            const data = await model.find({ $or: [{ keywords: q.keywords }, { title: q.title }, { author: q.author }] }, { content: 0 });
            if (data)
                return res.status(200).json({ success: true, data });
            return res.status(404).json({ success: false, data });
        }
    } catch (error) {
        console.log(error.message);
        next();
    }
};

const filterObjectsByKey = (obj, filterKeys) => {

    // all keys other than filterKeys would be rejected and final object will be returned

    const res = {};
    filterKeys.forEach((e) => {
        if (obj[e]) {
            res[e] = obj[e];
            console.log(e);
        }
    });
    return res;

};

const updateBlog = async (req, res, next) => {
    //  update a blog using it's id (data on the req.body)

    try {
        if (!VALIDATE_ID(req.params.id))
            return res.status(400).json({ success: false, data: [] });
        const a = ['keywords', 'title', 'author', 'content', 'brief', 'thumbnail_link'];
        const newObject = filterObjectsByKey(req.body, a);// user can search on these feilds
        console.log('query is :', newObject);
        const data = await model.findByIdAndUpdate(req.params.id, newObject, { new: true });
        if (data)
            return res.status(200).json({ success: true, data });
        return res.status(404).json({ success: false, data });
    } catch (error) {
        console.log(error);
        next();
    }
};
module.exports = {
    getFewBlogs,
    getOneBlog,
    cerateBlog,
    searchBlog,
    deleteBlog,
    updateBlog
};

