const router = require('express').Router();
const {
    getFewBlogs,
    getOneBlog,
    getUserDetails,
    searchBlog,
    fetchComments,
    getUserProfilePicture
} = require('../../controller/content.cjs')
const {authorize} = require('../../controller/auth/auth-middleware.cjs')

// * non-authorized requests
router.get('/blogs', getFewBlogs);
router.get('/blog/search', searchBlog); // * keep this up on all request
router.get('/blog/:id', getOneBlog);
router.get('/user/:id', getUserDetails);
router.get('/userProfile/:id', getUserProfilePicture);
router.get('/comments/:id', fetchComments);
// * authorized requests
const authRouter = require('./DBAuth.cjs');
const {login, linkLogin} = require("../../controller/auth/auth-middleware.cjs");
const {register} = require("../../controller/auth/public-controllers.cjs");
const {logout} = require("../../controller/auth/auth-middleware.cjs");
router.use('/auth', authorize, authRouter);

// * Auth endpoints
router.post('/login', login);
router.get('/logout', logout);
router.post('/register', register);
router.get('/verify',linkLogin);

module.exports = router;