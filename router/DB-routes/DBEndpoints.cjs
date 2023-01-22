const router = require('express').Router();
const {getFewBlogs, getOneBlog, getUserDetails, searchBlog} = require('../../controller/content.cjs')
const {authorize} = require('../../controller/auth/auth-middleware.cjs')

// * non-authorized requests
router.get('/blogs', getFewBlogs);
router.get('/blog/search', searchBlog);// * keep this up on all request
router.get('/blog/:id', getOneBlog);
router.get('/user/:id', getUserDetails);
// * authorized requests
const authRouter = require('./DBAuth.cjs');
router.use('/blog', authorize, authRouter);
module.exports = router;