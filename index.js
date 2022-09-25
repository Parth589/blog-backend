console.log('Application started');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const blogRouter = require('./router/blogs.js');
const connectDB = require('./db/connect');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public/static'));

app.use('/api/v1/blogs', blogRouter);
// app.use('/api/v1/blogs/search', (re, res) => {
//     res.send("HEY MOKNEJK");
// });

const start = async () => {
    await connectDB(process.env.MONGO_URI);
};
start();
app.listen(PORT, () => {
    console.log('server started at port ' + PORT);
});