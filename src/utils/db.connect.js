const mongoose = require('mongoose');
const { database } = require('../config/config');
const { appLogger } = require('./appLogger');

module.exports.connectDatabase = () => {
    return mongoose
        .connect(database.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(() => {
            appLogger.debug('Successfully connected to the database');
        })
        .catch((error) => {
            appLogger.error({ msg: 'Could not connect to the database.', error });
            // appLogger.error({ msg: "Could not connect to the database. Exiting now...", error });
            // process.exit();
        });
};

/*
 *
 * *********************************************** CONNECTION EVENTS ******************************************** //
 */
// When successfully connected
mongoose.connection.on('connected', () => {
    appLogger.debug('Mongoose connection opened');
});

// If the connection throws an error
mongoose.connection.on('error', (error) => {
    // appLogger.error({ msg: "Mongoose connection error: ", error });
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    appLogger.debug('Mongoose connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        appLogger.debug('Mongoose connection disconnected through app termination');
        process.exit(0); // REQUIRED
    });
});
