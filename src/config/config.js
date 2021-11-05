const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, `../../.env`) });

/*
 * ******************************************** SETTING ENVIRONMENT VARIABLES *********************************************** //
 */
const commonEnvVars = require('./env/common');
const productionEnvVars = require('./env/production');
const developmentEnvVars = require('./env/development');
const testEnvVars = require('./env/test');
let localEnvVars = {};
try {
    localEnvVars = require('./env/local');
} catch (e) {}

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
    throw 'Please set NODE_ENV!';
}

if (!commonEnvVars.ALL_ENVS.includes(NODE_ENV)) {
    throw `NODE_ENV must be ${commonEnvVars.ALL_ENVS.join(' / ')}`;
}

let envVars = commonEnvVars;

if (NODE_ENV === 'production') {
    envVars = Object.assign(envVars, productionEnvVars);
} else if (NODE_ENV === 'development') {
    envVars = Object.assign(envVars, developmentEnvVars);
} else if (NODE_ENV === 'test') {
    envVars = Object.assign(envVars, testEnvVars);
}

envVars = Object.assign(envVars, localEnvVars);
envVars.NODE_ENV = process.env.NODE_ENV;

// console.log(`envVars `, envVars);

// Environment Preference order
// COMMON  <  CURRENT ENV  <  LOCAL
// LOCAL is not pushed to github
/*
 * **************************************************************************************************************************** //
 */

/*
 * ******************************************** ENVIRONMENT VARIABLES VALIDATIONS ********************************************* //
 */
// const envVarsSchema = Joi.object()
//     .keys({
//         NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
//         PORT: Joi.number().default(3000),
//         MONGODB_URL: Joi.string().required().description('Mongo DB url'),
//         JWT_SECRET: Joi.string().required().description('JWT secret key'),
//         JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
//         JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
//         JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which reset password token expires'),
//         JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which verify email token expires'),
//     })
//     .unknown();

// const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

// if (error) {
//     throw new Error(`Config validation error: ${error.message}`);
// }
/*
 * **************************************************************************************************************************** //
 */

/*
 * ******************************************** EXPORTING ENVIRONMENT VARIABLES *********************************************** //
 */
module.exports = envVars;
