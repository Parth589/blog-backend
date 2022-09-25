const mongoose = require('mongoose');
const connectDB = async (URI) => {
    if (!URI) return console.log('URI not found');
    try {
        await mongoose.connect(URI);
        console.log('Connection successful...');
    } catch (error) {
        console.log(error);
    }
};
module.exports = connectDB;