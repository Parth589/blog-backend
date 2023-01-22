const express = require('express')
const {createBlog, deleteBlog, updateBlog,likePost} = require("../../controller/content.cjs");
const router = express.Router();

router.post('/create', createBlog);
router.delete('/delete/:id', deleteBlog);
router.put('/update/:id', updateBlog);
router.put('/like/:id',likePost);
module.exports = router;