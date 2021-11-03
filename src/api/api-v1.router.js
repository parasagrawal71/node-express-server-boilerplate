const express = require('express');
const { authenticateRequests } = require('../middlewares/authenticateRequests');

// IMPORT OF ROUTER TO ALL RESOURCES
const { authRouter, userRouter, docsRouter } = require('./v1/routes');

const router = express.Router();

// ROUTER TO ALL RESOURCES
router.use('/users', userRouter); // authenticateRequests
router.use('/auth', authRouter);
if (process.env.NODE_ENV === 'development') {
    router.use('/docs', docsRouter);
}

module.exports = router;
