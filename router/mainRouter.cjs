const express = require('express');
const router = express.Router();
const {login} = require('../controller/auth/auth-middleware.cjs');

const {register} = require('../controller/auth/public-controllers.cjs');

// * Auth endpoints
router.post('/login', login);
router.post('/register', register);


// * DB endpoints
const DBRouter = require('./DB-routes/DBEndpoints.cjs');
router.use('/api/v1', DBRouter)
module.exports = router