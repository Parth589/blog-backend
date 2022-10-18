const router = require('express').Router();
router.get('/blogs', (req, res) => {
    res.json({success: true, data: [1, 3, 4, 5]})
})
module.exports = router;