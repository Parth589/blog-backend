const jwt = require('jsonwebtoken');
const userModel = require('../../db/model/user.cjs');
const nodemailer = require("nodemailer");
const verifyInputs = (mail) => {
    mail = mail.trim();
    const mailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return mailRegex.test(mail);
};

const verifyUser = async (mail) => {
    if (!verifyInputs(mail))
        return false;

    // will find the user with mail id in database and return result according to it.
    let data = await userModel.find({mail});

    return data.length === 1;
    // * above statement can be simplified as
    // if (data.length !== 1)
    //     return false;
    // return true;
};

// * this utility function checks if the request is made by authorized user or not
const isAuthorized = async (req) => {
    if (!req.cookies || !req.cookies.__login_token) {
        return false;
    }
    try {
        const passedJWT = req.cookies.__login_token;
        const decode = jwt.verify(passedJWT, process.env.JWT_SECRET_KEY);
        // check if the user exist on database or not;
        if (!(await userModel.findById(decode.id))) {// here decode.id stands for the id in the jwt payload.
            return false;
        }
        // res.status(200).json({success: true, msg: 'Authentication successful'});
        return decode.id;
    } catch (error) {
        console.error(error)
        return false;
    }
}

//* the authorize function will be used to check if the host is eligible for accessing the database or not
const authorize = async (req, res, next) => {
    try {
        if (!await isAuthorized(req)) {
            return res.status(401).json({success: false, msg: 'User is not authorized'});
        }
        next();
    } catch (error) {
        console.log(error);
        console.trace();
        return res.status(401).json({success: false, msg: 'User is not authorized'});
    }
};


//* the login function will be used to provide the JWT token to any user stored in DB
const login = async (req, res) => {
    if (!req.body['mail'] || !req.body['redirect']) {
        return res.status(400).json({success: false, msg: 'email and redirect URL is required in order to login'});
    }
    try {
        // check if the given mail and password are correct or not
        const c = await userModel.findOne({mail: req.body['mail']});
        if (!c) {
            // this message is for those who provide invalid emails and try to mess with system
            console.log('sending fake mail')
            return res.status(200).json({
                success: true,
                msg: 'check your email to finish logging in'
            });
        }
        // * here, the mail of user is considered as id of that person. this JWT will expire in giver amount of time in options object
        const signedJWT = jwt.sign({id: c._id.toString()}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});
        // send an email with a link href= endpoint?token=signedJWT

        // Step 1
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });
        // Step 2
        let mailOptions = {
            from: 'quillthe59@gmail.com',
            to: req.body.mail,
            subject: 'Login - The Quill',
            html: `<a style="
                display: flex;
                background-color: #202020;
                color: #ffffff;
                text-decoration: none;
                font-size: 1.3rem;
                width: fit-content;
                padding: 0.3rem 1.5rem;
                border-radius: 100vmax;"
            href="${req.body.redirect}?token=${signedJWT}">Click here to log in</a>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(404).json({
                    success: false,
                    msg: 'Email not sent'
                })
            } else {
                console.log('Email sent: ' + info.response);
                res.json({
                    success: true,
                    msg: 'check your email to finish logging in'
                });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'something went wrong'
        });
    }
};

// * this utility function gets the authorized user details from the request made by it
const getUserDetails = async (req) => {
    try {
        const userID = await isAuthorized(req);
        if (!userID) {
            return false;
        }
        // check if the user exist on database or not;
        const d = await userModel.findById(userID).select({'password': 0});
        if (d) {
            return d;
        }
        return false;
    } catch (error) {
        console.error(error)
        return false;
    }
}

const linkLogin = async (req, res) => {
    const token = req.query.token || null;
    if (!token) {
        //* unauthorized request
        return res.send('Invalid token');
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decodedToken.id);
        //* unauthorized request
        if (!user) return res.status(404).send('<h1>Unauthorized user</h1>');
        res.cookie('__login_token', token, {
            maxAge: 60480000 /* in milliseconds (1 week)*/,
            httpOnly: false,
            sameSite: 'STRICT'
        });
        res.json({success: true, data: null});// redirect to the dashboard (list view)
    } catch (e) {
        console.log(e);
        return res.send('some error occurred');
    }
}

const logout = async (req, res) => {
    res.clearCookie('__login_token');
    res.end();
}
module.exports = {authorize, login, isAuthorized, getUserDetails, linkLogin, verifyInputs, logout};