const httpStatus = require('http-status');
const catchAsync = require('utils/catchAsync');
const { userHelper } = require('api/v1/helpers');
const { successResponse } = require('utils/response');

/**
 * Controller to create a user
 *
 */
module.exports.createUser = catchAsync(async (req, res) => {
    const user = await userHelper.createUser(req.body);

    return successResponse({ res, statusCode: httpStatus.CREATED, message: 'User added successfully', data: user });
});
