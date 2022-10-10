const errorHandler = (err, request, response, next) => {
    const statusCode = response.statusCode ? response.statusCode : 500;
    response.status(statusCode);
    response.json({
        message: err.message, 
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = { errorHandler };