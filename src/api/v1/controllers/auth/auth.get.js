const { OAuth2Client } = require('google-auth-library');
const path = require('path');

// CUSTOM IMPORTS
const catchAsync = require('utils/catchAsync');
const { authHelper } = require('api/v1/helpers');
const { successResponse, createBadRequestError } = require('utils/response');
const { UserModel } = require('api/v1/models');
const { GOOGLE_CLIENT_ID, FRONTEND_URL, APP_NAME } = require('config/config');
const { signJwtToken } = require('api/v1/helpers/auth.helper');

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Controller to login
 *
 */
module.exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.query;

    const user = await UserModel.findOne({ email });
    if (!user) {
        throw createBadRequestError('User not found', 'USER_NOT_FOUND');
    }

    if (user && !user.isVerified) {
        throw createBadRequestError('Account not verified', 'USER_NOT_VERIFIED');
    }

    if (user && !user.password) {
        throw createBadRequestError('Password not set', 'PASSWORD_NOT_SET');
    }

    const validate = await user.isValidPassword(password);
    if (!validate) {
        throw createBadRequestError('Wrong Password', 'WRONG_PASSWORD');
    }

    const [token, expiry] = authHelper.signJwtToken(user);
    return successResponse({ res, message: 'Logged in successfully', data: { token, expiry, user } });
});

/**
 * @description Function to login / register using google oauth
 */
module.exports.googleLogin = catchAsync(async (req, res) => {
    const { authorization } = req.headers;

    const googleResponse = await googleClient.verifyIdToken({
        idToken: authorization.substring(7),
        audience: GOOGLE_CLIENT_ID,
    });

    if (googleResponse) {
        const { email_verified, name, email, tokenId } = googleResponse.payload;

        let user = await UserModel.findOne({ email });
        if (!user) {
            user = await UserModel.create({ email, name, isVerified: true });
        }

        return successResponse({ res, message: 'Logged in successfully', data: user });
    }

    return errorResponse({ res, statusCode: 500, message: 'Something went wrong!' });
});

/**
 * @description Function to verify new account by pressing verify button on email sent
 */
module.exports.accountVerification = catchAsync(async (req, res) => {
    const { email, otp } = req.query;
    if (!email || !otp) {
        throw createBadRequestError(`${!email ? 'email' : 'otp'}`);
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
        throw createBadRequestError(`Account verification failed: User not found`);
    }

    if (user && user.isVerified) {
        return res.render(path.join(__dirname, '../../views/verify-email-error.html'), {
            url: FRONTEND_URL,
            info: 'Already verified',
            appName: APP_NAME,
        });
    }

    const [validate, info] = await user.isValidOtp(otp);
    if (!validate) {
        return res.render(path.join(__dirname, '../../views/verify-email-error.html'), {
            url: FRONTEND_URL,
            info,
            appName: APP_NAME,
        });
    }

    user = await UserModel.findOneAndUpdate({ email }, { $unset: { otp: 1 }, $set: { isVerified: true } });
    return res.render(path.join(__dirname, '../../views/verify-email-success.html'), {
        url: FRONTEND_URL,
        info: 'Thank you for verifying your email address',
        appName: APP_NAME,
    });
});
