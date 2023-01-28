const express = require('express')
const {
    createBlog,
    deleteBlog,
    updateBlog,
    likePost,
    createComment,
    setProfilePicture
} = require("../../controller/content.cjs");
const {upload} = require('../../controller/fileHandle.cjs');

const router = express.Router();

router.post('/create', createBlog);
router.delete('/delete/:id', deleteBlog);
router.put('/update/:id', updateBlog);
router.put('/like/:id', likePost);
router.post('/comment/create/:id', createComment);
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


module.exports = router;