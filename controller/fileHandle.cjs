const multer = require('multer');
// const path = require("path");
const path = require("path");
const sharp = require("sharp");
const {getUserDetails} = require("./auth/auth-middleware.cjs");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: 'uploads/', filename: async function (req, file, cb) {
        const user = await getUserDetails(req);
        cb(null, user.mail + '.ext');
    }
})

const upload = multer({
    storage: storage, fileFilter: async function (req, file, cb) {
        // check the user credentials
        const user = await getUserDetails(req);
        if (!user) {
            return cb(new Error('user is not authorized to perform this task'), false);
        }
        // check file for invalid inputs
        if (file.mimetype !== 'image/png') {
            return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
    }, limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }

});

const convertImage = async (filepath, filename) => {
    const res = await sharp(filepath)// file path here
        .resize(200, 200, {
            fit: 'contain'
        })
        .toFile(path.join(__dirname, '../userProfiles/' + filename.substring(0, filename.lastIndexOf('.')) + '.png'));

    await fs.unlink(filepath, () => {

    });
}
module.exports = {
    upload, convertImage
}
