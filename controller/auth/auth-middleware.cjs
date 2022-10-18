const jwt = require('jsonwebtoken');
const userModel = require('../../db/model/user.cjs');
const bcrypt = require('bcrypt');
const verifyInputs = (mail, password) => {
    mail = mail.trim();
    password = password.trim();
    const mailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return !(!mailRegex.test(mail) || !password);
    // it can be explained as,
    // if (!mailRegex.test(mail) || !password)
    //     return false;
    // return true;

};

const verifyUser = async (mail, password) => {
    if (!verifyInputs(mail, password))
        return false;

    // will find the user with mail id in database and return result according to it.
    let data = await userModel.find({mail});
    if (data.length !== 1)
        return false;
    data = data[0];
    try {
        return await bcrypt.compare(password, data['password']);
    } catch (error) {
        console.log(error);
        console.trace();
        return false;
    }
};

//* the authorize function will be used to check if the host is eligible for accessing the database or not
const authorize = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({msg: 'User is not authorized'});
    }
    try {
        const decode = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
        console.log({decode});
        console.log("Inside authorize");
        // check if the user exist on database or not;
        if ((await userModel.find({mail: decode.id})).length !== 1) {
            return res.status(401).json({msg: 'User not found'});
        }
        // res.status(200).json({success: true, msg: 'Authentication successful'});
        next();
    } catch (error) {
        console.log(error);
        console.trace();
        return res.status(401).json({msg: 'User is not authorized'});
    }
};

//* the login function will be used to provide the JWT token to any user stored in DB
const login = async (req, res) => {
    if (!req.body['mail'] || !req.body['password']) {
        return res.status(400).json({msg: 'username and password are required.'});
    }
    try {
        // check if the given mail and password are correct or not
        const c = await verifyUser(req.body['mail'], req.body['password']);
        if (!c) {
            res.status(401).json({
                success: false,
                msg: 'Unauthorized request'
            });
            return;
        }
        // * here, the mail of user is considered as id of that person. this JWT will expire in giver amount of time in options object
        const signedJWT = jwt.sign({id: req.body['mail']}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
        console.log('signed jwt is: ', signedJWT);
        res.json({
            success: true,
            token: signedJWT
        });
    } catch (error) {
        console.log(error);
        console.trace();
        return res.status(500).json({
            success: false,
            msg: 'something went wrong'
        });
    }
};
module.exports = {authorize, login};