console.log('Application started');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB=require('./db/connect.cjs');
require('dotenv').config();
app.set('view engine', 'ejs');
let domain = process.env.DOMAIN;
if (domain === "ip") {
    // info: to set up server without a domain
    domain = require('ip').address(undefined, 'ipv4');
}

// * middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// * Routers
const mainRouter = require('./router/mainRouter.cjs');
app.use('/', mainRouter);

// * Error-control
const errorHandler = require('./error/errorHandler.cjs');
app.use(errorHandler);
// * Execution flow
const start = async () => {
    await connectDB(process.env.MONGO_URI);
};
start().then();
app.listen(PORT, domain, () => {
    console.log(`server started at ${domain}:${PORT}`);
});