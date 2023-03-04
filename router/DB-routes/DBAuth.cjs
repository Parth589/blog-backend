const express = require('express')
const {
    createBlog,
    deleteBlog,
    updateBlog,
    likePost,
    createComment,
    setProfilePicture,
    editUsername
} = require("../../controller/content.cjs");
const {upload} = require('../../controller/fileHandle.cjs');

const router = express.Router();

router.post('/blog/create', createBlog);
router.delete('/blog/delete/:id', deleteBlog);
router.put('/blog/update/:id', updateBlog);
router.put('/blog/like/:id', likePost);
router.post('/blog/comment/create/:id', createComment);
router.put('/userProfile', (req, res, next) => {
    upload.single('profileImage')(req, res, (err) => {
        // this function handles the error
        if (err) {
            console.log(err);
            return res.json({success: false, msg: err.toString()});
        }
        // res.json({success:true});
        next();
    });
}, setProfilePicture);
router.put('/user/username/:id',editUsername)

module.exports = router;