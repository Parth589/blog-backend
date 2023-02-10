const userModel = require('../../db/model/user.cjs');
const {validateRegister} = require("../validation.cjs");

// * make a new user by taking their username, password, and email
const register = async (req, res) => {
    let {mail, username} = req.body;
    try {
        const d = await validateRegister(req);
        if (!d.success) {
            // bad request
            return res.status(404).json(d);
        }

        // make a new entry in database
        const obj = {mail, username};
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