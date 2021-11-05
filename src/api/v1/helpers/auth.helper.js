const moment = require('moment');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_ISSUED_BY } = require('config/config');

/**
 * @description Function to sign jwt token
 */
module.exports.signJwtToken = (user) => {
    const expiry = +moment(new Date()).add(24, 'hours').format('x');

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            iss: JWT_ISSUED_BY,
            iat: +moment(new Date()).format('x'),
            exp: expiry,
        },
        JWT_SECRET
    );
    return [token, expiry];
};
