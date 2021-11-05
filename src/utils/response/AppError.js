class AppError extends Error {
    constructor({ message, debugMessage, errorCode, statusCode, statusPhrase }) {
        super();
        this.message = message;
        this.debugMessage = debugMessage;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.statusPhrase = statusPhrase;
        Error.stackTraceLimit = 10;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
