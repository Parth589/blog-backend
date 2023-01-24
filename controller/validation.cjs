const blogModel = require('../db/model/blogs.cjs');
const getBlogDetails = (id) => {
    try {
        const data = blogModel.findById(id);
        if (!data) return false;
        return data;
    } catch (e) {
        return false;
    }
}
module.exports = {
    getBlogDetails
}