const express = require('express');
const router = express.Router();
const { home, blogs, blog, write } = require('../controller/server');
router.get('/', home);
router.get('/blogs', blogs);
router.get('/write', write);
router.get('/blog/:id', blog);
module.exports = router;