import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    logger.error(err.message);

    const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};