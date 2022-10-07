const { query } = require('express');
const fetch = require('node-fetch');
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
        if (obj[e] && typeof obj[e] === 'string')
            res[e] = new RegExp(obj[e], 'i');
        if (Array.isArray(obj[e])) {
            obj[e].forEach((element) => {
                if (typeof element === 'string') {
                    element = new RegExp(element, 'i');
                }
            });
            res[e] = obj[e];
        }
    });
    return res;

};

const getFewBlogs = async (_req, res, next) => {
    // send blogs without their content field
    const LIMIT = 3;
    try {
        const data = await model.aggregate([{ $sample: { size: LIMIT } }]).project({ content: 0 });
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
        if (!body.thumbnail_link) {
            // generate a random image to use it as thumbnail of blog post
            body.thumbnail_link = `https://source.unsplash.com/random/?${String(body.keywords).replace(',', '&')}`;
            const response = await fetch(body.thumbnail_link);
            body.thumbnail_link = response.url.split('?')[0];
        }
        else {
            // check if provided link is valid or not
            const response = await fetch(body.thumbnail_link);
            console.log(response.headers);
            if (!response.headers.get('content-type').includes('image')) {
                throw new Error('Provided image link is not valid');
            }
        }
        let data = await model.create(body);
        data = data.toJSON();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error.message });
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
        let fullObject = false;
        if (req.query['fullObject'])
            fullObject = true;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const searchTerm = req.query['searchTerm'];
        console.log('search query is :', req.query);
        const q = searchTerm.split(' ');
        q.forEach(e => {
            e = new RegExp(e, 'i');
        });
        if (fullObject) {
            const data = await model.find({ $or: [{ keywords: { $in: q } }, { title: { $in: q } }, { author: { $in: q } }] })
                .skip((page - 1) * limit).limit(limit);
            if (data)
                return res.status(200).json({ success: true, data });
            return res.status(404).json({ success: false, data });
        }
        else {
            const data = await model.find({ $or: [{ keywords: { $in: q } }, { title: { $in: q } }, { author: { $in: q } }] }, { content: 0 })
                .skip((page - 1) * limit).limit(limit);
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
        if (newObject.content)
            newObject.content = converter.makeHtml(newObject.content);

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
    updateBlog,
};
