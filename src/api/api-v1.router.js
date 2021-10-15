const express = require('express');
const { authenticateRequests } = require('../middlewares/authenticateRequests');

// IMPORT OF ROUTER TO ALL RESOURCES
const userRouter = require('./v1/routes/user.route');
const docsRouter = require('./v1/routes/docs.route');

const apiRouter = express.Router();

// ROUTER TO ALL RESOURCES
apiRouter.use('/users', userRouter); // authenticateRequests
apiRouter.use('/docs', docsRouter);

module.exports = apiRouter;
