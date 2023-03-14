const blogModel = require('../db/model/blogs.cjs');
const userModel = require('../db/model/user.cjs')
const {verifyInputs} = require('./auth/auth-middleware.cjs')
const getBlogDetails = (id) => {
    try {
        const data = blogModel.findById(id);
        if (!data) return false;
        return data;
    } catch (e) {
        return false;
    }
}

const validateRegister = async (req) => {
    let {mail, username} = req.body;
    if (!verifyInputs(mail) || (!mail || !username) || ((!mail || !username) && (!mail.trim() || !username.trim()))) {
        return {success: false, msg: 'Invalid Inputs '};
    }

    req.body.mail = mail.trim();
    req.body.username = username.trim();
    const data = await userModel.find({mail: req.body.mail})
    // the data.length must be 0 in order to validate the user
    return {success: data?.length === 0, msg: 'E-mail id already exist'};
}
module.exports = {
    getBlogDetails,
    validateRegister
}