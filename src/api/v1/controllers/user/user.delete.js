const catchAsync = require('utils/catchAsync');
const { userHelper } = require('api/v1/helpers');
const { successResponse } = require('utils/response');

module.exports.deleteUser = catchAsync(async (req, res) => {
    const deletedUser = await userHelper.deleteUserById(req.params.userId);

    return successResponse({ res, message: 'User removed successfully', data: deletedUser });
});
