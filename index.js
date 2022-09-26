console.log('Application started');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const blogRouter = require('./router/api');
const serverRouter = require('./router/server');
const connectDB = require('./db/connect');
require('dotenv').config();
app.set('view-engine', 'ejs');
var domain = process.env.DOMAIN;
if (domain === "ip") {
    // info: to setup server without a domain
    domain = require('ip').address(undefined, 'ipv4');
}

// * middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public/static'));

// * Routers
app.use('/api/v1/blogs', blogRouter);
app.use('/', serverRouter);

// * Error-control
const errorHandler = require('./error/errorHandler');
app.use(errorHandler);
// * Execution flow
const start = async () => {
    await connectDB(process.env.MONGO_URI);
};
start();
app.listen(PORT, domain, () => {
    console.log(`server started at http://${domain}:${PORT}`);
});