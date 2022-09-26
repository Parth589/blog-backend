const OBJhome = {
    mediaCSS_link: '/css/media/home.css',
    regularCSS_link: '/css/home.css',
    title: 'Hone',
    content: 'home',
    style_JS_link: '/js/style.js',
    regular_JS_link: '/js/home.js'
};
const OBJblog = {
    mediaCSS_link: '/css/media/blog.css',
    regularCSS_link: '/css/blog.css',
    title: 'blog',
    content: 'blog',
    style_JS_link: '/js/style.js',
    regular_JS_link: '/js/blog.js'
};
const OBJblogs = {
    mediaCSS_link: '/css/media/blogs.css',
    regularCSS_link: '/css/blogs.css',
    title: 'blogs',
    content: 'blogs',
    style_JS_link: '/js/style.js',
    regular_JS_link: '/js/blogs.js'
};
const OBJwrite = {
    mediaCSS_link: '/css/media/write.css',
    regularCSS_link: '/css/write.css',
    title: 'write',
    content: 'write',
    style_JS_link: '/js/style.js',
    regular_JS_link: '/js/write.js'
};

const home = async (req, res, next) => {
    try {
        res.render('index.ejs', OBJhome);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
};
const blogs = async (req, res, next) => {
    try {
        res.render('index.ejs', OBJblogs);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
};
const write = async (req, res, next) => {
    try {
        res.render('index.ejs', OBJwrite);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
};
const blog = async (req, res, next) => {
    try {
        res.render('index.ejs', OBJblog);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
};

module.exports = { write, blog, blogs, home };