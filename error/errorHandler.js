const errorHandler = (_req, res) => {
    res.status(404).redirect('/error.html');
};
module.exports = errorHandler;