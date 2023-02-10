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

//* the authorize function will be used to check if the host is eligible for accessing the database or not
const authorize = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({msg: 'User is not authorized'});
    }
    try {
        const decode = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
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

// * this utility function checks if the request is made by authorized user or not
const isAuthorized = async (req) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return false;
    }
    try {
        const decode = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
        // check if the user exist on database or not;
        if ((await userModel.find({mail: decode.id})).length !== 1) {
            return false;
        }
        // res.status(200).json({success: true, msg: 'Authentication successful'});
        return true;
    } catch (error) {
        console.error(error)
        return false;
    }
}
//* the login function will be used to provide the JWT token to any user stored in DB
const login = async (req, res) => {
    if (!req.body['mail']) {
        return res.status(400).json({msg: 'email is required in order to login'});
    }
    try {
        // check if the given mail and password are correct or not
        const c = await verifyUser(req.body['mail']);
        if (!c) {
            // this message is for those who provide invalid emails and try to mess with system
            return res.status(200).json({
                success: true,
                msg: 'check your email to finish logging in'
            });
        }
        // * here, the mail of user is considered as id of that person. this JWT will expire in giver amount of time in options object
        const signedJWT = jwt.sign({id: req.body['mail']}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
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
            subject: 'Nodemailer - Test',
            html: `<a href="http://${process.env.DOMAIN}/verify/?token=${signedJWT}">Click here to log in</a>`
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
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return false;
    }
    try {
        const decode = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
        // check if the user exist on database or not;
        const d = await userModel.findOne({mail: decode.id}).select({'password': 0});
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
        const user = await userModel.findOne({mail: decodedToken.id});
        //* unauthorized request
        if(!user)return res.status(404).send('Unauthorized user');
        return res.send(`
        <html lang="en">
        <body>
        Authed with mail: ${user.username}
        <script>
            const jwt="${token}";
            localStorage.setItem('token',jwt);
            location.href="http://${process.env.DOMAIN}/"
        </script>
        </body>
        </html>
        `);
    } catch (e) {
        console.log(e);
        return res.send('some error occurred');
    }
    // res.redirect('/');// redirect to the dashboard (list view)
}


module.exports = {authorize, login, isAuthorized, getUserDetails, linkLogin};