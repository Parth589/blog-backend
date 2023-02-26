const express = require('express');
const router = express.Router();
const {login,linkLogin} = require('../controller/auth/auth-middleware.cjs');

const {register} = require('../controller/auth/public-controllers.cjs');

router.get('/',(req,res)=>{
    const cookies=req.cookies;
    res.send(`
    <h1>
    ${JSON.stringify(cookies)}
</h1>
`)
})
// * Auth endpoints
router.post('/login', login);
router.post('/register', register);
router.get('/verify',linkLogin);

// * DB endpoints
const DBRouter = require('./DB-routes/DBEndpoints.cjs');
router.use('/api/v1', DBRouter)
module.exports = router