const express = require('express');
const router = express.Router();
router.get('/',(req,res)=>{
    const cookies=req.cookies;
    res.send(`
    <h1>
    ${JSON.stringify(cookies)}
</h1>
`)
})

// * DB endpoints
const DBRouter = require('./DB-routes/DBEndpoints.cjs');
router.use('/api/v1', DBRouter)
module.exports = router