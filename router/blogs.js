const express = require('express');
const router = express.Router();

const { getOneBlog, getFewBlogs, cerateBlog, searchBlog, deleteBlog, updateBlog } = require('../controller/blogs');
router.get('/', getFewBlogs);
router.get('/search', searchBlog);
router.get('/:id', getOneBlog);
router.delete('/:id', deleteBlog);
router.post('/', cerateBlog);
router.patch('/:id', updateBlog);
module.exports = router;