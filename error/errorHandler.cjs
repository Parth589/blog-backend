const errorHandler = (_req, res) => {
    console.log('Resource not found for :' + _req.url);
    res.status(404).json({
        success: false,
        msg: 'Resource not found for query: ' + _req.url
    })
};
module.exports = errorHandler;