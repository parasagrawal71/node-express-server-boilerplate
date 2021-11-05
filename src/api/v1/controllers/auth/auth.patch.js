const { UserModel } = require('api/v1/models');
const { successResponse, createBadRequestError, createRecordNotFoundError, createRequiredParamError } = require('utils/response');
const { sendMail } = require('utils/send-mail');
const { randomNumbers } = require('utils/helperFunctions');
const { verifyEmailByOtpTemplate } = require('api/v1/email-templates/verify-email-by-otp');
const { accountVerificationTemplate } = require('api/v1/email-templates/account-verification');
const { signJwtToken } = require('api/v1/helpers/auth.helper');
const catchAsync = require('utils/catchAsync');

/**
 * @description Function to set password / reset password
 */
module.exports.setPassword = catchAsync(async (req, res) => {
    const { email, password } = req.query;
    if (!email || !password) {
        throw createRequiredParamError(`${!email ? 'email' : 'password'}`);
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
        throw createRecordNotFoundError('email', email); // TODO: why 'user' as error in the response in the previous version ?
    }

    user = await UserModel.findOneAndUpdate({ email }, { password });

    const [token, expiry] = signJwtToken(user);
    return successResponse({ res, message: 'Password set successfully', data: { user, token, expiry } });
});

/**
 * @description Function to handle forgot password (send otp to user's email)
 */
module.exports.handleForgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.query;
    if (!email) {
        throw createRequiredParamError(`email`);
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
        throw createRecordNotFoundError('email', email);
    }

    const otp = randomNumbers(4);
    user = await UserModel.findOneAndUpdate({ email }, { otp });

    const _verifyEmailByOtpTemplate = verifyEmailByOtpTemplate(otp, user.name);
    const sendMailRes = await sendMail({ to: email, subject: 'Verify Your Email', html: _verifyEmailByOtpTemplate });
    if (sendMailRes && sendMailRes[0] === false) {
        return next(sendMailRes[1]);
    }

    return successResponse({ res, message: 'OTP sent to your email address successfully', data: user });
});

/**
 * @description Function to verify email address by OTP sent on email
 */
module.exports.verifyEmailAddress = catchAsync(async (req, res) => {
    const { email, otp } = req.query;
    if (!email || !otp) {
        throw createRequiredParamError(`${!email ? 'email' : 'otp'}`);
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
        throw createBadRequestError(`Email verification failed: User not found`);
    }

    const [validate, info] = await user.isValidOtp(otp);
    if (!validate) {
        throw createBadRequestError(`Email verification failed: Wrong OTP`);
    }

    user = await UserModel.findOneAndUpdate({ email }, { $unset: { otp: 1 } });
    return successResponse({ res, message: 'Email verified successfully', data: user });
});

/**
 * @description Function to resend account verification email
 */
module.exports.resendVerificationEmail = catchAsync(async (req, res) => {
    const { email } = req.query;
    if (!email) {
        throw createRequiredParamError(`email`);
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
        throw createRecordNotFoundError(`email`, email);
    }

    if (user && user.isVerified) {
        throw createBadRequestError(`Already verified: Please login to your account`, 'ALREADY_VERIFIED');
    }

    const otp = randomNumbers(4);
    user = await UserModel.findOneAndUpdate({ email }, { otp });
    const _accountVerificationTemplate = accountVerificationTemplate(email, otp, user.name);

    const sendMailRes = await sendMail({
        to: email,
        subject: 'Resend: Account Verification',
        html: _accountVerificationTemplate,
    });
    if (sendMailRes && sendMailRes[0] === false) {
        return next(sendMailRes[1]);
    }

    return successResponse({ res, message: 'Verification email resent', data: user });
});
