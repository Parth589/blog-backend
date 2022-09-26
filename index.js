console.log('Application started');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const blogRouter = require('./router/api');
const serverRouter = require('./router/server');
const connectDB = require('./db/connect');
require('dotenv').config();
app.set('view-engine', 'ejs');

if (process.env.DOMAIN === "false") {
    // info: to setup server without a domain
    var ip = require('ip').address(undefined, 'ipv4');
}

// * middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public/static'));

// * Routers
app.use('/api/v1/blogs', blogRouter);
app.use('/', serverRouter);

// * Execution flow
const start = async () => {
    await connectDB(process.env.MONGO_URI);
};
start();
app.listen(PORT, ip || 'localhost', () => {
    console.log('server started at port ' + PORT, ip);
});