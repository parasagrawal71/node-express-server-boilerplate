const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const rTracer = require('cls-rtracer');
const { utilConfig } = require('@parasagrawal71/paras-utils');
const { logRequests } = require('@parasagrawal71/paras-utils').middlewares;
const { appLogger, connectDatabase } = require('@parasagrawal71/paras-utils').utils;

// CUSTOM IMPORTS
const apiV1Router = require('api/api-v1.router');
const { errorResponse } = require('utils/response');
const config = require('config/config');
const { authLimiter } = require('middlewares/rateLimiter');

utilConfig.set({
    NODE_ENV: config.NODE_ENV,
    APP_NAME: config.APP_NAME,
    DISABLE_CONSOLE_LOG: config.DISABLE_CONSOLE_LOG,
    SHOW_COMPLETE_ERROR_IN_CONSOLE: config.SHOW_COMPLETE_ERROR_IN_CONSOLE,
    MONGODB_URL: config.database.MONGODB_URL,
    SENDGRID_API_KEY: config.SENDGRID_API_KEY,
    DEFAULT_SENDER: config.DEFAULT_SENDER,
});

const { APP_NAME, APP_PORT } = config;

/*
 *
 * ******************************************** Prerequisites *********************************************** //
 */
const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// set security HTTP headers
app.use(helmet());

// Attach request id
app.use(rTracer.expressMiddleware());

// To serve static files
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// limit repeated failed requests to auth endpoints
if (config.NODE_ENV === 'production') {
    app.use('/api/v1/auth', authLimiter);
}

/*
 *
 * ****************************************** Routers and Routes ******************************************** //
 */
// v1 api routes
app.use('/api/v1', logRequests, apiV1Router);

app.get('/healthcheck', logRequests, (req, res) => {
    res.send('Healthy');
});

app.get('/', logRequests, (req, res) => {
    res.send(`Welcome to ${APP_NAME} Server!`);
});

// send back a 404 error for any unknown api request
app.all('/*', logRequests, (req, res) => {
    errorResponse({ res, statusCode: 404, message: `Can't find ${req.method} ${req.originalUrl} on the server!` });
});

/*
 *
 * ************************************* Process Events and Error handling ********************************** //
 */

app.use((error, req, res, next) => {
    // Error Middleware:
    // error, req, res, and next. As long as we have these four arguments,
    // Express will recognize the middleware as an error handling middleware.
    errorResponse({ res, error });
});

process.on('unhandledRejection', (reason, promise) => {
    appLogger.error('------------------------ unhandledRejection error ----------------------');
    appLogger.error({ msg: `Unhandled Rejection at: ${promise}; reason: ${reason.stack}` });
    appLogger.error('------------------------------------------------------------------------');
    setTimeout(() => closeServer(), 1000);
});

process.on('uncaughtException', (error, origin) => {
    appLogger.error('------------------------ uncaughtException error -----------------------');
    appLogger.error({ msg: `uncaughtException error at origin = ${origin}`, error });
    appLogger.error('------------------------------------------------------------------------');
    setTimeout(() => closeServer(), 1000);
});

let server;
connectDatabase().then(() => {
    server = app.listen(APP_PORT, () => {
        appLogger.debug(`${APP_NAME} Server is running on ${APP_PORT}`);
    });
});

const closeServer = () => {
    if (server) {
        server.close(() => {
            appLogger.debug('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

function signalProcessCallback(signal) {
    if (server) {
        server.close();
    }
    appLogger.debug(`Server closed by ${signal === 'SIGTERM' ? 'killing process' : 'pressing Ctrl + C'}`);
}

process.on('SIGINT', signalProcessCallback);
process.on('SIGTERM', signalProcessCallback);
