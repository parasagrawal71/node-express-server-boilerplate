const catchAsync = require('utils/catchAsync');
const { userHelper } = require('api/v1/helpers');
const { successResponse } = require('utils/response');

/**
 * Controller to update a user
 *
 */
module.exports.updateUser = catchAsync(async (req, res) => {
    const user = await userHelper.updateUserById(req.params.userId, req.body);

    return successResponse({ res, message: 'User updated successfully', data: user });
});
