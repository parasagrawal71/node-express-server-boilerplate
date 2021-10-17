module.exports = {
    ALL_ENVS: ['production', 'development', 'test'],
    APP_PORT: 5100,
    APP_NAME: 'Node-Boilerplate',
    APP_ID: 'NODE',

    database: {
        MONGODB_URL: 'mongodb://127.0.0.1:27017/node-boilerplate',
    },

    logger: {
        DISABLE_CONSOLE_LOG: true,
        SHOW_COMPLETE_ERROR_IN_CONSOLE: false,
    },

    jwt: {
        // JWT secret key
        JWT_SECRET: 'thisisasamplesecret',
        // Number of minutes after which an access token expires
        JWT_ACCESS_EXPIRATION_MINUTES: 30,
        // Number of days after which a refresh token expires
        JWT_REFRESH_EXPIRATION_DAYS: 30,
        // Number of minutes after which a reset password token expires
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: 10,
        // Number of minutes after which a verify email token expires
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: 10,
    },
};
