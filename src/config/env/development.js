module.exports = {
    HOST_URL: 'http://localhost:5100/api/v1',
    FRONTEND_URL: 'http://localhost:4000/dashboard',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    JSON_PLACEHOLDER_HOST: `https://jsonplaceholder.typicode.com`,

    logger: {
        DISABLE_CONSOLE_LOG: false,
        SHOW_COMPLETE_ERROR_IN_CONSOLE: false,
    },

    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    DEFAULT_SENDER: 'parasagrawal71@gmail.com', // "no-reply@api-documenter.com"
};
