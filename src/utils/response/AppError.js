class AppError extends Error {
    constructor({ message, errorCode, statusCode, statusPhrase }) {
        super(message);
        this.errorType = 'CUSTOM';
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.statusPhrase = statusPhrase;
        Error.stackTraceLimit = 10;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;