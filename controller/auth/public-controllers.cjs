const userModel = require('../../db/model/user.cjs');
const bcrypt = require('bcrypt');

// * make a new user by taking their username, password, and email
const register = async (req, res, next) => {
    let {mail, password, username} = req.body;
    if ((!mail || !password || !username) || ((!mail || !username || !password) && (!mail.trim() || !username.trim()))) {
        res.json({
            success: false,
            msg: 'Essential information are not provided'
        });
        return;
    }
    mail = mail.trim();
    username = username.trim();

    try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        // make a new entry in database 
        const obj = {mail, password, username};

        if ((await userModel.find({mail: obj.mail})).length !== 0) {
            res.status(404).json({
                success: false,
                msg: 'E-mail id is already in use'
            });
            return;
        }
        const data = await userModel.create(obj);
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: 'Something went wrong'
        });
    }
};
module.exports = {register};