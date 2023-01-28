const model = require('../db/model/blogs.cjs');
const userModel = require('../db/model/user.cjs');
const commentsModel = require('../db/model/comments.cjs');
const {isAuthorized, getUserDetails} = require('./auth/auth-middleware.cjs');
const {getBlogDetails} = require('./validation.cjs')
const converter = require('../libraries/showdown.cjs');
const {isValidObjectId} = require("mongoose");
const path = require("path");
const fs = require("fs");
const {convertImage} = require("./fileHandle.cjs");

const getFewBlogs = async (req, res, next) => {
    // send blogs without their content field
    const LIMIT = req.body.limit || 10;
    try {
        // https://www.mongodb.com/docs/manual/reference/operator/aggregation/sample/
        const data = await model.aggregate([{$sample: {size: LIMIT}}])
            .project({content: 0});// hide the content
        return res.status(200).json({success: true, data});
    } catch (error) {
        console.log(error);
        next();
    }
};
const getOneBlog = async (req, res, next) => {
    // get a blog by it's id
    try {
        if (!isValidObjectId(req.params.id)) return res.status(400).json({success: false, data: []});
        const data = await model.findOne({_id: req.params.id});
        if (data) {
            if (await isAuthorized(req)) {
                // * the view will only be counted if an authorized user requests it
                await model.findByIdAndUpdate(data._id, {
                    $set: {"meta.views": data.meta.views + 1}
                }, {timestamps: false});
            }
            return res.status(200).json({success: true, data});
        }
        return res.status(404).json({success: true, data});
    } catch (error) {
        console.log(error);
        next();
    }
};
const createBlog = async (req, res) => {
    // create a new blog (data would be sent via post request)
    try {
        let body;
        const a = ['keywords', // [String] (* maximum 5)
            'title',    // String
            'content',  // String   (* markdown content)
        ];

        // filtering the object
        body = filterObjectsByKey(req.body, a);

        // validating inputs
        if (!Array.isArray(body.keywords)) throw new Error('input validation failed');

        // translating the markdown content to HTML
        body.content = converter.makeHtml(body.content);

        // adding author details
        const user = await getUserDetails(req);
        if (!user) {
            throw new Error('Author details didn\'t match');
        }
        body.author = {
            username: user.username, id: user._id
        };
        const obj = {
            content: {
                title: body.title, post: body.content
            }, keywords: body.keywords, author: body.author, meta: {views: 0, likes: 0}
        }
        let data = await model.create(obj);
        data = data.toJSON();
        res.status(200).json({success: true, data});
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, message: error.message});
    }
};


const deleteBlog = async (req, res, next) => {
    // delete blog by it's id
    try {
        if (!isValidObjectId(req.params.id)) return res.status(400).json({success: false, data: []});
        const tmp = await getUserDetails(req);
        if (!tmp) res.status(404).json({success: false, msg: 'user not found'});
        const wantToDelete = await model.findById(req.params.id);
        if (!wantToDelete) {
            return res.status(404).json({success: false, msg: 'The targeted post not found'});
        }
        if (wantToDelete.author.id !== tmp._id.toString()) {
            return res.status(404).json({success: false, msg: 'can\'t delete someone else\'s post'})
        }
        const data = await model.findByIdAndDelete({_id: req.params.id});
        if (data) return res.status(200).json({success: true, data});
        return res.status(404).json({success: false, data});
    } catch (error) {
        console.log(error);
        next();
    }
};

const searchBlog = async (req, res, next) => {
    // Search blogs using their keywords, title or author (multiple fields also can be specified)
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        let fullObject = Boolean(req.query['fullObject']);
        const searchTerm = String(req.query['searchTerm']);
        const q = searchTerm.split(' ').map(e => {
            return new RegExp(e, 'i');
        });

        if (fullObject) {
            const data = await model.find({
                $or: [{keywords: {$in: q}}, {title: {$in: q}}, {author: {$in: q}}]
            })
                .skip((page - 1) * limit).limit(limit);
            if (data) return res.status(200).json({success: true, data});
            return res.status(404).json({success: false, data});
        } else {
            const data = await model.find({$or: [{keywords: {$in: q}}, {"content.title": {$in: q}}, {"author.username": {$in: q}}]}, {"content.post": 0})
                .skip((page - 1) * limit).limit(limit);
            if (data) return res.status(200).json({success: true, data});
            return res.status(404).json({success: false, data});
        }
    } catch (error) {
        console.log(error);
        next();
    }
};

const updateBlog = async (req, res, next) => {
    //  update a blog using its id (data on the req.body)

    try {

        if (!isValidObjectId(req.params.id)) return res.status(400).json({success: false, msg: 'ID validation failed'});

        const tmp = await getUserDetails(req);
        if (!tmp) res.status(404).json({success: false, msg: 'user not found'});
        const wantToUpdate = await model.findById(req.params.id);
        if (!wantToUpdate) {
            return res.status(404).json({success: false, msg: 'The targeted post not found'});
        }
        if (wantToUpdate.author.id !== tmp._id.toString()) {
            return res.status(404).json({success: false, msg: 'can\'t update someone else\'s post'})
        }

        const a = ['keywords', 'title', 'content'];
        const newObject = filterObjectsByKey(req.body, a);// user can perform on these fields

        // validating inputs
        if (!Array.isArray(newObject.keywords)) throw new Error('input validation failed');

        if (newObject.content) newObject.content = converter.makeHtml(newObject.content);

        const data = await model.findByIdAndUpdate(req.params.id, {
            content: {
                title: newObject.title, post: newObject.content
            }, keywords: newObject.keywords
        }, {new: true});
        if (data) return res.status(200).json({success: true, data});
        return res.status(404).json({success: false, data});
    } catch (error) {
        console.log(error);
        next();
    }
};

const getUserProfile = async (req, res) => {
    try {
        const data = await userModel.findById(req.params.id);
        if (!data) return res.status(404).json({success: false, msg: 'User not found'})
        res.status(200).json({
            success: true, data
        });
    } catch (err) {
        res.status(404).json({success: false, msg: 'user not found'});
    }
}

const likePost = async (req, res) => {
    try {

        if (!(await isAuthorized(req))) {
            // bad request
            return res.status(404).json({success: false, msg: 'User is not authorized'})
        }
        if (!isValidObjectId(req.params.id)) return res.status(404).json({
            success: false, msg: 'User is not authorized'
        });
        const d = await model.findById(req.params.id);
        const userDetails = await getUserDetails(req);
        if (!userDetails) return res.status(404).json({success: false, msg: 'User is not authorized'});

        if (d.meta.stargazers.includes(userDetails._id)) {
            // remove the like from the user
            const newStargazers = d.meta.stargazers.filter(e => e !== userDetails._id.toString());


            const data = await model.findByIdAndUpdate(req.params.id, {
                "meta.likes": d.meta.likes - 1, "meta.stargazers": newStargazers
            }, {new: true});
            return res.status(200).json({success: true, data});
        }
        const data = await model.findByIdAndUpdate(req.params.id, {
            "meta.likes": d.meta.likes + 1, "meta.stargazers": [...d.meta.stargazers, userDetails._id]
        }, {new: true});


        res.status(200).json({success: true, data});
    } catch (e) {
        console.log(e);
        return res.status(404).json({success: false, msg: 'something went wrong', details: e});
    }
}
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

const createComment = async (req, res, next) => {
    try {

        // id of blog will be on the req.params
        const BlogID = await getBlogDetails(req.params.id);
        const user = await getUserDetails(req);
        const commentContent = req.body.content.trim();
        if (!BlogID || !user || !commentContent) {
            return res.status(404).json({success: false, msg: 'Invalid inputs'});
        }

        // populate the object to make the DB entry
        const obj = {
            by: {id: user._id.toString(), uname: user.username},
            content: commentContent,
            of: BlogID._id.toString(),
            parent: null,
            replies: false
        }

        // if comment is reply for another comment, check if parent exists or not
        const parentID = req.body.parent;
        if (parentID) {
            const d = await commentsModel.findByIdAndUpdate(parentID, {replies: true});
            console.log({d});
            if (!d) {
                // bad request
                return res.status(404).json({success: false, msg: 'The parent comment not found'});
            }
            obj.parent = req.body.parent;
        }

        // store the comment
        const data = await commentsModel.create(obj);
        res.json({success: true, data})
    } catch (e) {
        res.status(404).json({success: false, msg: e})
        next();
    }
}

const fetchComments = async (req, res, next) => {
    try {

        const id = req.params.id;// id of blog
        const parent = req.query.p || null; // id of parent
        if (!isValidObjectId(id)) {
            // bad request
            return res.status(202).json({success: false, msg: 'invalid object id'})
        }
        const data = await commentsModel.find({of: id, parent});
        return res.status(200).json({success: true, data})
    } catch (e) {
        console.log(e);
        return res.status(404).json({success: false, msg: e})
    }
}

// server of user profile images
const getUserProfilePicture = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);

        const options = {
            root: path.join(__dirname, '../uploads/')
        };

        if (!user) return res.status(404).json({success: false, msg: 'User not found'});
        const filename = user.mail + '.png';
        let doFileExist;
        try {
            fs.accessSync(path.join(options.root, filename));
            doFileExist = true;
        } catch (err) {
            console.log('debug:' + err)
            doFileExist = false;
        }
        if (doFileExist) return res.sendFile(filename, options);
        return res.json({success: false, msg: 'No profile picture is set for this user'})
    } catch (e) {
        console.log(e)
        next();
    }
}

const setProfilePicture = async (req, res, next) => {
    try {
        const user = await getUserDetails(req);
        if (!user) {
            // not authorized
            res.status(404).json({success: false, msg: 'user is not authorized'});
        }
        if (req.file) {
            try {
                await convertImage(path.join(__dirname, '../uploads/' + req.file.filename), req.file.filename);
                return res.json({
                    success: true, file: {
                        name: req.file.originalname,
                        encoding: req.file.encoding,
                        mimetype: req.file.mimetype,
                        size: req.file.size
                    }
                });
            } catch (e) {
                console.log(e);
                return res.status(404).json({success: false, msg: 'Input validation failed', error: e})
            }
        }
        return res.status(404).json({success: false, msg: 'Attached file not found'});
    } catch (e) {
        console.log(e);
        next();
    }
}
module.exports = {
    getFewBlogs,
    getOneBlog,
    createBlog,
    searchBlog,
    deleteBlog,
    updateBlog,
    getUserDetails: getUserProfile,
    likePost,
    createComment,
    fetchComments,
    getUserProfilePicture,
    setProfilePicture
};
