const userModel = require('../../db/model/user.cjs');
const bcrypt = require('bcrypt');
const {validateRegister} = require("../validation.cjs");

// * make a new user by taking their username, password, and email
const register = async (req, res, next) => {
    let {mail, password, username} = req.body;
    try {
        const d = await validateRegister(req);
        if (!d.success) {
            // bad request
            return res.status(404).json(d);
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        // make a new entry in database 
        const obj = {mail, password, username};
        const tmp = await userModel.find({mail: obj.mail});
        console.log({mail, tmp})
        if (tmp.length !== 0) {
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