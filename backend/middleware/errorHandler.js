const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new Error(message);
        error.statusCode = 400;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new Error(message);
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new Error(message);
        error.statusCode = 400;
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again.';
        error = new Error(message);
        error.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Your token has expired. Please log in again.';
        error = new Error(message);
        error.statusCode = 401;
    }

    const statusCode = error.statusCode || res.statusCode || 500;

    res.status(statusCode === 200 ? 500 : statusCode).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
