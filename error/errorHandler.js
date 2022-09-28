const errorHandler = (_req, res) => {
    console.log('Resourse not found for :' + _req.url);
    res.status(404).redirect('/error.html');
};
module.exports = errorHandler;