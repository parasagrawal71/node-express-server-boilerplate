// CUSTOM IMPORTS
const catchAsync = require('utils/catchAsync');
const { authHelper } = require('api/v1/helpers');
const { successResponse, createBadRequestError, errorResponse } = require('utils/response');
const { randomNumbers } = require('utils/helperFunctions');
const { UserModel } = require('api/v1/models');
const { accountVerificationTemplate } = require('../../email-templates/account-verification');
const { sendMail } = require('utils/send-mail');

/**
 * Controller to register new user
 *
 */
module.exports.register = catchAsync(async (req, res, next) => {
    const { email, password, name } = req.body;

    let user = await UserModel.findOne({ email });
    if (user && user.isVerified) {
        throw createBadRequestError('Already registered: Please login to your account', 'ALREADY_REGISTERED');
    }

    if (user && !user.isVerified) {
        throw createBadRequestError('Account not verified', 'USER_NOT_VERIFIED');
    }

    const otp = randomNumbers(4);
    const _accountVerificationTemplate = accountVerificationTemplate(email, otp);

    if (!user) {
        user = await UserModel.create({ name, email, password, otp });
    }

    const sendMailRes = await sendMail({
        to: email,
        subject: 'Account Verification',
        html: _accountVerificationTemplate,
    });
    if (sendMailRes && sendMailRes[0] === false) {
        return next(sendMailRes[1]);
    }

    return successResponse({
        res,
        message: 'Account created: Please verify your email address',
        data: user,
    });
});
